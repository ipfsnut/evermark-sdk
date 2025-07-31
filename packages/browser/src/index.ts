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

// Existing types
export type {
  ImageLoaderOptions,
  LoadImageResult
} from './image-loader.js';

export type {
  CORSConfig
} from './cors-handler.js';

export type {
  CacheEntry,
  CacheConfig
} from './cache-manager.js';

export type {
  LoadMetrics,
  PerformanceStats
} from './performance.js';

// =================
// NEW STORAGE INTEGRATION EXPORTS
// =================

export { EnhancedImageLoader } from './enhanced-image-loader.js';

// Re-export storage types for convenience
export type {
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput
} from '@ipfsnut/evermark-sdk-core';

// =================
// CONVENIENCE FUNCTIONS
// =================

export function createImageLoader(options: ImageLoaderOptions = {}) {
  return new ImageLoader(options);
}

/**
 * Create enhanced image loader with sensible defaults
 */
export function createEnhancedImageLoader(
  supabaseUrl: string,
  supabaseKey: string,
  bucketName: string = 'images',
  options: Partial<import('./enhanced-image-loader.js').EnhancedImageLoaderOptions> = {}
): EnhancedImageLoader {
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
export async function ensureImageLoaded(
  input: ImageSourceInput,
  storageConfig: StorageConfig,
  options: {
    onProgress?: (progress: UploadProgress) => void;
    debug?: boolean;
  } = {}
): Promise<LoadImageResult> {
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
export function createSupabaseImageLoader(
  supabaseUrl: string, 
  anonKey: string,
  bucketName: string = 'images'
) {
  return createEnhancedImageLoader(supabaseUrl, anonKey, bucketName, {
    autoTransfer: true,
    debug: false,
    useCORS: true,
    timeout: 8000,
    maxRetries: 2
  });
}