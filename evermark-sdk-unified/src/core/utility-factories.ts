/**
 * Utility factory functions for creating specialized resolvers
 */

import type { SourceResolutionConfig, ImageSourceInput, StorageConfig } from './types.js';
import { resolveImageSources } from './url-resolver.js';

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