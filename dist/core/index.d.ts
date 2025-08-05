/**
 * Core module exports
 * PHASE 1: Added missing exports that Beta app needs
 */
export type { ImageSource, ImageSourceInput, LoadAttempt, LoadingState, SourceResolutionConfig, StorageConfig, TransferResult, UploadProgress, StorageFlowResult, ImageLoaderOptions, LoadImageResult, CacheEntry, CacheConfig, LoadMetrics, PerformanceStats, SupabaseUploadOptions, IPFSFetchOptions, CORSConfig, Result, SourceResolver } from './types.js';
export { ImageLoadingError, StorageError } from './types.js';
export { resolveImageSources, createIpfsUrl, createPlaceholderSource, isValidUrl, isValidIpfsHash, createDefaultStorageConfig } from './url-resolver.js';
export { generateStoragePath, validateStorageConfig, isValidSupabaseUrl, extractSupabaseProjectId, extractFileExtension, isImageFile, getBucketName, hasExistingClient } from './storage-utils.js';
//# sourceMappingURL=index.d.ts.map