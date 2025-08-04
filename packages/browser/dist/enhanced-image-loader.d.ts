/**
 * Integrates existing ImageLoader with storage orchestration
 */
import { ImageLoader } from './image-loader.js';
import type { ImageSourceInput, StorageConfig, UploadProgress, StorageFlowResult, TransferResult } from '../../core';
import type { ImageLoaderOptions, LoadImageResult } from './image-loader.js';
export interface EnhancedImageLoaderOptions extends ImageLoaderOptions {
    /** Storage configuration for auto-transfer functionality */
    storageConfig?: StorageConfig;
    /** Whether to automatically transfer missing images from IPFS */
    autoTransfer?: boolean;
    /** Progress callback for storage operations */
    onStorageProgress?: (progress: UploadProgress) => void;
}
/**
 * Enhanced image loader that integrates with storage orchestration
 * Implements your 3-step flow seamlessly with existing image loading
 */
export declare class EnhancedImageLoader extends ImageLoader {
    private orchestrator;
    private autoTransfer;
    private onStorageProgress?;
    constructor(options?: EnhancedImageLoaderOptions);
    /**
     * Load image with automatic storage flow integration
     * This is your main entry point that implements the 3-step process
     */
    loadImageWithStorageFlow(input: ImageSourceInput): Promise<LoadImageResult & {
        transferResult?: TransferResult;
    }>;
    /**
     * Manual storage flow trigger (without loading)
     */
    runStorageFlow(input: ImageSourceInput): Promise<StorageFlowResult>;
    /**
     * Test storage connectivity
     */
    testStorageStatus(): Promise<{
        available: boolean;
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
//# sourceMappingURL=enhanced-image-loader.d.ts.map