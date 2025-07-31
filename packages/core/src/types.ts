/**
 * Core types for the Evermark SDK image handling system
 * These types are designed to be framework-agnostic and pure
 */

// =================
// EXISTING CORE TYPES (Enhanced)
// =================

export interface ImageSource {
  url: string;
  type: 'primary' | 'thumbnail' | 'fallback' | 'placeholder';
  priority: number;
  timeout?: number;
  metadata?: {
    storageProvider?: 'supabase' | 'ipfs' | 'cdn' | 'external';
    size?: 'thumbnail' | 'medium' | 'large' | 'original';
    format?: 'jpg' | 'png' | 'gif' | 'webp' | 'svg';
  };
}

export interface ImageSourceInput {
  supabaseUrl?: string;
  thumbnailUrl?: string;
  ipfsHash?: string;
  processedUrl?: string;
  externalUrls?: string[];
  preferThumbnail?: boolean;
  ipfsGateway?: string;
}

export interface LoadAttempt {
  source: ImageSource;
  startTime: number;
  endTime?: number;
  status: 'pending' | 'success' | 'failed' | 'timeout' | 'aborted';
  error?: string;
  debug?: {
    networkTime?: number;
    cacheHit?: boolean;
    corsIssue?: boolean;
    transferTriggered?: boolean;
  };
}

export interface LoadingState {
  currentSource: ImageSource | null;
  attempts: LoadAttempt[];
  status: 'idle' | 'loading' | 'loaded' | 'failed' | 'aborted' | 'transferring';
  finalUrl: string | null;
  totalLoadTime?: number;
  fromCache?: boolean;
  transferStatus?: 'pending' | 'in-progress' | 'complete' | 'failed';
}

export interface SourceResolutionConfig {
  maxSources?: number;
  defaultTimeout?: number;
  includeIpfs?: boolean;
  ipfsGateway?: string;
  mobileOptimization?: boolean;
  priorityOverrides?: Record<string, number>;
  preferThumbnail?: boolean;
  storageConfig?: StorageConfig;
  autoTransfer?: boolean;
}

// =================
// NEW STORAGE TYPES
// =================

export interface StorageConfig {
  supabase: {
    url: string;
    anonKey: string;
    bucketName: string;
    serviceRoleKey?: string;
  };
  ipfs: {
    gateway: string;
    fallbackGateways?: string[];
    timeout?: number;
  };
  upload: {
    maxFileSize?: number;
    allowedFormats?: string[];
    generateThumbnails?: boolean;
    thumbnailSize?: { width: number; height: number };
  };
}

export interface TransferResult {
  success: boolean;
  supabaseUrl?: string;
  ipfsHash?: string;
  transferTime?: number;
  fileSize?: number;
  error?: string;
  alreadyExists?: boolean;
}

export interface UploadProgress {
  phase: 'preparing' | 'uploading' | 'processing' | 'complete' | 'failed';
  percentage: number;
  uploaded?: number;
  total?: number;
  message?: string;
  estimatedTimeRemaining?: number;
}

export interface StorageFlowResult {
  finalUrl: string;
  foundInSupabase: boolean;
  transferPerformed: boolean;
  transferResult?: TransferResult;
  totalTime: number;
  warnings?: string[];
}

export interface ImageSourceInputWithStorage extends ImageSourceInput {
  forceTransfer?: boolean;
  storageConfig?: Partial<StorageConfig>;
  onProgress?: (progress: UploadProgress) => void;
  onTransferComplete?: (result: TransferResult) => void;
}

// =================
// ENHANCED EVENT TYPES
// =================

export type ImageLoadingEvent =
  | { type: 'source_attempt_start'; source: ImageSource }
  | { type: 'source_attempt_success'; source: ImageSource; url: string }
  | { type: 'source_attempt_failed'; source: ImageSource; error: string }
  | { type: 'transfer_started'; ipfsHash: string; targetBucket: string }
  | { type: 'transfer_progress'; progress: UploadProgress }
  | { type: 'transfer_complete'; result: TransferResult }
  | { type: 'transfer_failed'; ipfsHash: string; error: string }
  | { type: 'all_sources_failed'; attempts: LoadAttempt[] }
  | { type: 'loading_complete'; finalUrl: string; totalTime: number }
  | { type: 'loading_aborted'; reason: string };

export type ImageLoadingEventHandler = (event: ImageLoadingEvent) => void;

// =================
// ERROR TYPES
// =================

export class ImageLoadingError extends Error {
  constructor(
    message: string,
    public readonly code: 'TIMEOUT' | 'NETWORK' | 'CORS' | 'NOT_FOUND' | 'INVALID_URL' | 'ABORTED' | 'STORAGE_ERROR' | 'TRANSFER_FAILED',
    public readonly source?: ImageSource
  ) {
    super(message);
    this.name = 'ImageLoadingError';
  }
}

export class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: 'SUPABASE_ERROR' | 'IPFS_ERROR' | 'TRANSFER_ERROR' | 'UPLOAD_ERROR' | 'CONFIG_ERROR',
    public readonly provider: 'supabase' | 'ipfs' | 'unknown' = 'unknown'
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

// =================
// UTILITY TYPES
// =================

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export type SourceResolver = (input: ImageSourceInput, config?: SourceResolutionConfig) => ImageSource[];

export type SourceLoader = (
  source: ImageSource, 
  signal?: AbortSignal
) => Promise<Result<string, ImageLoadingError>>;

export type StorageTransferFunction = (
  ipfsHash: string,
  config: StorageConfig,
  onProgress?: (progress: UploadProgress) => void
) => Promise<TransferResult>;

export interface ImageLoaderOptions {
  maxRetries?: number;
  timeout?: number;
  useCORS?: boolean;
  headers?: Record<string, string>;
  onProgress?: (loaded: number, total: number) => void;
  debug?: boolean;
  storageConfig?: StorageConfig;
  autoTransfer?: boolean;
}

export interface LoadImageResult {
  success: boolean;
  imageUrl?: string;
  source?: ImageSource;
  loadTime?: number;
  fromCache?: boolean;
  error?: string;
  attempts?: LoadAttempt[];
  transferResult?: TransferResult;
}