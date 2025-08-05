/**
 * Core types for the Evermark SDK
 * Consolidated from multiple files with proper Supabase integration
 */
import type { SupabaseClient } from '@supabase/supabase-js';
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
export interface StorageConfig {
    supabase: {
        url: string;
        anonKey: string;
        bucketName?: string;
        serviceRoleKey?: string;
        client?: SupabaseClient;
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
        thumbnailSize?: {
            width: number;
            height: number;
        };
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
export interface ImageLoaderOptions {
    maxRetries?: number;
    timeout?: number;
    useCORS?: boolean;
    headers?: Record<string, string>;
    onProgress?: (loaded: number, total: number) => void;
    debug?: boolean;
    cache?: {
        enabled?: boolean;
        maxSize?: number;
        maxEntries?: number;
        ttl?: number;
        persistent?: boolean;
    };
    monitoring?: {
        enabled?: boolean;
        maxMetrics?: number;
    };
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
export interface CacheEntry {
    url: string;
    timestamp: number;
    size?: number;
    mimeType?: string;
    loadTime?: number;
    accessCount: number;
    lastAccessed: number;
}
export interface CacheConfig {
    maxSize?: number;
    maxEntries?: number;
    ttl?: number;
    persistent?: boolean;
}
export interface LoadMetrics {
    url: string;
    source: string;
    startTime: number;
    endTime: number;
    loadTime: number;
    fromCache: boolean;
    success: boolean;
    error?: string;
    retryCount: number;
    size?: number;
}
export interface PerformanceStats {
    totalLoads: number;
    successfulLoads: number;
    failedLoads: number;
    averageLoadTime: number;
    cacheHitRate: number;
    sourceSuccessRates: Record<string, number>;
    commonErrors: Array<{
        error: string;
        count: number;
    }>;
}
export interface SupabaseUploadOptions {
    path?: string;
    upsert?: boolean;
    contentType?: string;
    cacheControl?: string;
    onProgress?: (progress: UploadProgress) => void;
}
export interface IPFSFetchOptions {
    timeout?: number;
    maxRetries?: number;
    onProgress?: (loaded: number, total?: number) => void;
}
export interface CORSConfig {
    supabaseUrl?: string;
    supabaseAnonKey?: string;
    allowedOrigins?: string[];
    customHeaders?: Record<string, string>;
}
export declare class ImageLoadingError extends Error {
    readonly code: 'TIMEOUT' | 'NETWORK' | 'CORS' | 'NOT_FOUND' | 'INVALID_URL' | 'ABORTED' | 'STORAGE_ERROR' | 'TRANSFER_FAILED';
    readonly source?: ImageSource | undefined;
    constructor(message: string, code: 'TIMEOUT' | 'NETWORK' | 'CORS' | 'NOT_FOUND' | 'INVALID_URL' | 'ABORTED' | 'STORAGE_ERROR' | 'TRANSFER_FAILED', source?: ImageSource | undefined);
}
export declare class StorageError extends Error {
    readonly code: 'SUPABASE_ERROR' | 'IPFS_ERROR' | 'TRANSFER_ERROR' | 'UPLOAD_ERROR' | 'CONFIG_ERROR';
    readonly provider: 'supabase' | 'ipfs' | 'unknown';
    constructor(message: string, code: 'SUPABASE_ERROR' | 'IPFS_ERROR' | 'TRANSFER_ERROR' | 'UPLOAD_ERROR' | 'CONFIG_ERROR', provider?: 'supabase' | 'ipfs' | 'unknown');
}
export type Result<T, E = Error> = {
    success: true;
    data: T;
} | {
    success: false;
    error: E;
};
export type SourceResolver = (input: ImageSourceInput, config?: SourceResolutionConfig) => ImageSource[];
//# sourceMappingURL=types.d.ts.map