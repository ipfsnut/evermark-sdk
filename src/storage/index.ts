/**
 * Storage module exports
 * PHASE 1: Added ensureImageInSupabase standalone function
 */

// Main classes
export { SupabaseStorageClient } from './supabase-client.js';
export { IPFSClient } from './ipfs-client.js';
export { StorageOrchestrator } from './storage-orchestrator.js';

// Re-export types from core for convenience
export type {
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput,
  SupabaseUploadOptions,
  IPFSFetchOptions
} from '../core/types.js';

// PHASE 1: Add the standalone function that Beta app expects
import { StorageOrchestrator } from './storage-orchestrator.js';
import type { 
  ImageSourceInput, 
  StorageConfig, 
  UploadProgress, 
  StorageFlowResult 
} from '../core/types.js';

/**
 * Ensure image is available in Supabase Storage
 * Convenience wrapper around StorageOrchestrator for backward compatibility
 */
export async function ensureImageInSupabase(
  input: ImageSourceInput,
  storageConfig: StorageConfig,
  onProgress?: (progress: UploadProgress) => void
): Promise<StorageFlowResult> {
  const orchestrator = new StorageOrchestrator(storageConfig);
  return await orchestrator.ensureImageInSupabase(input, onProgress);
}