export interface CacheEntry {
    url: string;
    timestamp: number;
    size?: number;
    mimeType?: string;
    loadTime?: number;
    accessCount: number;
    lastAccessed: number;
}
export interface CacheConfig {
    /** Maximum cache size in bytes */
    maxSize?: number;
    /** Maximum number of entries */
    maxEntries?: number;
    /** Time to live in milliseconds */
    ttl?: number;
    /** Whether to persist cache to localStorage */
    persistent?: boolean;
}
/**
 * Manages browser cache for image loading optimization
 */
export declare class CacheManager {
    private cache;
    private totalSize;
    private config;
    constructor(config?: CacheConfig);
    /**
     * Add entry to cache
     */
    set(url: string, entry: Partial<CacheEntry>): void;
    /**
     * Get entry from cache
     */
    get(url: string): CacheEntry | null;
    /**
     * Check if URL is cached and valid
     */
    has(url: string): boolean;
    /**
     * Delete entry from cache
     */
    delete(url: string): boolean;
    /**
     * Clear entire cache
     */
    clear(): void;
    /**
     * Get cache statistics
     */
    getStats(): {
        size: number;
        entries: number;
        totalSize: number;
        hitRate: number;
        averageLoadTime: number;
    };
    /**
     * Clean up expired and least used entries
     */
    private cleanup;
    /**
     * Load cache from localStorage
     */
    private loadFromStorage;
    /**
     * Save cache to localStorage
     */
    private saveToStorage;
    /**
     * Clear localStorage cache
     */
    private clearStorage;
}
//# sourceMappingURL=cache-manager.d.ts.map