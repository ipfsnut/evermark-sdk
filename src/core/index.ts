/**
 * Core module exports
 * MINIMAL CHANGES: Fixed import paths only
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

// Core functions
export {
  resolveImageSources,
  createIpfsUrl,
  createPlaceholderSource,
  isValidUrl,
  isValidIpfsHash,
  createDefaultStorageConfig
} from './url-resolver.js';