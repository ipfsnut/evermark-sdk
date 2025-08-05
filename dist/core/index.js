/**
 * Core module exports
 * PHASE 1: Added missing exports that Beta app needs
 */
// Error classes
export { ImageLoadingError, StorageError } from './types.js';
// Core functions (existing)
export { resolveImageSources, createIpfsUrl, createPlaceholderSource, isValidUrl, isValidIpfsHash, createDefaultStorageConfig } from './url-resolver.js';
// PHASE 1: Add missing storage utilities that Beta app needs
export { generateStoragePath, validateStorageConfig, isValidSupabaseUrl, extractSupabaseProjectId, extractFileExtension, isImageFile, getBucketName, hasExistingClient } from './storage-utils.js';
//# sourceMappingURL=index.js.map