/**
 * Evermark SDK - Main entry point
 * PHASE 2: Added convenient API alongside existing exports
 */

// =================
// CONVENIENT API (Phase 2 - New!)
// =================

// Main user workflows - the "happy path"
export {
  loadImage,
  transferToSupabase,
  createImageLoader,
  showImage,
  createStorageOrchestrator
} from './src/convenient-api.js';

// =================
// COMMON EXPORTS (Existing + Phase 1 additions)
// =================

// Most frequently used functions at top level
export {
  resolveImageSources,
  createDefaultStorageConfig,
  isValidUrl,
  isValidIpfsHash,
  createIpfsUrl,
  generateStoragePath,        // Phase 1 addition
  validateStorageConfig       // Phase 1 addition
} from './src/core/index.js';

export {
  StorageOrchestrator,
  SupabaseStorageClient,
  IPFSClient,
  ensureImageInSupabase       // Phase 1 addition
} from './src/storage/index.js';

export {
  EvermarkImage,
  useImageLoader,
  ImageDisplay,
  useStorageFlow,
  useImageUpload,
  ImageUpload,
  ImageTransferStatus
} from './src/react/index.js';

export {
  ImageLoader,
  EnhancedImageLoader,
  CORSHandler,
  CacheManager,
  PerformanceMonitor
} from './src/browser/index.js';

// =================
// ADVANCED MODULE ACCESS (Existing)
// =================

// Full module exports for power users who want everything
export * as core from './src/core/index.js';
export * as browser from './src/browser/index.js';
export * as storage from './src/storage/index.js';
export * as react from './src/react/index.js';

// =================
// COMMON TYPES (Phase 2 - More accessible)
// =================

export type {
  ImageSourceInput,
  StorageConfig,
  LoadImageResult,
  StorageFlowResult,
  UploadProgress,
  ImageSource,
  TransferResult,
  ImageLoaderOptions,
  LoadAttempt,
  SourceResolutionConfig,
  CacheEntry,
  CacheConfig,
  LoadMetrics,
  PerformanceStats,
  SupabaseUploadOptions,
  IPFSFetchOptions,
  CORSConfig
} from './src/core/index.js';

// =================
// PACKAGE METADATA
// =================

export const PACKAGE_VERSION = '0.2.0';
export const PACKAGE_NAME = 'evermark-sdk';