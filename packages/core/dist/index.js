/**
 * @evermark-sdk/core
 *
 * Pure, framework-agnostic image handling logic with storage support.
 * This package contains no side effects and can be used in any JavaScript environment.
 */
// =================
// ERROR EXPORTS
// =================
export { ImageLoadingError, StorageError } from './types.js';
// =================
// URL RESOLUTION EXPORTS
// =================
export { resolveImageSources, createIpfsUrl, createPlaceholderSource, filterSourcesByCondition, validateImageSources } from './url-resolver.js';
// =================
// STORAGE UTILITY EXPORTS
// =================
export { isValidUrl, isValidIpfsHash, isValidSupabaseUrl, extractSupabaseProjectId, generateStoragePath, createDefaultStorageConfig, validateStorageConfig, extractFileExtension, isImageFile } from './storage-utils.js';
// =================
// UTILITY FACTORIES
// =================
export { createSourceResolver, createMobileOptimizedResolver, createStorageAwareResolver, createFastNetworkResolver, createSlowNetworkResolver } from './utility-factories.js';
// =================
// PACKAGE METADATA
// =================
export const PACKAGE_VERSION = '1.1.1';
export const PACKAGE_NAME = '@ipfsnut/evermark-sdk-core';
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
};
export const TIMEOUTS = {
    thumbnail: 3000,
    primary: 5000,
    fallback: 8000,
    placeholder: 1000
};
//# sourceMappingURL=index.js.map