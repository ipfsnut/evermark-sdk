/**
 * Storage-specific types that extend core types with Supabase integration
 * CLEANED: Removed deprecated bucket migration code
 */
import type { UploadProgress } from '../core/types.js';
export type { TransferResult, UploadProgress, StorageFlowResult, ImageSourceInput } from '../core/types.js';
export interface SupabaseUploadOptions {
    path?: string;
    upsert?: boolean;
    contentType?: string;
    cacheControl?: string;
    onProgress?: (progress: UploadProgress) => void;
}
export interface IPFSFetchOptions {
    timeout?: number;
    maxRetries?: number;
    onProgress?: (loaded: number, total?: number) => void;
}
export interface StorageTestResult {
    success: boolean;
    error?: string;
    latency?: number;
}
export interface IPFSGatewayStatus {
    gateway: string;
    available: boolean;
    latency?: number;
}
export interface StorageStatus {
    supabase: StorageTestResult;
    ipfs: {
        available: boolean;
        gateways: IPFSGatewayStatus[];
    };
}
//# sourceMappingURL=types.d.ts.map