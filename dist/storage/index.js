/**
 * Storage module exports
 * PHASE 1: Added ensureImageInSupabase standalone function
 */
// Main classes
export { SupabaseStorageClient } from './supabase-client.js';
export { IPFSClient } from './ipfs-client.js';
export { StorageOrchestrator } from './storage-orchestrator.js';
// PHASE 1: Add the standalone function that Beta app expects
import { StorageOrchestrator } from './storage-orchestrator.js';
/**
 * Ensure image is available in Supabase Storage
 * Convenience wrapper around StorageOrchestrator for backward compatibility
 */
export async function ensureImageInSupabase(input, storageConfig, onProgress) {
    const orchestrator = new StorageOrchestrator(storageConfig);
    return await orchestrator.ensureImageInSupabase(input, onProgress);
}
//# sourceMappingURL=index.js.map