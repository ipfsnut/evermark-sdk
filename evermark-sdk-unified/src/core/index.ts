/**
 * Core module exports
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
} from './types';

// Error classes
export {
  ImageLoadingError,
  StorageError
} from './types';

// Core functions
export {
  resolveImageSources,
  createIpfsUrl,
  createPlaceholderSource,
  isValidUrl,
  isValidIpfsHash,
  createDefaultStorageConfig
} from './url-resolver';