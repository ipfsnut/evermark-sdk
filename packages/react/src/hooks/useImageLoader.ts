import { useState, useEffect, useRef, useCallback } from 'react';
import { resolveImageSources } from '@evermark-sdk/core';
import { ImageLoader, CORSHandler, PerformanceMonitor, type LoadImageResult } from '@evermark-sdk/browser';
import type { 
  ImageSourceInput, 
  SourceResolutionConfig,
  LoadAttempt
} from '@evermark-sdk/core';

export interface UseImageLoaderOptions {
  /** Maximum number of retry attempts per source */
  maxRetries?: number;
  /** Timeout for each load attempt in milliseconds */
  timeout?: number;
  /** Whether to use CORS mode */
  useCORS?: boolean;
  /** Custom headers for requests */
  headers?: Record<string, string>;
  /** Progress callback */
  onProgress?: (loaded: number, total: number) => void;
  /** Debug mode for detailed logging */
  debug?: boolean;
  /** Whether to start loading immediately */
  autoLoad?: boolean;
  /** Resolution configuration */
  resolution?: SourceResolutionConfig;
  /** Supabase configuration for CORS */
  supabase?: {
    url: string;
    anonKey: string;
  };
}

export interface UseImageLoaderResult {
  /** Current image URL if loaded successfully */
  imageUrl: string | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  hasError: boolean;
  /** Error message */
  error: string | null;
  /** Current source being attempted */
  currentSource: string | null;
  /** Whether image was loaded from cache */
  fromCache: boolean;
  /** Total load time in milliseconds */
  loadTime: number | null;
  /** Manual load trigger */
  load: () => void;
  /** Retry current load */
  retry: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** All attempted sources */
  attempts: Array<{ url: string; success: boolean; error?: string }>;
}

/**
 * React hook for loading images with intelligent fallbacks
 */
export function useImageLoader(
  input: ImageSourceInput,
  options: UseImageLoaderOptions = {}
): UseImageLoaderResult {
  const {
    autoLoad = true,
    resolution,
    supabase,
    ...loaderOptions
  } = options;

  // State
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<Array<{ url: string; success: boolean; error?: string }>>([]);

  // Refs
  const loaderRef = useRef<ImageLoader | null>(null);
  const corsHandlerRef = useRef<CORSHandler | null>(null);
  const performanceRef = useRef<PerformanceMonitor | null>(null);

  // Initialize services
  useEffect(() => {
    // Initialize CORS handler if Supabase config provided
    if (supabase) {
      corsHandlerRef.current = new CORSHandler({
        supabaseUrl: supabase.url,
        supabaseAnonKey: supabase.anonKey
      });
    }

    // Initialize performance monitor
    performanceRef.current = new PerformanceMonitor();

    // Initialize image loader
    loaderRef.current = new ImageLoader({
      debug: process.env.NODE_ENV === 'development',
      timeout: 8000,
      maxRetries: 2,
      ...loaderOptions
    });

    return () => {
      loaderRef.current?.abort();
    };
  }, [supabase?.url, supabase?.anonKey]);

  // Load function
  const load = useCallback(async () => {
    if (!loaderRef.current) return;

    try {
      setIsLoading(true);
      setHasError(false);
      setError(null);
      setAttempts([]);

      // Resolve image sources
      const sources = resolveImageSources(input, resolution);
      
      if (sources.length === 0) {
        throw new Error('No valid image sources found');
      }

      // Process sources through CORS handler if available
      const processedSources = await Promise.all(
        sources.map(async (source) => {
          if (corsHandlerRef.current?.isSupabaseStorageUrl(source.url)) {
            const authenticatedUrl = await corsHandlerRef.current.authenticateSupabaseRequest(source.url);
            return { ...source, url: authenticatedUrl };
          }
          return source;
        })
      );

      setCurrentSource(processedSources[0]?.url || null);

      // Load image
      const result: LoadImageResult = await loaderRef.current.loadImage(processedSources);

      // Update attempts
      const attemptResults = result.attempts?.map((attempt: LoadAttempt) => {
        const base = {
          url: attempt.source.url,
          success: attempt.status === 'success'
        };
        return attempt.error !== undefined
          ? { ...base, error: attempt.error }
          : base;
      }) || [];
      setAttempts(attemptResults);

      if (result.success && result.imageUrl) {
        setImageUrl(result.imageUrl);
        setFromCache(result.fromCache || false);
        setLoadTime(result.loadTime || null);
        setCurrentSource(result.imageUrl);

        // Record performance metrics
        if (performanceRef.current && result.source) {
          performanceRef.current.recordLoad({
            url: result.imageUrl,
            source: result.source.metadata?.storageProvider || 'unknown',
            startTime: Date.now() - (result.loadTime || 0),
            endTime: Date.now(),
            loadTime: result.loadTime || 0,
            fromCache: result.fromCache || false,
            success: true,
            retryCount: (result.attempts?.length || 1) - 1
          });
        }
      } else {
        throw new Error(result.error || 'Failed to load image');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setHasError(true);
      setImageUrl(null);
      setCurrentSource(null);

      // Record failed load
      if (performanceRef.current) {
        performanceRef.current.recordLoad({
          url: input.supabaseUrl || 'unknown',
          source: 'unknown',
          startTime: Date.now(),
          endTime: Date.now(),
          loadTime: 0,
          fromCache: false,
          success: false,
          error: errorMessage,
          retryCount: 0
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [input, resolution]);

  // Retry function
  const retry = useCallback(() => {
    load();
  }, [load]);

  // Reset function
  const reset = useCallback(() => {
    setImageUrl(null);
    setIsLoading(false);
    setHasError(false);
    setError(null);
    setCurrentSource(null);
    setFromCache(false);
    setLoadTime(null);
    setAttempts([]);
    loaderRef.current?.abort();
  }, []);

  // Auto-load effect
  useEffect(() => {
    if (autoLoad && (input.supabaseUrl || input.thumbnailUrl || input.ipfsHash)) {
      load();
    }
  }, [autoLoad, input.supabaseUrl, input.thumbnailUrl, input.ipfsHash, load]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      loaderRef.current?.abort();
    };
  }, []);

  return {
    imageUrl,
    isLoading,
    hasError,
    error,
    currentSource,
    fromCache,
    loadTime,
    attempts,
    load,
    retry,
    reset
  };
}