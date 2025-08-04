/**
 * Storage module exports
 */

// Main classes
export { SupabaseStorageClient } from './supabase-client';
export { IPFSClient } from './ipfs-client';
export { StorageOrchestrator } from './storage-orchestrator';

// Re-export types from core for convenience
export type {
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput,
  SupabaseUploadOptions,
  IPFSFetchOptions
} from '../core/types';