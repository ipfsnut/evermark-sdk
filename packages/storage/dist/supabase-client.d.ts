import type { StorageConfig, TransferResult, UploadProgress } from '@ipfsnut/evermark-sdk-core';
export interface SupabaseUploadOptions {
    path?: string;
    upsert?: boolean;
    contentType?: string;
    cacheControl?: string;
    onProgress?: (progress: UploadProgress) => void;
}
export declare class SupabaseStorageClient {
    private config;
    private client;
    private bucketName;
    constructor(config: StorageConfig['supabase']);
    /**
     * Upload file to Supabase Storage with progress tracking
     */
    uploadFile(file: File | Blob, path: string, options?: SupabaseUploadOptions): Promise<TransferResult>;
    /**
     * Check if file exists in Supabase Storage
     */
    fileExists(path: string): Promise<boolean>;
    /**
     * Get public URL for a file path
     */
    getPublicUrl(path: string): string;
    /**
     * Test Supabase connection
     */
    testConnection(): Promise<{
        success: boolean;
        error?: string;
        latency?: number;
    }>;
}
//# sourceMappingURL=supabase-client.d.ts.map