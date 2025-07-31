import { ImageLoader } from './image-loader.js';
import { CORSHandler } from './cors-handler.js';
import { CacheManager } from './cache-manager.js';
import { PerformanceMonitor } from './performance.js';
import type { ImageLoaderOptions, LoadImageResult } from './image-loader.js';
import type { CORSConfig } from './cors-handler.js';
import type { CacheEntry, CacheConfig } from './cache-manager.js';
import type { LoadMetrics, PerformanceStats } from './performance.js';
export { ImageLoader, CORSHandler, CacheManager, PerformanceMonitor };
export type { ImageLoaderOptions, LoadImageResult, CORSConfig, CacheEntry, CacheConfig, LoadMetrics, PerformanceStats };
export declare function createImageLoader(options?: ImageLoaderOptions): ImageLoader;
export declare function createSupabaseImageLoader(supabaseUrl: string, anonKey: string): ImageLoader;
//# sourceMappingURL=index.d.ts.map