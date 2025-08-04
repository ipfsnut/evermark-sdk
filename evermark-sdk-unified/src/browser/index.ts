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
// TYPE EXPORTS
// =================

export type {
  ImageLoaderOptions,
  LoadImageResult
} from './image-loader.js';

export type {
  EnhancedImageLoaderOptions
} from './enhanced-image-loader.js';

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
// RE-EXPORTED STORAGE TYPES
// =================

export type {
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput
} from '@ipfsnut/evermark-sdk-core';

// =================
// IMPORTS FOR FUNCTIONS
// =================

import { ImageLoader } from './image-loader.js';
import { EnhancedImageLoader } from './enhanced-image-loader.js';
import { createDefaultStorageConfig } from '@ipfsnut/evermark-sdk-core';
import type { 
  ImageLoaderOptions, 
  LoadImageResult 
} from './image-loader.js';
import type { 
  EnhancedImageLoaderOptions 
} from './enhanced-image-loader.js';
import type {
  StorageConfig,
  UploadProgress,
  ImageSourceInput
} from '@ipfsnut/evermark-sdk-core';

// =================
// CONVENIENCE FUNCTIONS
// =================

export function createImageLoader(options: ImageLoaderOptions = {}): ImageLoader {
  return new ImageLoader(options);
}

/**
 * Create enhanced image loader with sensible defaults
 */
export function createEnhancedImageLoader(
  supabaseUrl: string,
  supabaseKey: string,
  bucketName: string = 'images',
  options: Partial<EnhancedImageLoaderOptions> = {}
): EnhancedImageLoader {
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
  // Handle strict TypeScript mode - only pass onStorageProgress if defined
  const loaderOptions: EnhancedImageLoaderOptions = {
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
export function createSupabaseImageLoader(
  supabaseUrl: string, 
  anonKey: string,
  bucketName: string = 'images'
): EnhancedImageLoader {
  return createEnhancedImageLoader(supabaseUrl, anonKey, bucketName, {
    autoTransfer: true,
    debug: false,
    useCORS: true,
    timeout: 8000,
    maxRetries: 2
  });
}