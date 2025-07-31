import type { ImageSource, LoadAttempt } from '@evermark-sdk/core';
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
export declare class ImageLoader {
    private options;
    private abortController;
    private cache;
    private readonly cacheTimeout;
    constructor(options?: ImageLoaderOptions);
    /**
     * Load image from multiple sources with intelligent fallback
     */
    loadImage(sources: ImageSource[]): Promise<LoadImageResult>;
    /**
     * Attempt to load a single image source
     */
    private attemptLoad;
    /**
     * Load image with timeout and CORS handling
     */
    private loadWithTimeout;
    /**
     * Check if URL is in cache and still valid
     */
    private isFromCache;
    /**
     * Update cache with successful URL
     */
    private updateCache;
    /**
     * Abort current loading operation
     */
    abort(): void;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Get cache stats
     */
    getCacheStats(): {
        size: number;
        urls: string[];
    };
    /**
     * Cleanup resources
     */
    private cleanup;
    /**
     * Simple delay utility
     */
    private delay;
    /**
     * Debug logging
     */
    private log;
}
//# sourceMappingURL=image-loader.d.ts.map