/**
 * @evermark-sdk/core
 *
 * Pure, framework-agnostic image handling logic with storage support.
 * This package contains no side effects and can be used in any JavaScript environment.
 */
export type { ImageSource, ImageSourceInput, LoadAttempt, LoadingState, SourceResolutionConfig, ImageLoadingEvent, ImageLoadingEventHandler, SourceResolver, SourceLoader, Result, ImageLoaderOptions, LoadImageResult, StorageConfig, TransferResult, UploadProgress, StorageFlowResult, ImageSourceInputWithStorage, StorageTransferFunction } from './types.js';
export { ImageLoadingError, StorageError } from './types.js';
export { resolveImageSources, createIpfsUrl, createPlaceholderSource, filterSourcesByCondition, validateImageSources } from './url-resolver.js';
export { isValidUrl, isValidIpfsHash, isValidSupabaseUrl, extractSupabaseProjectId, generateStoragePath, createDefaultStorageConfig, validateStorageConfig, extractFileExtension, isImageFile } from './storage-utils.js';
export { createSourceResolver, createMobileOptimizedResolver, createStorageAwareResolver, createFastNetworkResolver, createSlowNetworkResolver } from './utility-factories.js';
export declare const PACKAGE_VERSION = "0.1.0";
export declare const PACKAGE_NAME = "@evermark-sdk/core";
export declare const DEFAULT_CONFIG: {
    readonly maxSources: 5;
    readonly defaultTimeout: 8000;
    readonly includeIpfs: true;
    readonly ipfsGateway: "https://gateway.pinata.cloud/ipfs";
    readonly mobileOptimization: false;
    readonly priorityOverrides: {};
    readonly autoTransfer: false;
};
export declare const TIMEOUTS: {
    readonly thumbnail: 3000;
    readonly primary: 5000;
    readonly fallback: 8000;
    readonly placeholder: 1000;
};
//# sourceMappingURL=index.d.ts.map