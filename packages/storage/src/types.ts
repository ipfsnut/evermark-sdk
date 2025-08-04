/**
 * Storage-specific types that extend core types with Supabase integration
 * THIS is where Supabase types belong
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { 
  StorageConfig as CoreStorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput
} from '@ipfsnut/evermark-sdk-core';

// =================
// ENHANCED STORAGE CONFIG WITH PROPER SUPABASE CLIENT
// =================

export interface StorageConfig extends Omit<CoreStorageConfig, 'supabase'> {
  supabase: {
    url: string;
    anonKey: string;
    bucketName?: string;
    serviceRoleKey?: string;
    client?: SupabaseClient; // PROPER TYPED: Supabase client only in storage package
  };
}

// Re-export core types for convenience
export type {
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  ImageSourceInput
} from '@ipfsnut/evermark-sdk-core';

// =================
// STORAGE-SPECIFIC INTERFACES
// =================

export interface SupabaseUploadOptions {
  path?: string;
  upsert?: boolean;
  contentType?: string;
  cacheControl?: string;
  onProgress?: (progress: UploadProgress) => void;
}

export interface IPFSFetchOptions {
  timeout?: number;
  maxRetries?: number;
  onProgress?: (loaded: number, total?: number) => void;
}

export interface StorageTestResult {
  success: boolean;
  error?: string;
  latency?: number;
}

export interface IPFSGatewayStatus {
  gateway: string;
  available: boolean;
  latency?: number;
}

export interface StorageStatus {
  supabase: StorageTestResult;
  ipfs: {
    available: boolean;
    gateways: IPFSGatewayStatus[];
  };
}