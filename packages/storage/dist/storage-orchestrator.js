/**
 * YOUR MAIN 3-STEP FLOW IMPLEMENTATION
 */
import { generateStoragePath, isValidIpfsHash } from '@ipfsnut/evermark-sdk-core';
import { SupabaseStorageClient } from './supabase-client.js';
import { IPFSClient } from './ipfs-client.js';
export class StorageOrchestrator {
    config;
    supabaseClient;
    ipfsClient;
    constructor(config) {
        this.config = config;
        this.supabaseClient = new SupabaseStorageClient(config.supabase);
        this.ipfsClient = new IPFSClient(config.ipfs);
    }
    /**
     * YOUR MAIN FLOW: Ensure image is available in Supabase
     *
     * 1. Check if image exists in Supabase
     * 2. If not, fetch from IPFS and upload to Supabase
     * 3. Fall back gracefully if transfers fail
     */
    async ensureImageInSupabase(input, onProgress) {
        const startTime = Date.now();
        const warnings = [];
        try {
            // STEP 1: Check if already in Supabase and accessible
            if (input.supabaseUrl) {
                onProgress?.({
                    phase: 'preparing',
                    percentage: 10,
                    message: 'Checking Supabase URL accessibility...'
                });
                const isAccessible = await this.testUrlAccessibility(input.supabaseUrl);
                if (isAccessible) {
                    console.log('✅ Image found and accessible in Supabase');
                    return {
                        finalUrl: input.supabaseUrl,
                        foundInSupabase: true,
                        transferPerformed: false,
                        totalTime: Date.now() - startTime
                    };
                }
                else {
                    warnings.push('Supabase URL exists but not accessible');
                }
            }
            // STEP 2: Try IPFS → Supabase transfer
            if (input.ipfsHash) {
                onProgress?.({
                    phase: 'preparing',
                    percentage: 30,
                    message: 'Starting IPFS to Supabase transfer...'
                });
                const transferResult = await this.transferIPFSToSupabase(input.ipfsHash, (progress) => {
                    // Map transfer progress to overall progress (30-90%)
                    const adjustedProgress = {
                        ...progress,
                        percentage: 30 + (progress.percentage * 0.6)
                    };
                    onProgress?.(adjustedProgress);
                });
                if (transferResult.success && transferResult.supabaseUrl) {
                    onProgress?.({
                        phase: 'complete',
                        percentage: 100,
                        message: 'Transfer completed successfully'
                    });
                    console.log('✅ IPFS → Supabase transfer successful');
                    return {
                        finalUrl: transferResult.supabaseUrl,
                        foundInSupabase: false,
                        transferPerformed: true,
                        transferResult,
                        totalTime: Date.now() - startTime,
                        ...(warnings.length > 0 && { warnings })
                    };
                }
                else {
                    warnings.push(`IPFS transfer failed: ${transferResult.error}`);
                }
            }
            // STEP 3: Graceful fallback to any available URL
            console.log('⚠️ Falling back to alternative URLs');
            const fallbackUrl = input.thumbnailUrl || input.processedUrl ||
                (input.externalUrls && input.externalUrls[0]);
            if (fallbackUrl) {
                warnings.push('Using fallback URL - storage operations failed');
                return {
                    finalUrl: fallbackUrl,
                    foundInSupabase: false,
                    transferPerformed: false,
                    totalTime: Date.now() - startTime,
                    warnings
                };
            }
            throw new Error('No usable image sources found in any step of the flow');
        }
        catch (error) {
            throw new Error(`Complete storage flow failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Transfer specific IPFS hash to Supabase Storage
     */
    async transferIPFSToSupabase(ipfsHash, onProgress) {
        const startTime = Date.now();
        try {
            if (!isValidIpfsHash(ipfsHash)) {
                throw new Error('Invalid IPFS hash provided');
            }
            // Generate unique storage path
            const extension = 'jpg'; // Could detect from content-type header
            const storagePath = generateStoragePath(ipfsHash, { extension });
            // Check if file already exists in Supabase
            onProgress?.({
                phase: 'preparing',
                percentage: 5,
                message: 'Checking if file already exists in Supabase...'
            });
            const exists = await this.supabaseClient.fileExists(storagePath);
            if (exists) {
                console.log('📁 File already exists in Supabase, returning existing URL');
                const existingUrl = this.supabaseClient.getPublicUrl(storagePath);
                return {
                    success: true,
                    supabaseUrl: existingUrl,
                    ipfsHash,
                    transferTime: Date.now() - startTime,
                    alreadyExists: true
                };
            }
            // Fetch from IPFS
            onProgress?.({
                phase: 'uploading',
                percentage: 20,
                message: 'Fetching image from IPFS...'
            });
            const ipfsResult = await this.ipfsClient.fetchFile(ipfsHash, {
                onProgress: (loaded, total) => {
                    const progressPercent = total ? (loaded / total) * 50 : 25;
                    onProgress?.({
                        phase: 'uploading',
                        percentage: 20 + progressPercent,
                        uploaded: loaded,
                        ...(total !== undefined && { total }),
                        message: `Downloading from IPFS (${ipfsResult.gateway || 'unknown gateway'})...`
                    });
                }
            });
            if (!ipfsResult.success || !ipfsResult.data) {
                throw new Error(ipfsResult.error || 'Failed to fetch image from IPFS');
            }
            console.log(`📥 Successfully fetched ${ipfsResult.data.size} bytes from IPFS`);
            // Upload to Supabase
            onProgress?.({
                phase: 'uploading',
                percentage: 70,
                message: 'Uploading to Supabase Storage...'
            });
            const uploadResult = await this.supabaseClient.uploadFile(ipfsResult.data, storagePath, {
                contentType: ipfsResult.data.type || 'image/jpeg',
                onProgress: (uploadProgress) => {
                    const adjustedProgress = {
                        ...uploadProgress,
                        percentage: 70 + (uploadProgress.percentage * 0.25)
                    };
                    onProgress?.(adjustedProgress);
                }
            });
            if (!uploadResult.success) {
                throw new Error(uploadResult.error || 'Failed to upload to Supabase');
            }
            console.log('📤 Successfully uploaded to Supabase');
            onProgress?.({
                phase: 'complete',
                percentage: 100,
                message: 'Transfer completed successfully'
            });
            return {
                success: true,
                supabaseUrl: uploadResult.supabaseUrl,
                ipfsHash,
                transferTime: Date.now() - startTime,
                fileSize: ipfsResult.data.size
            };
        }
        catch (error) {
            console.error('❌ IPFS → Supabase transfer failed:', error);
            return {
                success: false,
                ipfsHash,
                transferTime: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Transfer operation failed'
            };
        }
    }
    /**
     * Test URL accessibility
     */
    async testUrlAccessibility(url) {
        try {
            const response = await fetch(url, {
                method: 'HEAD',
                signal: AbortSignal.timeout(5000)
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /**
     * Get storage status
     */
    async getStorageStatus() {
        const [supabaseTest, ipfsTest] = await Promise.all([
            this.supabaseClient.testConnection(),
            this.ipfsClient.testGateways()
        ]);
        return {
            supabase: {
                available: supabaseTest.success,
                ...(supabaseTest.success && supabaseTest.latency !== undefined && { latency: supabaseTest.latency })
            },
            ipfs: {
                available: ipfsTest.some(g => g.available),
                gateways: ipfsTest
            }
        };
    }
}
//# sourceMappingURL=storage-orchestrator.js.map