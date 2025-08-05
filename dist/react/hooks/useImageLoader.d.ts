import type { ImageSourceInput, SourceResolutionConfig } from '../../core/types.js';
export interface UseImageLoaderOptions {
    /** Maximum number of retry attempts per source */
    maxRetries?: number;
    /** Timeout for each load attempt in milliseconds */
    timeout?: number;
    /** Whether to use CORS mode */
    useCORS?: boolean;
    /** Custom headers for requests */
    headers?: Record<string, string>;
    /** Progress callback */
    onProgress?: (loaded: number, total: number) => void;
    /** Debug mode for detailed logging */
    debug?: boolean;
    /** Whether to start loading immediately */
    autoLoad?: boolean;
    /** Resolution configuration */
    resolution?: SourceResolutionConfig;
    /** Supabase configuration for CORS */
    supabase?: {
        url: string;
        anonKey: string;
    };
}
export interface UseImageLoaderResult {
    /** Current image URL if loaded successfully */
    imageUrl: string | null;
    /** Loading state */
    isLoading: boolean;
    /** Error state */
    hasError: boolean;
    /** Error message */
    error: string | null;
    /** Current source being attempted */
    currentSource: string | null;
    /** Whether image was loaded from cache */
    fromCache: boolean;
    /** Total load time in milliseconds */
    loadTime: number | null;
    /** Manual load trigger */
    load: () => void;
    /** Retry current load */
    retry: () => void;
    /** Reset to initial state */
    reset: () => void;
    /** All attempted sources */
    attempts: Array<{
        url: string;
        success: boolean;
        error?: string;
    }>;
}
/**
 * React hook for loading images with intelligent fallbacks
 */
export declare function useImageLoader(input: ImageSourceInput, options?: UseImageLoaderOptions): UseImageLoaderResult;
//# sourceMappingURL=useImageLoader.d.ts.map