/**
 * Convenient API - the "happy path" for most users
 * PHASE 2: Simple functions for common use cases
 */
import { StorageOrchestrator } from './storage/storage-orchestrator.js';
import { EnhancedImageLoader } from './browser/enhanced-image-loader.js';
import type { ImageSourceInput, StorageConfig, UploadProgress, StorageFlowResult, LoadImageResult } from './core/types.js';
/**
 * Load an image with intelligent fallbacks and optional auto-transfer
 * This is what most users actually want - just load an image reliably
 */
export declare function loadImage(input: ImageSourceInput, options?: {
    storageConfig?: StorageConfig;
    preferThumbnail?: boolean;
    autoTransfer?: boolean;
    timeout?: number;
    debug?: boolean;
}): Promise<LoadImageResult>;
/**
 * Transfer IPFS image to Supabase - simple wrapper
 * This is the other main use case users have
 */
export declare function transferToSupabase(ipfsHash: string, storageConfig: StorageConfig, onProgress?: (progress: UploadProgress) => void): Promise<StorageFlowResult>;
/**
 * Create an image loader with common defaults
 * Simple factory for the most common case
 */
export declare function createImageLoader(options?: {
    supabaseUrl?: string;
    supabaseKey?: string;
    bucketName?: string;
    existingClient?: any;
    mobile?: boolean;
    autoTransfer?: boolean;
}): EnhancedImageLoader;
/**
 * One-liner: "just show this image reliably"
 * The simplest possible API for basic use cases
 */
export declare function showImage(imageData: {
    supabaseUrl?: string;
    ipfsHash?: string;
    thumbnailUrl?: string;
}, supabaseConfig?: {
    url: string;
    key: string;
    existingClient?: any;
}): Promise<string | null>;
/**
 * Enhanced createStorageOrchestrator with defaults
 */
export declare function createStorageOrchestrator(supabaseUrl: string, supabaseKey: string, bucketName?: string, existingClient?: any): StorageOrchestrator;
//# sourceMappingURL=convenient-api.d.ts.map