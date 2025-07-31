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
// =================
// NEW STORAGE INTEGRATION EXPORTS
// =================
export { EnhancedImageLoader } from './enhanced-image-loader.js';
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
    const { createDefaultStorageConfig } = require('@ipfsnut/evermark-sdk-core');
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
    const loader = new EnhancedImageLoader({
        storageConfig,
        autoTransfer: true,
        onStorageProgress: options.onProgress,
        debug: options.debug || false,
        timeout: 8000,
        maxRetries: 2
    });
    return await loader.loadImageWithStorageFlow(input);
}
// Default configuration for Supabase
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