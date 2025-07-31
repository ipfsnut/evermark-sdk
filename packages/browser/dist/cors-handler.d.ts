export interface CORSConfig {
    /** Supabase project URL */
    supabaseUrl?: string;
    /** Supabase anon key for public access */
    supabaseAnonKey?: string;
    /** Additional allowed origins */
    allowedOrigins?: string[];
    /** Custom headers to include */
    customHeaders?: Record<string, string>;
}
/**
 * Handles CORS issues specifically for Supabase Storage
 */
export declare class CORSHandler {
    private config;
    constructor(config?: CORSConfig);
    /**
     * Check if URL is from Supabase Storage
     */
    isSupabaseStorageUrl(url: string): boolean;
    /**
     * Get appropriate headers for a given URL
     */
    getHeaders(url: string): Record<string, string>;
    /**
     * Test if a URL is accessible with current CORS settings
     */
    testCORS(url: string): Promise<{
        success: boolean;
        error?: string;
    }>;
    /**
     * Get CORS-safe image URL
     */
    getCORSSafeUrl(url: string): string;
    /**
     * Handle Supabase Storage authentication
     */
    authenticateSupabaseRequest(url: string): Promise<string>;
}
//# sourceMappingURL=cors-handler.d.ts.map