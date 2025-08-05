/**
 * Storage module exports
 * MINIMAL CHANGES: Fixed import paths only
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