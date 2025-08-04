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

/**
 * ✅ ENHANCED: Storage config that properly extends core config
 * Now handles bucket deprecation and existing client properly
 */
export interface StorageConfig extends Omit<CoreStorageConfig, 'supabase' | 'bucket'> {
  supabase: {
    url: string;
    anonKey: string;
    bucketName?: string;
    serviceRoleKey?: string;
    client?: SupabaseClient; // ✅ PROPER TYPED: Supabase client only in storage package
  };
  // ⚠️ DEPRECATED FIELD REMOVED: bucket is handled in migration
  // The core package may still have it for backward compatibility,
  // but the storage package uses the new bucketName field
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

// =================
// MIGRATION AND COMPATIBILITY TYPES
// =================

/**
 * ✅ NEW: Legacy config for migration support
 */
export interface LegacyStorageConfig extends StorageConfig {
  bucket?: string; // Deprecated field that may exist in old configs
}

/**
 * ✅ NEW: Config validation result with deprecation warnings
 */
export interface StorageConfigValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
  migrated?: boolean;
  deprecatedFields?: string[];
}

/**
 * ✅ NEW: Client configuration options
 */
export interface ClientConfig {
  useExisting: boolean;
  clientProvided: boolean;
  clientType?: 'provided' | 'created';
  preventDuplication: boolean;
}