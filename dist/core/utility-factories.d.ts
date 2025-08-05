/**
 * Utility factory functions for creating specialized resolvers
 * MINIMAL CHANGES: Fixed import paths only
 */
import type { SourceResolutionConfig, ImageSourceInput, StorageConfig } from './types.js';
export declare function createSourceResolver(config: Partial<SourceResolutionConfig>): (input: ImageSourceInput) => import("./types.js").ImageSource[];
export declare function createMobileOptimizedResolver(): (input: ImageSourceInput) => import("./types.js").ImageSource[];
export declare function createStorageAwareResolver(storageConfig: StorageConfig): (input: ImageSourceInput) => import("./types.js").ImageSource[];
export declare function createFastNetworkResolver(): (input: ImageSourceInput) => import("./types.js").ImageSource[];
export declare function createSlowNetworkResolver(): (input: ImageSourceInput) => import("./types.js").ImageSource[];
//# sourceMappingURL=utility-factories.d.ts.map