/**
 * Clean exports including storage integration
 */
export { ImageLoader } from './image-loader.js';
export { CORSHandler } from './cors-handler.js';
export { CacheManager } from './cache-manager.js';
export { PerformanceMonitor } from './performance.js';
export { EnhancedImageLoader } from './enhanced-image-loader.js';
export type { ImageLoaderOptions, LoadImageResult } from './image-loader.js';
export type { EnhancedImageLoaderOptions } from './enhanced-image-loader.js';
export type { CORSConfig } from './cors-handler.js';
export type { CacheEntry, CacheConfig } from './cache-manager.js';
export type { LoadMetrics, PerformanceStats } from './performance.js';
export type { StorageConfig, TransferResult, UploadProgress, StorageFlowResult, ImageSourceInput } from '@ipfsnut/evermark-sdk-core';
import { ImageLoader } from './image-loader.js';
import { EnhancedImageLoader } from './enhanced-image-loader.js';
import type { ImageLoaderOptions, LoadImageResult } from './image-loader.js';
import type { EnhancedImageLoaderOptions } from './enhanced-image-loader.js';
import type { StorageConfig, UploadProgress, ImageSourceInput } from '@ipfsnut/evermark-sdk-core';
export declare function createImageLoader(options?: ImageLoaderOptions): ImageLoader;
/**
 * Create enhanced image loader with sensible defaults
 */
export declare function createEnhancedImageLoader(supabaseUrl: string, supabaseKey: string, bucketName?: string, options?: Partial<EnhancedImageLoaderOptions>): EnhancedImageLoader;
/**
 * Main function implementing your 3-step flow
 * This is the primary entry point for your use case
 */
export declare function ensureImageLoaded(input: ImageSourceInput, storageConfig: StorageConfig, options?: {
    onProgress?: (progress: UploadProgress) => void;
    debug?: boolean;
}): Promise<LoadImageResult>;
/**
 * Default configuration for Supabase
 */
export declare function createSupabaseImageLoader(supabaseUrl: string, anonKey: string, bucketName?: string): EnhancedImageLoader;
//# sourceMappingURL=index.d.ts.map