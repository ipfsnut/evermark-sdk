/**
 * Pure functions for resolving image sources from various input types
 * This module contains no side effects and is easily testable
 */
import type { ImageSource, SourceResolver } from './types.js';
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
 * Filters sources based on network conditions or preferences
 */
export declare function filterSourcesByCondition(sources: ImageSource[], condition: 'slow-network' | 'fast-network' | 'prefer-thumbnails' | 'avoid-ipfs'): ImageSource[];
/**
 * Validates a complete image source configuration
 */
export declare function validateImageSources(sources: ImageSource[]): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=url-resolver.d.ts.map