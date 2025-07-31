import { ImageLoader } from './image-loader.js';
import { CORSHandler } from './cors-handler.js';
import { CacheManager } from './cache-manager.js';
import { PerformanceMonitor } from './performance.js';
// Re-export everything
export { ImageLoader, CORSHandler, CacheManager, PerformanceMonitor };
// Convenience function for quick setup
export function createImageLoader(options = {}) {
    return new ImageLoader(options);
}
// Default browser configuration for Supabase
export function createSupabaseImageLoader(supabaseUrl, anonKey) {
    const corsHandler = new CORSHandler({
        supabaseUrl,
        supabaseAnonKey: anonKey
    });
    return new ImageLoader({
        useCORS: true,
        debug: false, // Remove the env check - can be overridden by user
        timeout: 8000,
        maxRetries: 2
    });
}
//# sourceMappingURL=index.js.map