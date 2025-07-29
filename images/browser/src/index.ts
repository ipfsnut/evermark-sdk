export { ImageLoader } from './image-loader.js';
export { CORSHandler } from './cors-handler.js';
export { CacheManager } from './cache-manager.js';
export { PerformanceMonitor } from './performance.js';

export type {
  ImageLoaderOptions,
  LoadImageResult,
  CORSConfig,
  CacheEntry,
  CacheConfig,
  LoadMetrics,
  PerformanceStats
};

// Convenience function for quick setup
export function createImageLoader(options: ImageLoaderOptions = {}) {
  return new ImageLoader(options);
}

// Default browser configuration for Supabase
export function createSupabaseImageLoader(supabaseUrl: string, anonKey: string) {
  const corsHandler = new CORSHandler({
    supabaseUrl,
    supabaseAnonKey: anonKey
  });

  return new ImageLoader({
    useCORS: true,
    debug: import.meta.env.DEV,
    timeout: 8000,
    maxRetries: 2
  });
}