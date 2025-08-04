/**
 * Evermark SDK - Unified package for robust image handling and content management
 * 
 * This package consolidates all image loading, storage orchestration, and React components
 * into a single, easy-to-use SDK with flexible import options.
 */

// =================
// CORE EXPORTS (Framework-agnostic)
// =================

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
  Result
} from './core/index.js';

// Functions
export {
  resolveImageSources,
  createIpfsUrl,
  createPlaceholderSource,
  filterSourcesByCondition,
  validateImageSources,
  isValidUrl,
  isValidIpfsHash,
  isValidSupabaseUrl,
  createDefaultStorageConfig,
  validateStorageConfig
} from './core/index.js';

// Utility factories
export {
  createSourceResolver,
  createMobileOptimizedResolver,
  createStorageAwareResolver,
  createFastNetworkResolver,
  createSlowNetworkResolver
} from './core/index.js';

// =================
// BROWSER EXPORTS
// =================

export {
  ImageLoader,
  EnhancedImageLoader,
  CORSHandler,
  CacheManager,
  PerformanceMonitor,
  createImageLoader,
  createEnhancedImageLoader,
  ensureImageLoaded,
  createSupabaseImageLoader
} from './browser/index.js';

export type {
  ImageLoaderOptions,
  LoadImageResult,
  EnhancedImageLoaderOptions,
  CORSConfig,
  CacheEntry,
  CacheConfig,
  LoadMetrics,
  PerformanceStats
} from './browser/index.js';

// =================
// STORAGE EXPORTS
// =================

export {
  SupabaseStorageClient,
  IPFSClient,
  StorageOrchestrator,
  ensureImageInSupabase,
  transferIPFSToSupabase,
  createStorageOrchestrator
} from './storage/index.js';

export type {
  SupabaseUploadOptions,
  IPFSFetchOptions,
  StorageTestResult,
  IPFSGatewayStatus,
  StorageStatus
} from './storage/index.js';

// =================
// REACT EXPORTS (Optional peer dependency)
// =================

export {
  ImageDisplay,
  EvermarkImage,
  ImageUpload,
  ImageTransferStatus,
  useImageLoader,
  useStorageFlow,
  useImageUpload
} from './react/index.js';

export type {
  ImageDisplayProps,
  UseImageLoaderOptions,
  UseImageLoaderResult,
  UseStorageFlowOptions,
  UseStorageFlowResult,
  UseImageUploadOptions,
  UseImageUploadResult
} from './react/index.js';

// =================
// PACKAGE METADATA
// =================

export const PACKAGE_VERSION = '0.0.1';
export const PACKAGE_NAME = 'evermark-sdk';

// =================
// DEFAULT CONFIGURATIONS
// =================

export const DEFAULT_CONFIG = {
  maxSources: 5,
  defaultTimeout: 8000,
  includeIpfs: true,
  ipfsGateway: 'https://gateway.pinata.cloud/ipfs',
  mobileOptimization: false,
  priorityOverrides: {},
  autoTransfer: false
} as const;

export const TIMEOUTS = {
  thumbnail: 3000,
  primary: 5000,
  fallback: 8000,
  placeholder: 1000
} as const;