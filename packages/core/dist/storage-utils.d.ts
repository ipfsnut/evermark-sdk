/**
 * Pure utility functions for storage operations - no side effects
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
 * Create default storage configuration
 */
export declare function createDefaultStorageConfig(supabaseUrl: string, supabaseKey: string, bucketName?: string): StorageConfig;
/**
 * Validate storage configuration
 */
export declare function validateStorageConfig(config: StorageConfig): {
    valid: boolean;
    errors: string[];
};
/**
 * Extract file extension from URL or filename
 */
export declare function extractFileExtension(urlOrFilename: string): string | null;
/**
 * Check if file is an image based on MIME type or extension
 */
export declare function isImageFile(file: File | string): boolean;
//# sourceMappingURL=storage-utils.d.ts.map