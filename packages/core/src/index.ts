/**
 * @evermark-sdk/core
 * 
 * Pure, framework-agnostic image handling logic with storage support.
 * This package contains no side effects and can be used in any JavaScript environment.
 */

// =================
// TYPE EXPORTS
// =================

export type {
  // Core types
  ImageSource,
  ImageSourceInput,
  LoadAttempt,
  LoadingState,
  SourceResolutionConfig,
  ImageLoadingEvent,
  ImageLoadingEventHandler,
  SourceResolver,
  SourceLoader,
  Result,
  ImageLoaderOptions,
  LoadImageResult,
  
  // Storage types
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInputWithStorage,
  StorageTransferFunction
} from './types.js';

// =================
// ERROR EXPORTS
// =================

export { ImageLoadingError, StorageError } from './types.js';

// =================
// URL RESOLUTION EXPORTS (Existing)
// =================

export {
  resolveImageSources,
  createIpfsUrl,
  createPlaceholderSource,
  filterSourcesByCondition,
  validateImageSources
} from './url-resolver.js';

// =================
// STORAGE UTILITY EXPORTS (New)
// =================

export {
  isValidUrl,
  isValidIpfsHash,
  isValidSupabaseUrl,
  extractSupabaseProjectId,
  generateStoragePath,
  createDefaultStorageConfig,
  validateStorageConfig,
  extractFileExtension,
  isImageFile
} from './storage-utils.js';

// =================
// PACKAGE METADATA
// =================

export const PACKAGE_VERSION = '0.1.0';
export const PACKAGE_NAME = '@evermark-sdk/core';

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

// =================
// UTILITY FACTORIES
// =================

export function createSourceResolver(config: Partial<SourceResolutionConfig>) {
  return (input: ImageSourceInput) => resolveImageSources(input, config);
}

export function createMobileOptimizedResolver() {
  return createSourceResolver({
    mobileOptimization: true,
    maxSources: 3,
    defaultTimeout: 5000
  });
}

export function createStorageAwareResolver(storageConfig: StorageConfig) {
  return createSourceResolver({
    storageConfig,
    autoTransfer: true,
    includeIpfs: true
  });
}

export function createFastNetworkResolver() {
  return createSourceResolver({
    includeIpfs: true,
    maxSources: 5,
    defaultTimeout: 10000
  });
}

export function createSlowNetworkResolver() {
  return createSourceResolver({
    includeIpfs: false,
    maxSources: 2,
    defaultTimeout: 3000,
    mobileOptimization: true
  });
}