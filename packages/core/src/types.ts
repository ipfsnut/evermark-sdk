/**
 * Core types for the Evermark SDK image handling system
 * These types are designed to be framework-agnostic and pure
 */

/**
 * Represents a single image source with loading configuration
 */
export interface ImageSource {
  /** The URL to load the image from */
  url: string;
  /** Type of source for priority and behavior decisions */
  type: 'primary' | 'thumbnail' | 'fallback' | 'placeholder';
  /** Loading priority (lower numbers load first) */
  priority: number;
  /** Timeout in milliseconds before giving up on this source */
  timeout?: number;
  /** Additional metadata for debugging and analytics */
  metadata?: {
    storageProvider?: 'supabase' | 'ipfs' | 'cdn' | 'external';
    size?: 'thumbnail' | 'medium' | 'large' | 'original';
    format?: 'jpg' | 'png' | 'gif' | 'webp' | 'svg';
  };
}

/**
 * Input for resolving image sources from various URL types
 */
export interface ImageSourceInput {
  /** Primary Supabase Storage URL */
  supabaseUrl?: string;
  /** Thumbnail version URL */
  thumbnailUrl?: string;
  /** IPFS hash for decentralized fallback */
  ipfsHash?: string;
  /** Legacy processed image URL */
  processedUrl?: string;
  /** External URLs (e.g., from social media) */
  externalUrls?: string[];
  /** Prefer thumbnail over full resolution */
  preferThumbnail?: boolean;
  /** Custom IPFS gateway (defaults to Pinata) */
  ipfsGateway?: string;
}

/**
 * Result of attempting to load a single image source
 */
export interface LoadAttempt {
  /** The source that was attempted */
  source: ImageSource;
  /** When the attempt started */
  startTime: number;
  /** When the attempt finished (success or failure) */
  endTime?: number;
  /** Current status of this attempt */
  status: 'pending' | 'success' | 'failed' | 'timeout' | 'aborted';
  /** Error message if the attempt failed */
  error?: string;
  /** Additional debug information */
  debug?: {
    networkTime?: number;
    cacheHit?: boolean;
    corsIssue?: boolean;
  };
}

/**
 * Overall loading state for an image with multiple sources
 */
export interface LoadingState {
  /** Currently active source being loaded */
  currentSource: ImageSource | null;
  /** All attempts made so far */
  attempts: LoadAttempt[];
  /** Overall loading status */
  status: 'idle' | 'loading' | 'loaded' | 'failed' | 'aborted';
  /** Final URL that successfully loaded */
  finalUrl: string | null;
  /** Total loading time in milliseconds */
  totalLoadTime?: number;
  /** Whether this result came from browser cache */
  fromCache?: boolean;
}

/**
 * Configuration for image source resolution behavior
 */
export interface SourceResolutionConfig {
  /** Maximum number of sources to attempt */
  maxSources?: number;
  /** Default timeout for sources without explicit timeout */
  defaultTimeout?: number;
  /** Whether to include IPFS fallbacks */
  includeIpfs?: boolean;
  /** Custom IPFS gateway URL */
  ipfsGateway?: string;
  /** Whether to prioritize thumbnails for mobile */
  mobileOptimization?: boolean;
  /** Custom priority overrides */
  priorityOverrides?: Record<string, number>;
  /** Prefer thumbnail over full resolution */
  preferThumbnail?: boolean;
}

/**
 * Events that can be emitted during image loading
 */
export type ImageLoadingEvent =
  | { type: 'source_attempt_start'; source: ImageSource }
  | { type: 'source_attempt_success'; source: ImageSource; url: string }
  | { type: 'source_attempt_failed'; source: ImageSource; error: string }
  | { type: 'all_sources_failed'; attempts: LoadAttempt[] }
  | { type: 'loading_complete'; finalUrl: string; totalTime: number }
  | { type: 'loading_aborted'; reason: string };

/**
 * Callback function for handling loading events
 */
export type ImageLoadingEventHandler = (event: ImageLoadingEvent) => void;

/**
 * Error types specific to image loading
 */
export class ImageLoadingError extends Error {
  constructor(
    message: string,
    public readonly code: 'TIMEOUT' | 'NETWORK' | 'CORS' | 'NOT_FOUND' | 'INVALID_URL' | 'ABORTED',
    public readonly source?: ImageSource
  ) {
    super(message);
    this.name = 'ImageLoadingError';
  }
}

/**
 * Result type for functions that may succeed or fail
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Utility type for functions that resolve image sources
 */
export type SourceResolver = (input: ImageSourceInput, config?: SourceResolutionConfig) => ImageSource[];

/**
 * Utility type for functions that load individual image sources
 */
export type SourceLoader = (
  source: ImageSource, 
  signal?: AbortSignal
) => Promise<Result<string, ImageLoadingError>>;

/**
 * Options for image loader instances
 */
export interface ImageLoaderOptions {
  /** Maximum number of retry attempts per source */
  maxRetries?: number;
  /** Timeout for each load attempt in milliseconds */
  timeout?: number;
  /** Whether to use CORS mode */
  useCORS?: boolean;
  /** Custom headers for requests */
  headers?: Record<string, string>;
  /** Progress callback */
  onProgress?: (loaded: number, total: number) => void;
  /** Debug mode for detailed logging */
  debug?: boolean;
}

/**
 * Result of image loading operation
 */
export interface LoadImageResult {
  success: boolean;
  imageUrl?: string;
  source?: ImageSource;
  loadTime?: number;
  fromCache?: boolean;
  error?: string;
  attempts?: LoadAttempt[];
}