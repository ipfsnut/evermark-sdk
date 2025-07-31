/**
 * Integrates existing ImageLoader with storage orchestration
 */
import { ImageLoader } from './image-loader.js';
import { StorageOrchestrator } from '@ipfsnut/evermark-sdk-storage';
import { resolveImageSources } from '@ipfsnut/evermark-sdk-core';
/**
 * Enhanced image loader that integrates with storage orchestration
 * Implements your 3-step flow seamlessly with existing image loading
 */
export class EnhancedImageLoader extends ImageLoader {
    constructor(options = {}) {
        const { storageConfig, autoTransfer = false, onStorageProgress, ...baseOptions } = options;
        super(baseOptions);
        this.orchestrator = null;
        this.autoTransfer = autoTransfer;
        this.onStorageProgress = onStorageProgress;
        if (storageConfig) {
            this.orchestrator = new StorageOrchestrator(storageConfig);
        }
    }
    /**
     * Load image with automatic storage flow integration
     * This is your main entry point that implements the 3-step process
     */
    async loadImageWithStorageFlow(input) {
        try {
            // If we have storage orchestration enabled, run the flow first
            if (this.orchestrator && this.autoTransfer) {
                console.log('🔄 Starting storage flow before image loading...');
                const flowResult = await this.orchestrator.ensureImageInSupabase(input, this.onStorageProgress);
                // Update input with the result from storage flow
                const enhancedInput = {
                    ...input,
                    supabaseUrl: flowResult.finalUrl
                };
                // Resolve sources with the enhanced input
                const sources = resolveImageSources(enhancedInput, {
                    maxSources: 3,
                    includeIpfs: !flowResult.transferPerformed // Skip IPFS if we just transferred
                });
                // Load using parent ImageLoader
                const loadResult = await this.loadImage(sources);
                console.log(`✅ Image loading complete: ${loadResult.success ? 'success' : 'failed'}`);
                return {
                    ...loadResult,
                    transferResult: flowResult.transferResult
                };
            }
            // Fallback to normal loading without storage integration
            const sources = resolveImageSources(input);
            const loadResult = await this.loadImage(sources);
            console.log(`📷 Standard image loading: ${loadResult.success ? 'success' : 'failed'}`);
            return loadResult;
        }
        catch (error) {
            console.error('❌ Enhanced image loading failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Enhanced loading failed'
            };
        }
    }
    /**
     * Manual storage flow trigger (without loading)
     */
    async runStorageFlow(input) {
        if (!this.orchestrator) {
            throw new Error('Storage orchestrator not configured');
        }
        return await this.orchestrator.ensureImageInSupabase(input, this.onStorageProgress);
    }
    /**
     * Test storage connectivity
     */
    async testStorageStatus() {
        if (!this.orchestrator) {
            return {
                available: false,
                supabase: { available: false },
                ipfs: { available: false, gateways: [] }
            };
        }
        const status = await this.orchestrator.getStorageStatus();
        return {
            available: status.supabase.available && status.ipfs.available,
            ...status
        };
    }
}
//# sourceMappingURL=enhanced-image-loader.js.map