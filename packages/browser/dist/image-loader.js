/**
 * Browser-specific image loader that handles CORS, retries, and fallbacks
 */
export class ImageLoader {
    constructor(options = {}) {
        this.options = options;
        this.abortController = null;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.options = {
            maxRetries: 2,
            timeout: 8000,
            useCORS: true,
            debug: false,
            ...options
        };
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
            if (this.isFromCache(source.url)) {
                attempt.endTime = Date.now();
                attempt.status = 'success';
                attempt.debug = { networkTime: 0, cacheHit: true };
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
                    // Success - update cache
                    this.updateCache(source.url);
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
        const cached = this.cache.get(url);
        if (!cached)
            return false;
        const age = Date.now() - cached.timestamp;
        if (age > this.cacheTimeout) {
            this.cache.delete(url);
            return false;
        }
        return true;
    }
    /**
     * Update cache with successful URL
     */
    updateCache(url) {
        this.cache.set(url, {
            url,
            timestamp: Date.now()
        });
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
        this.cache.clear();
    }
    /**
     * Get cache stats
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            urls: Array.from(this.cache.keys())
        };
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