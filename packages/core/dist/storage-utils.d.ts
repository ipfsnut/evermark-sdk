/**
 * Pure utility functions for storage operations - no side effects
 * NO EXTERNAL DEPENDENCIES
 */
import type { StorageConfig } from './types.js';
/**
 * Validates if a URL string is properly formatted
 */
export declare function isValidUrl(url: string): boolean;
/**
 * Enhanced IPFS hash validation with multiple format support
 */
export declare function isValidIpfsHash(hash: string): boolean;
/**
 * Enhanced Supabase URL validation
 */
export declare function isValidSupabaseUrl(url: string): boolean;
/**
 * Extract Supabase project ID from URL
 */
export declare function extractSupabaseProjectId(url: string): string | null;
/**
 * Generate storage path from IPFS hash
 */
export declare function generateStoragePath(ipfsHash: string, options?: {
    prefix?: string;
    includeHash?: boolean;
    extension?: string;
}): string;
/**
 * ✅ FIXED: Create default storage configuration with existing client support
 */
export declare function createDefaultStorageConfig(supabaseUrl: string, supabaseKey: string, bucketName?: string, existingClient?: any): StorageConfig;
/**
 * ✅ ENHANCED: Validate storage configuration with deprecation warnings
 */
export declare function validateStorageConfig(config: StorageConfig): {
    valid: boolean;
    errors: string[];
    warnings: string[];
};
/**
 * ✅ ENHANCED: Migrate deprecated bucket configuration
 */
export declare function migrateStorageConfig(config: StorageConfig): StorageConfig;
/**
 * Extract file extension from URL or filename
 */
export declare function extractFileExtension(urlOrFilename: string): string | null;
/**
 * Check if file is an image based on MIME type or extension
 */
export declare function isImageFile(file: File | string): boolean;
/**
 * ✅ NEW: Get bucket name from config (handles deprecation)
 */
export declare function getBucketName(config: StorageConfig): string;
/**
 * ✅ NEW: Check if config has existing client
 */
export declare function hasExistingClient(config: StorageConfig): boolean;
/**
 * ✅ NEW: Create config with client validation
 */
export declare function createStorageConfigWithClient(supabaseUrl: string, supabaseKey: string, bucketName: string, client: any): StorageConfig;
//# sourceMappingURL=storage-utils.d.ts.map