import { useState, useEffect, useRef, useCallback } from 'react';
import { resolveImageSources } from '@ipfsnut/evermark-sdk-core';
import { ImageLoader, CORSHandler, PerformanceMonitor } from '@ipfsnut/evermark-sdk-browser';
/**
 * React hook for loading images with intelligent fallbacks
 */
export function useImageLoader(input, options = {}) {
    const { autoLoad = true, resolution, supabase, ...loaderOptions } = options;
    // State
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState(null);
    const [currentSource, setCurrentSource] = useState(null);
    const [fromCache, setFromCache] = useState(false);
    const [loadTime, setLoadTime] = useState(null);
    const [attempts, setAttempts] = useState([]);
    // Refs
    const loaderRef = useRef(null);
    const corsHandlerRef = useRef(null);
    const performanceRef = useRef(null);
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
            debug: false,
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
        if (!loaderRef.current)
            return;
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
            const processedSources = await Promise.all(sources.map(async (source) => {
                if (corsHandlerRef.current?.isSupabaseStorageUrl(source.url)) {
                    const authenticatedUrl = await corsHandlerRef.current.authenticateSupabaseRequest(source.url);
                    return { ...source, url: authenticatedUrl };
                }
                return source;
            }));
            setCurrentSource(processedSources[0]?.url || null);
            // Load image
            const result = await loaderRef.current.loadImage(processedSources);
            // Update attempts
            const attemptResults = result.attempts?.map((attempt) => {
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
            }
            else {
                throw new Error(result.error || 'Failed to load image');
            }
        }
        catch (err) {
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
        }
        finally {
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
//# sourceMappingURL=useImageLoader.js.map