/**
 * Main storage orchestration - uses existing client when provided
 * MINIMAL CHANGES: Only fixed import paths
 */
import type { ImageSourceInput, StorageFlowResult, UploadProgress, TransferResult, StorageConfig } from '../core/types.js';
export declare class StorageOrchestrator {
    private config;
    private supabaseClient;
    private ipfsClient;
    constructor(config: StorageConfig);
    /**
     * Main flow: Ensure image is available in Supabase
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
     * ADD: Missing method that enhanced-image-loader expects
     * TODO: Implement properly later
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