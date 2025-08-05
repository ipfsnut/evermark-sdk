/**
 * Evermark SDK - Main entry point
 * Unified package exports
 */

import { StorageOrchestrator } from './src/storage/storage-orchestrator';

// =================
// CORE EXPORTS
// =================

export {
  resolveImageSources,
  createIpfsUrl,
  createPlaceholderSource,
  isValidUrl,
  isValidIpfsHash,
  createDefaultStorageConfig
} from './src/core/index.js';

export type {
  ImageSource,
  ImageSourceInput,
  LoadAttempt,
  LoadingState,
  SourceResolutionConfig,
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageLoaderOptions,
  LoadImageResult,
  Result
} from './src/core/index.js';

export {
  ImageLoadingError,
  StorageError
} from './src/core/index.js';

// =================
// BROWSER EXPORTS
// =================

export {
  ImageLoader,
  EnhancedImageLoader,
  CORSHandler,
  CacheManager,
  PerformanceMonitor
} from './src/browser/index.js';

export type {
  EnhancedImageLoaderOptions,
  CacheEntry,
  CacheConfig,
  LoadMetrics,
  PerformanceStats,
  CORSConfig
} from './src/browser/index.js';

// =================
// STORAGE EXPORTS
// =================

export {
  SupabaseStorageClient,
  IPFSClient,
  StorageOrchestrator
} from './src/storage/index.js';

export type {
  SupabaseUploadOptions,
  IPFSFetchOptions
} from './src/storage/index.js';

// =================
// REACT EXPORTS
// =================

export {
  ImageDisplay,
  EvermarkImage,
  ImageUpload,
  ImageTransferStatus,
  useImageLoader,
  useStorageFlow,
  useImageUpload
} from './src/react/index.js';

export type {
  ImageDisplayProps,
  UseImageLoaderOptions,
  UseImageLoaderResult,
  UseStorageFlowOptions,
  UseStorageFlowResult,
  UseImageUploadOptions,
  UseImageUploadResult
} from './src/react/index.js';

// =================
// CONVENIENCE FUNCTIONS
// =================

/**
 * Create storage orchestrator with config
 */
export function createStorageOrchestrator(
  supabaseUrl: string,
  supabaseKey: string,
  bucketName: string = 'images',
  existingClient?: any
) {
  const config = {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseKey,
      bucketName,
      ...(existingClient && { client: existingClient })
    },
    ipfs: {
      gateway: 'https://gateway.pinata.cloud/ipfs',
      fallbackGateways: [
        'https://ipfs.io/ipfs',
        'https://cloudflare-ipfs.com/ipfs'
      ],
      timeout: 10000
    },
    upload: {
      maxFileSize: 10 * 1024 * 1024,
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      generateThumbnails: true,
      thumbnailSize: { width: 400, height: 400 }
    }
  };

  return new StorageOrchestrator(config);
}

// =================
// PACKAGE METADATA
// =================

export const PACKAGE_VERSION = '0.1.0';
export const PACKAGE_NAME = 'evermark-sdk';