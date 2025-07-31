/**
 * Manages browser cache for image loading optimization
 */
export class CacheManager {
    constructor(config = {}) {
        this.cache = new Map();
        this.totalSize = 0;
        this.config = {
            maxSize: 50 * 1024 * 1024, // 50MB
            maxEntries: 100,
            ttl: 24 * 60 * 60 * 1000, // 24 hours
            persistent: false,
            ...config
        };
        if (this.config.persistent) {
            this.loadFromStorage();
        }
    }
    /**
     * Add entry to cache
     */
    set(url, entry) {
        const now = Date.now();
        const existingEntry = this.cache.get(url);
        if (existingEntry) {
            // Update existing entry
            existingEntry.accessCount++;
            existingEntry.lastAccessed = now;
            Object.assign(existingEntry, entry);
        }
        else {
            // Add new entry
            const newEntry = {
                url,
                timestamp: now,
                accessCount: 1,
                lastAccessed: now,
                ...entry
            };
            this.cache.set(url, newEntry);
            if (entry.size) {
                this.totalSize += entry.size;
            }
        }
        this.cleanup();
        if (this.config.persistent) {
            this.saveToStorage();
        }
    }
    /**
     * Get entry from cache
     */
    get(url) {
        const entry = this.cache.get(url);
        if (!entry) {
            return null;
        }
        // Check if entry is expired
        const age = Date.now() - entry.timestamp;
        if (age > this.config.ttl) {
            this.delete(url);
            return null;
        }
        // Update access stats
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        return entry;
    }
    /**
     * Check if URL is cached and valid
     */
    has(url) {
        return this.get(url) !== null;
    }
    /**
     * Delete entry from cache
     */
    delete(url) {
        const entry = this.cache.get(url);
        if (entry) {
            this.cache.delete(url);
            if (entry.size) {
                this.totalSize -= entry.size;
            }
            return true;
        }
        return false;
    }
    /**
     * Clear entire cache
     */
    clear() {
        this.cache.clear();
        this.totalSize = 0;
        if (this.config.persistent) {
            this.clearStorage();
        }
    }
    /**
     * Get cache statistics
     */
    getStats() {
        const entries = Array.from(this.cache.values());
        const totalAccesses = entries.reduce((sum, entry) => sum + entry.accessCount, 0);
        const totalLoadTime = entries.reduce((sum, entry) => sum + (entry.loadTime || 0), 0);
        return {
            size: this.cache.size,
            entries: entries.length,
            totalSize: this.totalSize,
            hitRate: totalAccesses > 0 ? entries.length / totalAccesses : 0,
            averageLoadTime: entries.length > 0 ? totalLoadTime / entries.length : 0
        };
    }
    /**
     * Clean up expired and least used entries
     */
    cleanup() {
        const now = Date.now();
        // Remove expired entries
        const entries = Array.from(this.cache.entries());
        for (const [url, entry] of entries) {
            const age = now - entry.timestamp;
            if (age > this.config.ttl) {
                this.delete(url);
            }
        }
        // If still over limits, remove least recently used
        if (this.cache.size > this.config.maxEntries || this.totalSize > this.config.maxSize) {
            const sortedEntries = Array.from(this.cache.entries())
                .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);
            const toRemove = Math.max(this.cache.size - this.config.maxEntries, this.totalSize > this.config.maxSize ? Math.ceil(this.cache.size * 0.2) : 0);
            for (let i = 0; i < toRemove && i < sortedEntries.length; i++) {
                const entryToDelete = sortedEntries[i];
                if (entryToDelete) {
                    this.delete(entryToDelete[0]);
                }
            }
        }
    }
    /**
     * Load cache from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('evermark-image-cache');
            if (stored) {
                const data = JSON.parse(stored);
                this.cache = new Map(data.entries);
                this.totalSize = data.totalSize || 0;
            }
        }
        catch (error) {
            console.warn('Failed to load cache from storage:', error);
        }
    }
    /**
     * Save cache to localStorage
     */
    saveToStorage() {
        try {
            const data = {
                entries: Array.from(this.cache.entries()),
                totalSize: this.totalSize
            };
            localStorage.setItem('evermark-image-cache', JSON.stringify(data));
        }
        catch (error) {
            console.warn('Failed to save cache to storage:', error);
        }
    }
    /**
     * Clear localStorage cache
     */
    clearStorage() {
        try {
            localStorage.removeItem('evermark-image-cache');
        }
        catch (error) {
            console.warn('Failed to clear cache storage:', error);
        }
    }
}
//# sourceMappingURL=cache-manager.js.map