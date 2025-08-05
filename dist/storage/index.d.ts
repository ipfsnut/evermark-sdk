/**
 * Storage module exports
 * PHASE 1: Added ensureImageInSupabase standalone function
 */
export { SupabaseStorageClient } from './supabase-client.js';
export { IPFSClient } from './ipfs-client.js';
export { StorageOrchestrator } from './storage-orchestrator.js';
export type { StorageConfig, TransferResult, UploadProgress, StorageFlowResult, ImageSourceInput, SupabaseUploadOptions, IPFSFetchOptions } from '../core/types.js';
import type { ImageSourceInput, StorageConfig, UploadProgress, StorageFlowResult } from '../core/types.js';
/**
 * Ensure image is available in Supabase Storage
 * Convenience wrapper around StorageOrchestrator for backward compatibility
 */
export declare function ensureImageInSupabase(input: ImageSourceInput, storageConfig: StorageConfig, onProgress?: (progress: UploadProgress) => void): Promise<StorageFlowResult>;
//# sourceMappingURL=index.d.ts.map