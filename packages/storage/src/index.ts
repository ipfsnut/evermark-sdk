/**
 * Clean exports for the storage package
 */

// Main classes
export { SupabaseStorageClient } from './supabase-client.js';
export { IPFSClient } from './ipfs-client.js';
export { StorageOrchestrator } from './storage-orchestrator.js';

// Import and re-export core types
import type {
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput
} from '@ipfsnut/evermark-sdk-core';

// Import storage-specific types
import type {
  StorageConfig,
  SupabaseUploadOptions,
  IPFSFetchOptions,
  StorageTestResult,
  IPFSGatewayStatus,
  StorageStatus
} from './types.js';

// Re-export all types for convenience
export type {
  // Core types
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput,
  // Storage-specific types (with proper Supabase client typing)
  StorageConfig,
  SupabaseUploadOptions,
  IPFSFetchOptions,
  StorageTestResult,
  IPFSGatewayStatus,
  StorageStatus
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
export const STORAGE_PACKAGE_VERSION = '1.1.3';