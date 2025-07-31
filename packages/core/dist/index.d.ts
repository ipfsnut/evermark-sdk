/**
 * @evermark-sdk/core
 *
 * Pure, framework-agnostic image handling logic for the Evermark SDK.
 * This package contains no side effects and can be used in any JavaScript environment.
 *
 * @example
 * ```typescript
 * import { resolveImageSources } from '@evermark-sdk/core';
 *
 * const sources = resolveImageSources({
 *   supabaseUrl: 'https://supabase.storage.com/image.jpg',
 *   thumbnailUrl: 'https://supabase.storage.com/thumb.jpg',
 *   ipfsHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'
 * });
 *
 * console.log('Sources to try:', sources);
 * ```
 */
export type { ImageSource, ImageSourceInput, LoadAttempt, LoadingState, SourceResolutionConfig, ImageLoadingEvent, ImageLoadingEventHandler, SourceResolver, SourceLoader, Result, ImageLoaderOptions, LoadImageResult } from './types.js';
export { ImageLoadingError } from './types.js';
export { resolveImageSources, isValidUrl, isValidIpfsHash, createIpfsUrl, createPlaceholderSource, filterSourcesByCondition, validateImageSources } from './url-resolver.js';
import type { ImageSourceInput, SourceResolutionConfig } from './types.js';
export declare const PACKAGE_VERSION = "0.1.0";
export declare const PACKAGE_NAME = "@evermark-sdk/core";
/**
 * Default configuration that can be used across implementations
 */
export declare const DEFAULT_CONFIG: {
    readonly maxSources: 5;
    readonly defaultTimeout: 8000;
    readonly includeIpfs: true;
    readonly ipfsGateway: "https://gateway.pinata.cloud/ipfs";
    readonly mobileOptimization: false;
    readonly priorityOverrides: {};
};
/**
 * Common timeout values for different source types
 */
export declare const TIMEOUTS: {
    readonly thumbnail: 3000;
    readonly primary: 5000;
    readonly fallback: 8000;
    readonly placeholder: 1000;
};
/**
 * Utility function to create a basic source resolver with custom config
 */
export declare function createSourceResolver(config: Partial<SourceResolutionConfig>): (input: ImageSourceInput) => import("./types.js").ImageSource[];
/**
 * Utility function for common mobile optimization
 */
export declare function createMobileOptimizedResolver(): (input: ImageSourceInput) => import("./types.js").ImageSource[];
/**
 * Utility function for fast network conditions
 */
export declare function createFastNetworkResolver(): (input: ImageSourceInput) => import("./types.js").ImageSource[];
/**
 * Utility function for slow network conditions
 */
export declare function createSlowNetworkResolver(): (input: ImageSourceInput) => import("./types.js").ImageSource[];
//# sourceMappingURL=index.d.ts.map