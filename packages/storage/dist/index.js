/**
 * Clean exports for the storage package
 */
// Main classes
export { SupabaseStorageClient } from './supabase-client.js';
export { IPFSClient } from './ipfs-client.js';
export { StorageOrchestrator } from './storage-orchestrator.js';
// Main flow functions
export async function ensureImageInSupabase(input, config, onProgress) {
    const orchestrator = new StorageOrchestrator(config);
    return await orchestrator.ensureImageInSupabase(input, onProgress);
}
export async function transferIPFSToSupabase(ipfsHash, config, onProgress) {
    const orchestrator = new StorageOrchestrator(config);
    return await orchestrator.transferIPFSToSupabase(ipfsHash, onProgress);
}
// Convenience factory
export function createStorageOrchestrator(config) {
    return new StorageOrchestrator(config);
}
// Package metadata
export const STORAGE_PACKAGE_VERSION = '0.1.0';
//# sourceMappingURL=index.js.map