import { ImageLoader } from './image-loader.js';
import { CORSHandler } from './cors-handler.js';
import { CacheManager } from './cache-manager.js';
import { PerformanceMonitor } from './performance.js';
import type { ImageLoaderOptions, LoadImageResult } from './image-loader.js';
import type { CORSConfig } from './cors-handler.js';
import type { CacheEntry, CacheConfig } from './cache-manager.js';
import type { LoadMetrics, PerformanceStats } from './performance.js';

// Re-export everything
export { ImageLoader, CORSHandler, CacheManager, PerformanceMonitor };

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
    debug: false, // Remove the env check - can be overridden by user
    timeout: 8000,
    maxRetries: 2
  });
}