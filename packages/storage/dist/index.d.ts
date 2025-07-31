/**
 * Clean exports for the storage package
 */
export { SupabaseStorageClient } from './supabase-client.js';
export { IPFSClient } from './ipfs-client.js';
export { StorageOrchestrator } from './storage-orchestrator.js';
export type { StorageConfig, TransferResult, UploadProgress, StorageFlowResult, ImageSourceInput } from '@evermark-sdk/core';
export declare function ensureImageInSupabase(input: ImageSourceInput, config: StorageConfig, onProgress?: (progress: UploadProgress) => void): Promise<StorageFlowResult>;
export declare function transferIPFSToSupabase(ipfsHash: string, config: StorageConfig, onProgress?: (progress: UploadProgress) => void): Promise<TransferResult>;
export declare function createStorageOrchestrator(config: StorageConfig): StorageOrchestrator;
export declare const STORAGE_PACKAGE_VERSION = "0.1.0";
//# sourceMappingURL=index.d.ts.map