import type { ImageSource, ImageLoaderOptions, LoadImageResult } from '../core/types';
/**
 * Browser-specific image loader that handles CORS, retries, and fallbacks
 */
export declare class ImageLoader {
    private options;
    private abortController;
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
     * Abort current loading operation
     */
    abort(): void;
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