/**
 * Pure functions for resolving image sources from various input types
 */
import type { ImageSource, SourceResolver } from './types';
/**
 * Validates if a URL string is properly formatted
 */
export declare function isValidUrl(url: string): boolean;
/**
 * Validates if an IPFS hash is properly formatted
 */
export declare function isValidIpfsHash(hash: string): boolean;
/**
 * Creates an IPFS gateway URL from a hash
 */
export declare function createIpfsUrl(hash: string, gateway?: string): string;
/**
 * Resolves multiple image sources from input with intelligent prioritization
 */
export declare const resolveImageSources: SourceResolver;
/**
 * Creates a placeholder source for fallback display
 */
export declare function createPlaceholderSource(type: 'loading' | 'error' | 'empty', customUrl?: string): ImageSource;
/**
 * Create default storage configuration
 */
export declare function createDefaultStorageConfig(supabaseUrl: string, supabaseKey: string, bucketName?: string, existingClient?: any): {
    supabase: any;
    ipfs: {
        gateway: string;
        fallbackGateways: string[];
        timeout: number;
    };
    upload: {
        maxFileSize: number;
        allowedFormats: string[];
        generateThumbnails: boolean;
        thumbnailSize: {
            width: number;
            height: number;
        };
    };
};
//# sourceMappingURL=url-resolver.d.ts.map