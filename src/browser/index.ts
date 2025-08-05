/**
 * Browser module exports
 * MINIMAL CHANGES: Fixed import paths only
 */

// =================
// MAIN CLASS EXPORTS
// =================

export { ImageLoader } from './image-loader';
export { EnhancedImageLoader } from './enhanced-image-loader';
export { CORSHandler } from './cors-handler';
export { CacheManager } from './cache-manager';
export { PerformanceMonitor } from './performance';

// =================
// TYPE EXPORTS FROM COMPONENTS
// =================

export type { EnhancedImageLoaderOptions } from './enhanced-image-loader';

// =================
// RE-EXPORTED TYPES (For convenience)
// =================

export type {
  ImageLoaderOptions,
  LoadImageResult,
  LoadAttempt,
  ImageSource,
  CacheEntry,
  CacheConfig,
  LoadMetrics,
  PerformanceStats,
  CORSConfig
} from '../core/types';