/**
 * Handles CORS issues specifically for Supabase Storage
 */
export class CORSHandler {
    config;
    constructor(config = {}) {
        this.config = {
            allowedOrigins: ['*'],
            customHeaders: {},
            ...config
        };
    }
    /**
     * Check if URL is from Supabase Storage
     */
    isSupabaseStorageUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.includes('supabase');
        }
        catch {
            return false;
        }
    }
    /**
     * Get appropriate headers for a given URL
     */
    getHeaders(url) {
        const headers = {
            ...this.config.customHeaders
        };
        // Add Supabase-specific headers
        if (this.isSupabaseStorageUrl(url) && this.config.supabaseAnonKey) {
            headers['Authorization'] = `Bearer ${this.config.supabaseAnonKey}`;
            headers['apikey'] = this.config.supabaseAnonKey;
        }
        return headers;
    }
    /**
     * Test if a URL is accessible with current CORS settings
     */
    async testCORS(url) {
        try {
            const headers = this.getHeaders(url);
            const response = await fetch(url, {
                method: 'HEAD',
                headers,
                mode: 'cors'
            });
            return { success: response.ok };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'CORS test failed'
            };
        }
    }
    /**
     * Get CORS-safe image URL
     */
    getCORSSafeUrl(url) {
        // For Supabase Storage, ensure we're using the correct domain
        if (this.isSupabaseStorageUrl(url) && this.config.supabaseUrl) {
            try {
                const urlObj = new URL(url);
                const supabaseObj = new URL(this.config.supabaseUrl);
                // Ensure we're using the project's storage domain
                const supabaseHostnameParts = supabaseObj.hostname.split('.');
                const firstPart = supabaseHostnameParts[0];
                if (firstPart && !urlObj.hostname.startsWith(firstPart)) {
                    // Reconstruct URL with correct subdomain
                    urlObj.hostname = `${firstPart}.supabase.co`;
                    return urlObj.toString();
                }
            }
            catch {
                // Return original URL if parsing fails
            }
        }
        return url;
    }
    /**
     * Handle Supabase Storage authentication
     */
    async authenticateSupabaseRequest(url) {
        if (!this.isSupabaseStorageUrl(url)) {
            return url;
        }
        const corsedUrl = this.getCORSSafeUrl(url);
        // Test if authentication is needed
        const testResult = await this.testCORS(corsedUrl);
        if (testResult.success) {
            return corsedUrl;
        }
        // If we have auth key, append it as query parameter for public access
        if (this.config.supabaseAnonKey) {
            const urlObj = new URL(corsedUrl);
            urlObj.searchParams.set('token', this.config.supabaseAnonKey);
            return urlObj.toString();
        }
        return corsedUrl;
    }
}
//# sourceMappingURL=cors-handler.js.map