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
export class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private totalSize = 0;
  private config: Required<CacheConfig>;

  constructor(config: CacheConfig = {}) {
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
  set(url: string, entry: Partial<CacheEntry>): void {
    const now = Date.now();
    const existingEntry = this.cache.get(url);
    
    if (existingEntry) {
      // Update existing entry
      existingEntry.accessCount++;
      existingEntry.lastAccessed = now;
      Object.assign(existingEntry, entry);
    } else {
      // Add new entry
      const newEntry: CacheEntry = {
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
  get(url: string): CacheEntry | null {
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
  has(url: string): boolean {
    return this.get(url) !== null;
  }

  /**
   * Delete entry from cache
   */
  delete(url: string): boolean {
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
  clear(): void {
    this.cache.clear();
    this.totalSize = 0;
    
    if (this.config.persistent) {
      this.clearStorage();
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    entries: number;
    totalSize: number;
    hitRate: number;
    averageLoadTime: number;
  } {
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
  private cleanup(): void {
    const now = Date.now();
    
    // Remove expired entries
    for (const [url, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > this.config.ttl) {
        this.delete(url);
      }
    }

    // If still over limits, remove least recently used
    if (this.cache.size > this.config.maxEntries || this.totalSize > this.config.maxSize) {
      const entries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

      const toRemove = Math.max(
        this.cache.size - this.config.maxEntries,
        this.totalSize > this.config.maxSize ? Math.ceil(this.cache.size * 0.2) : 0
      );

      for (let i = 0; i < toRemove && i < entries.length; i++) {
        this.delete(entries[i][0]);
      }
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('evermark-image-cache');
      if (stored) {
        const data = JSON.parse(stored);
        this.cache = new Map(data.entries);
        this.totalSize = data.totalSize || 0;
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = {
        entries: Array.from(this.cache.entries()),
        totalSize: this.totalSize
      };
      localStorage.setItem('evermark-image-cache', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Clear localStorage cache
   */
  private clearStorage(): void {
    try {
      localStorage.removeItem('evermark-image-cache');
    } catch (error) {
      console.warn('Failed to clear cache storage:', error);
    }
  }
}