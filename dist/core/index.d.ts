/**
 * Core module exports
 * MINIMAL CHANGES: Fixed import paths only
 */
export type { ImageSource, ImageSourceInput, LoadAttempt, LoadingState, SourceResolutionConfig, StorageConfig, TransferResult, UploadProgress, StorageFlowResult, ImageLoaderOptions, LoadImageResult, CacheEntry, CacheConfig, LoadMetrics, PerformanceStats, SupabaseUploadOptions, IPFSFetchOptions, CORSConfig, Result, SourceResolver } from './types.js';
export { ImageLoadingError, StorageError } from './types.js';
export { resolveImageSources, createIpfsUrl, createPlaceholderSource, isValidUrl, isValidIpfsHash, createDefaultStorageConfig } from './url-resolver.js';
//# sourceMappingURL=index.d.ts.map