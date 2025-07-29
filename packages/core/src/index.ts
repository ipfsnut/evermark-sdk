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

// Core types
export type {
  ImageSource,
  ImageSourceInput,
  LoadAttempt,
  LoadingState,
  SourceResolutionConfig,
  ImageLoadingEvent,
  ImageLoadingEventHandler,
  SourceResolver,
  SourceLoader,
  Result
} from './types.js';

export { ImageLoadingError } from './types.js';

// URL resolution functions
export {
  resolveImageSources,
  isValidUrl,
  isValidIpfsHash,
  createIpfsUrl,
  createPlaceholderSource,
  filterSourcesByCondition,
  validateImageSources
} from './url-resolver.js';

// Package metadata
export const PACKAGE_VERSION = '0.1.0';
export const PACKAGE_NAME = '@evermark-sdk/core';

/**
 * Default configuration that can be used across implementations
 */
export const DEFAULT_CONFIG = {
  maxSources: 5,
  defaultTimeout: 8000,
  includeIpfs: true,
  ipfsGateway: 'https://gateway.pinata.cloud/ipfs',
  mobileOptimization: false,
  priorityOverrides: {}
} as const;

/**
 * Common timeout values for different source types
 */
export const TIMEOUTS = {
  thumbnail: 3000,
  primary: 5000,
  fallback: 8000,
  placeholder: 1000
} as const;

/**
 * Utility function to create a basic source resolver with custom config
 */
export function createSourceResolver(config: Partial<SourceResolutionConfig>) {
  return (input: ImageSourceInput) => resolveImageSources(input, config);
}

/**
 * Utility function for common mobile optimization
 */
export function createMobileOptimizedResolver() {
  return createSourceResolver({
    mobileOptimization: true,
    maxSources: 3,
    defaultTimeout: 5000
  });
}

/**
 * Utility function for fast network conditions
 */
export function createFastNetworkResolver() {
  return createSourceResolver({
    includeIpfs: true,
    maxSources: 5,
    defaultTimeout: 10000
  });
}

/**
 * Utility function for slow network conditions
 */
export function createSlowNetworkResolver() {
  return createSourceResolver({
    includeIpfs: false,
    maxSources: 2,
    defaultTimeout: 3000,
    mobileOptimization: true
  });
}