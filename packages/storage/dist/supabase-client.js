/**
 * Complete Supabase Storage operations
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
export class SupabaseStorageClient {
    config;
    client;
    bucketName;
    constructor(config) {
        this.config = config;
        this.client = createClient(config.url, config.anonKey);
        this.bucketName = config.bucketName;
    }
    /**
     * Upload file to Supabase Storage with progress tracking
     */
    async uploadFile(file, path, options = {}) {
        const startTime = Date.now();
        try {
            const { onProgress, upsert = true, cacheControl = '3600' } = options;
            const contentType = options.contentType || (file instanceof File ? file.type : 'application/octet-stream');
            onProgress?.({
                phase: 'uploading',
                percentage: 0,
                uploaded: 0,
                total: file.size,
                message: 'Starting upload to Supabase...'
            });
            const { data, error } = await this.client.storage
                .from(this.bucketName)
                .upload(path, file, { upsert, contentType, cacheControl });
            if (error) {
                throw new Error(`Supabase upload failed: ${error.message}`);
            }
            const { data: urlData } = this.client.storage
                .from(this.bucketName)
                .getPublicUrl(path);
            onProgress?.({
                phase: 'complete',
                percentage: 100,
                uploaded: file.size,
                total: file.size,
                message: 'Upload complete'
            });
            return {
                success: true,
                supabaseUrl: urlData.publicUrl,
                transferTime: Date.now() - startTime,
                fileSize: file.size
            };
        }
        catch (error) {
            return {
                success: false,
                transferTime: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Upload failed'
            };
        }
    }
    /**
     * Check if file exists in Supabase Storage
     */
    async fileExists(path) {
        try {
            const folderPath = path.substring(0, path.lastIndexOf('/')) || '';
            const fileName = path.split('/').pop() || '';
            const { data, error } = await this.client.storage
                .from(this.bucketName)
                .list(folderPath, {
                limit: 1,
                search: fileName
            });
            return !error && data && data.length > 0;
        }
        catch {
            return false;
        }
    }
    /**
     * Get public URL for a file path
     */
    getPublicUrl(path) {
        const { data } = this.client.storage
            .from(this.bucketName)
            .getPublicUrl(path);
        return data.publicUrl;
    }
    /**
     * Test Supabase connection
     */
    async testConnection() {
        const startTime = Date.now();
        try {
            const { data, error } = await this.client.storage.listBuckets();
            if (error) {
                return { success: false, error: error.message };
            }
            return {
                success: true,
                latency: Date.now() - startTime
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Connection test failed'
            };
        }
    }
}
//# sourceMappingURL=supabase-client.js.map