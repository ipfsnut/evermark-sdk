/**
 * Core module exports
 * PHASE 1: Added missing exports that Beta app needs
 */

// Types
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
  CacheEntry,
  CacheConfig,
  LoadMetrics,
  PerformanceStats,
  SupabaseUploadOptions,
  IPFSFetchOptions,
  CORSConfig,
  Result,
  SourceResolver
} from './types.js';

// Error classes
export {
  ImageLoadingError,
  StorageError
} from './types.js';

// Core functions (existing)
export {
  resolveImageSources,
  createIpfsUrl,
  createPlaceholderSource,
  isValidUrl,
  isValidIpfsHash,
  createDefaultStorageConfig
} from './url-resolver.js';

// PHASE 1: Add missing storage utilities that Beta app needs
export {
  generateStoragePath,
  validateStorageConfig,
  isValidSupabaseUrl,
  extractSupabaseProjectId,
  extractFileExtension,
  isImageFile,
  getBucketName,
  hasExistingClient
} from './storage-utils.js';