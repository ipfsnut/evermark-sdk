import { CacheManager } from './cache-manager.js';
import { PerformanceMonitor } from './performance.js';
/**
 * Browser-specific image loader that handles CORS, retries, and fallbacks
 */
export class ImageLoader {
    options;
    abortController = null;
    cacheManager;
    performanceMonitor;
    constructor(options = {}) {
        this.options = options;
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
        const cacheConfig = {};
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
    async loadImage(sources) {
        if (!sources.length) {
            return {
                success: false,
                error: 'No image sources provided'
            };
        }
        const startTime = Date.now();
        const attempts = [];
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
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown loading error',
                attempts
            };
        }
        finally {
            this.cleanup();
        }
    }
    /**
     * Attempt to load a single image source
     */
    async attemptLoad(source, attemptIndex) {
        const startTime = Date.now();
        const attempt = {
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
            let lastError = null;
            const maxRetries = this.options.maxRetries || 2;
            for (let retry = 0; retry <= maxRetries; retry++) {
                if (this.abortController?.signal.aborted) {
                    attempt.status = 'aborted';
                    break;
                }
                try {
                    await this.loadWithTimeout(source.url, source.timeout || this.options.timeout);
                    // Success - update cache with proper CacheEntry type
                    if (this.options.cache?.enabled) {
                        // Create a proper CacheEntry with required fields
                        const cacheEntry = {
                            url: source.url,
                            timestamp: Date.now(),
                            loadTime: Date.now() - startTime,
                            accessCount: 1,
                            lastAccessed: Date.now()
                        };
                        // Add optional properties if available
                        if (source.metadata?.format) {
                            const formatToMimeType = {
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
                            const estimatedSizes = {
                                'jpg': 100000, // ~100KB average
                                'jpeg': 100000,
                                'png': 200000, // ~200KB average
                                'gif': 150000, // ~150KB average
                                'webp': 80000, // ~80KB average
                                'svg': 10000 // ~10KB average
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
                }
                catch (error) {
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
        }
        catch (error) {
            attempt.endTime = Date.now();
            attempt.status = 'failed';
            attempt.error = error instanceof Error ? error.message : 'Unknown error';
            return attempt;
        }
    }
    /**
     * Load image with timeout and CORS handling
     */
    loadWithTimeout(url, timeout) {
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
    isFromCache(url) {
        return this.options.cache?.enabled ? this.cacheManager.has(url) : false;
    }
    /**
     * Abort current loading operation
     */
    abort() {
        if (this.abortController) {
            this.abortController.abort();
        }
    }
    /**
     * Clear cache
     */
    clearCache() {
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
    cleanup() {
        this.abortController = null;
    }
    /**
     * Simple delay utility
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Debug logging
     */
    log(message) {
        if (this.options.debug) {
            console.log(`[ImageLoader] ${message}`);
        }
    }
}
//# sourceMappingURL=image-loader.js.map