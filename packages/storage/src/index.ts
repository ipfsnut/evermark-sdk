/**
 * Clean exports for the storage package
 */

// Main classes
export { SupabaseStorageClient } from './supabase-client.js';
export { IPFSClient } from './ipfs-client.js';
export { StorageOrchestrator } from './storage-orchestrator.js';

// Import and re-export types from core
import type {
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput
} from '@ipfsnut/evermark-sdk-core';

// Re-export types for convenience
export type {
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput
};

// Import the actual class to use in functions
import { StorageOrchestrator } from './storage-orchestrator.js';

// Main flow functions
export async function ensureImageInSupabase(
  input: ImageSourceInput,
  config: StorageConfig,
  onProgress?: (progress: UploadProgress) => void
): Promise<StorageFlowResult> {
  const orchestrator = new StorageOrchestrator(config);
  return await orchestrator.ensureImageInSupabase(input, onProgress);
}

export async function transferIPFSToSupabase(
  ipfsHash: string,
  config: StorageConfig,
  onProgress?: (progress: UploadProgress) => void
): Promise<TransferResult> {
  const orchestrator = new StorageOrchestrator(config);
  return await orchestrator.transferIPFSToSupabase(ipfsHash, onProgress);
}

// Convenience factory
export function createStorageOrchestrator(config: StorageConfig): StorageOrchestrator {
  return new StorageOrchestrator(config);
}

// Package metadata
export const STORAGE_PACKAGE_VERSION = '0.1.0';