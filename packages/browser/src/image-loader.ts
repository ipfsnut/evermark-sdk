import type { 
  ImageSource, 
  LoadAttempt, 
  LoadingState, 
  ImageLoadingError, 
  Result 
} from '@ipfsnut/evermark-sdk-core';
import { CacheManager, type CacheConfig, type CacheEntry } from './cache-manager.js';
import { PerformanceMonitor } from './performance.js';

export interface ImageLoaderOptions {
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
  /** Cache configuration */
  cache?: {
    enabled?: boolean;
    maxSize?: number;
    maxEntries?: number;
    ttl?: number;
    persistent?: boolean;
  };
  /** Performance monitoring */
  monitoring?: {
    enabled?: boolean;
    maxMetrics?: number;
  };
}

export interface LoadImageResult {
  success: boolean;
  imageUrl?: string;
  source?: ImageSource;
  loadTime?: number;
  fromCache?: boolean;
  error?: string;
  attempts?: LoadAttempt[];
}

/**
 * Browser-specific image loader that handles CORS, retries, and fallbacks
 */
export class ImageLoader {
  private abortController: AbortController | null = null;
  private cacheManager: CacheManager;
  private performanceMonitor?: PerformanceMonitor;

  constructor(private options: ImageLoaderOptions = {}) {
    this.options = {
      maxRetries: 2,
      timeout: 8000,
      useCORS: true,
      debug: false,
      cache: { enabled: true },
      monitoring: { enabled: false },
      ...options
    };

    // Build cache config properly for exactOptionalPropertyTypes
    const cacheConfig: CacheConfig = {};
    
    if (this.options.cache?.maxSize !== undefined) {
      cacheConfig.maxSize = this.options.cache.maxSize;
    }
    
    if (this.options.cache?.maxEntries !== undefined) {
      cacheConfig.maxEntries = this.options.cache.maxEntries;
    }
    
    if (this.options.cache?.ttl !== undefined) {
      cacheConfig.ttl = this.options.cache.ttl;
    }
    
    if (this.options.cache?.persistent !== undefined) {
      cacheConfig.persistent = this.options.cache.persistent;
    }

    // Initialize cache manager with properly constructed config
    this.cacheManager = new CacheManager(cacheConfig);

    // Initialize performance monitor if enabled
    if (this.options.monitoring?.enabled) {
      this.performanceMonitor = new PerformanceMonitor();
    }
  }

  /**
   * Load image from multiple sources with intelligent fallback
   */
  async loadImage(sources: ImageSource[]): Promise<LoadImageResult> {
    if (!sources.length) {
      return {
        success: false,
        error: 'No image sources provided'
      };
    }

    const startTime = Date.now();
    const attempts: LoadAttempt[] = [];
    
    this.abortController = new AbortController();

    try {
      // Try each source in priority order
      for (const source of sources) {
        if (this.abortController.signal.aborted) {
          break;
        }

        const attempt = await this.attemptLoad(source, attempts.length);
        attempts.push(attempt);

        if (attempt.status === 'success') {
          const loadTime = Date.now() - startTime;
          
          // Check if loaded from cache
          const fromCache = this.isFromCache(source.url);
          
          this.log(`✅ Image loaded successfully from ${source.metadata?.storageProvider} in ${loadTime}ms`);
          
          // Record performance metrics
          if (this.performanceMonitor) {
            this.performanceMonitor.recordLoad({
              url: source.url,
              source: source.metadata?.storageProvider || 'unknown',
              startTime,
              endTime: Date.now(),
              loadTime,
              fromCache,
              success: true,
              retryCount: attempts.length - 1
            });
          }

          return {
            success: true,
            imageUrl: source.url,
            source,
            loadTime,
            fromCache,
            attempts
          };
        }

        this.log(`❌ Failed to load from ${source.metadata?.storageProvider}: ${attempt.error}`);
      }

      // All sources failed
      const totalTime = Date.now() - startTime;
      this.log(`💥 All ${sources.length} sources failed after ${totalTime}ms`);

      // Record failure metrics
      if (this.performanceMonitor && sources.length > 0) {
        const firstSource = sources[0];
        if (firstSource) {
          this.performanceMonitor.recordLoad({
            url: firstSource.url,
            source: firstSource.metadata?.storageProvider || 'unknown',
            startTime,
            endTime: Date.now(),
            loadTime: totalTime,
            fromCache: false,
            success: false,
            error: `Failed to load from ${sources.length} sources`,
            retryCount: attempts.length
          });
        }
      }

      return {
        success: false,
        error: `Failed to load image from ${sources.length} sources`,
        attempts
      };

    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown loading error',
        attempts
      };
    } finally {
      this.cleanup();
    }
  }

  /**
   * Attempt to load a single image source
   */
  private async attemptLoad(source: ImageSource, attemptIndex: number): Promise<LoadAttempt> {
    const startTime = Date.now();
    const attempt: LoadAttempt = {
      source,
      startTime,
      status: 'pending'
    };

    try {
      // Check cache first
      if (this.options.cache?.enabled && this.cacheManager.has(source.url)) {
        attempt.endTime = Date.now();
        attempt.status = 'success';
        attempt.debug = { networkTime: 0, cacheHit: true };
        this.log(`💾 Cache hit for ${source.url}`);
        return attempt;
      }

      // Attempt to load with retries
      let lastError: Error | null = null;
      const maxRetries = this.options.maxRetries || 2;

      for (let retry = 0; retry <= maxRetries; retry++) {
        if (this.abortController?.signal.aborted) {
          attempt.status = 'aborted';
          break;
        }

        try {
          await this.loadWithTimeout(source.url, source.timeout || this.options.timeout!);
          
          // Success - update cache with proper CacheEntry type
          if (this.options.cache?.enabled) {
            // Create a proper CacheEntry with required fields
            const cacheEntry: Partial<CacheEntry> = {
              url: source.url,
              timestamp: Date.now(),
              loadTime: Date.now() - startTime,
              accessCount: 1,
              lastAccessed: Date.now()
            };
            
            // Add optional properties if available
            if (source.metadata?.format) {
              const formatToMimeType: Record<string, string> = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp',
                'svg': 'image/svg+xml'
              };
              
              const mimeType = formatToMimeType[source.metadata.format];
              if (mimeType) {
                cacheEntry.mimeType = mimeType;
              }
            }
            
            // Estimate size if not available (rough estimate based on format)
            if (!cacheEntry.size && source.metadata?.format) {
              const estimatedSizes: Record<string, number> = {
                'jpg': 100000,   // ~100KB average
                'jpeg': 100000,
                'png': 200000,   // ~200KB average
                'gif': 150000,   // ~150KB average
                'webp': 80000,   // ~80KB average
                'svg': 10000     // ~10KB average
              };
              
              cacheEntry.size = estimatedSizes[source.metadata.format] || 100000;
            }
            
            this.cacheManager.set(source.url, cacheEntry);
          }
          
          attempt.endTime = Date.now();
          attempt.status = 'success';
          attempt.debug = {
            networkTime: attempt.endTime - startTime,
            cacheHit: false
          };
          
          return attempt;

        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Load failed');
          
          if (retry < maxRetries) {
            // Exponential backoff for retries
            const delay = Math.min(1000 * Math.pow(2, retry), 3000);
            await this.delay(delay);
            this.log(`🔄 Retrying ${source.url} (attempt ${retry + 2}/${maxRetries + 1})`);
          }
        }
      }

      // All retries failed
      attempt.endTime = Date.now();
      attempt.status = 'failed';
      attempt.error = lastError?.message || 'Unknown error';

      // Detect specific error types
      if (lastError?.message.includes('CORS')) {
        attempt.debug = { corsIssue: true };
      }

      return attempt;

    } catch (error) {
      attempt.endTime = Date.now();
      attempt.status = 'failed';
      attempt.error = error instanceof Error ? error.message : 'Unknown error';
      return attempt;
    }
  }

  /**
   * Load image with timeout and CORS handling
   */
  private loadWithTimeout(url: string, timeout: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Set up timeout
      const timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error(`Image load timeout after ${timeout}ms`));
      }, timeout);

      // Set up abort handling
      const abortHandler = () => {
        cleanup();
        reject(new Error('Image load aborted'));
      };
      
      this.abortController?.signal.addEventListener('abort', abortHandler);

      const cleanup = () => {
        clearTimeout(timeoutId);
        this.abortController?.signal.removeEventListener('abort', abortHandler);
        img.onload = null;
        img.onerror = null;
      };

      // Set up load handlers
      img.onload = () => {
        cleanup();
        resolve();
      };

      img.onerror = () => {
        cleanup();
        reject(new Error('Image load failed'));
      };

      // Configure CORS if needed
      if (this.options.useCORS) {
        img.crossOrigin = 'anonymous';
      }

      // Start loading
      img.src = url;
    });
  }

  /**
   * Check if URL is in cache and still valid
   */
  private isFromCache(url: string): boolean {
    return this.options.cache?.enabled ? this.cacheManager.has(url) : false;
  }

  /**
   * Abort current loading operation
   */
  abort(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cacheManager.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    return this.cacheManager.getStats();
  }

  /**
   * Get performance stats
   */
  getPerformanceStats() {
    return this.performanceMonitor?.getStats();
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.abortController = null;
  }

  /**
   * Simple delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Debug logging
   */
  private log(message: string): void {
    if (this.options.debug) {
      console.log(`[ImageLoader] ${message}`);
    }
  }
}