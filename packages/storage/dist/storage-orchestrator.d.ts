/**
 * YOUR MAIN 3-STEP FLOW IMPLEMENTATION
 */
import type { ImageSourceInput, StorageConfig, StorageFlowResult, UploadProgress } from '@evermark-sdk/core';
export declare class StorageOrchestrator {
    private config;
    private supabaseClient;
    private ipfsClient;
    constructor(config: StorageConfig);
    /**
     * YOUR MAIN FLOW: Ensure image is available in Supabase
     *
     * 1. Check if image exists in Supabase
     * 2. If not, fetch from IPFS and upload to Supabase
     * 3. Fall back gracefully if transfers fail
     */
    ensureImageInSupabase(input: ImageSourceInput, onProgress?: (progress: UploadProgress) => void): Promise<StorageFlowResult>;
    /**
     * Transfer specific IPFS hash to Supabase Storage
     */
    transferIPFSToSupabase(ipfsHash: string, onProgress?: (progress: UploadProgress) => void): Promise<TransferResult>;
    /**
     * Test URL accessibility
     */
    private testUrlAccessibility;
    /**
     * Get storage status
     */
    getStorageStatus(): Promise<{
        supabase: {
            available: boolean;
            latency?: number;
        };
        ipfs: {
            available: boolean;
            gateways: Array<{
                gateway: string;
                available: boolean;
                latency?: number;
            }>;
        };
    }>;
}
//# sourceMappingURL=storage-orchestrator.d.ts.map