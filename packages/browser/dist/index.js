/**
 * Clean exports including storage integration
 */
// =================
// EXISTING EXPORTS (Maintained)
// =================
export { ImageLoader } from './image-loader.js';
export { CORSHandler } from './cors-handler.js';
export { CacheManager } from './cache-manager.js';
export { PerformanceMonitor } from './performance.js';
export { EnhancedImageLoader } from './enhanced-image-loader.js';
// =================
// IMPORTS FOR FUNCTIONS
// =================
import { ImageLoader } from './image-loader.js';
import { EnhancedImageLoader } from './enhanced-image-loader.js';
import { createDefaultStorageConfig } from '@ipfsnut/evermark-sdk-core';
// =================
// CONVENIENCE FUNCTIONS
// =================
export function createImageLoader(options = {}) {
    return new ImageLoader(options);
}
/**
 * Create enhanced image loader with sensible defaults
 */
export function createEnhancedImageLoader(supabaseUrl, supabaseKey, bucketName = 'images', options = {}) {
    const storageConfig = createDefaultStorageConfig(supabaseUrl, supabaseKey, bucketName);
    return new EnhancedImageLoader({
        debug: false,
        timeout: 8000,
        maxRetries: 2,
        autoTransfer: true,
        storageConfig,
        ...options
    });
}
/**
 * Main function implementing your 3-step flow
 * This is the primary entry point for your use case
 */
export async function ensureImageLoaded(input, storageConfig, options = {}) {
    // Handle strict TypeScript mode - only pass onStorageProgress if defined
    const loaderOptions = {
        storageConfig,
        autoTransfer: true,
        debug: options.debug || false,
        timeout: 8000,
        maxRetries: 2
    };
    // Only add onStorageProgress if it's defined (strict mode compliance)
    if (options.onProgress) {
        loaderOptions.onStorageProgress = options.onProgress;
    }
    const loader = new EnhancedImageLoader(loaderOptions);
    return await loader.loadImageWithStorageFlow(input);
}
/**
 * Default configuration for Supabase
 */
export function createSupabaseImageLoader(supabaseUrl, anonKey, bucketName = 'images') {
    return createEnhancedImageLoader(supabaseUrl, anonKey, bucketName, {
        autoTransfer: true,
        debug: false,
        useCORS: true,
        timeout: 8000,
        maxRetries: 2
    });
}
//# sourceMappingURL=index.js.map