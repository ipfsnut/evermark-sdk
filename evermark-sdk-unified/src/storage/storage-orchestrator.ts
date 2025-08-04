/**
 * Main storage orchestration - uses existing client when provided
 * FIXED: Changed all imports to relative paths
 */

import type { 
  ImageSourceInput, 
  StorageFlowResult,
  UploadProgress,
  TransferResult,
  StorageConfig
} from '../core/types';
import { isValidIpfsHash } from '../core/url-resolver';
import { SupabaseStorageClient } from './supabase-client';
import { IPFSClient } from './ipfs-client';

export class StorageOrchestrator {
  private supabaseClient: SupabaseStorageClient;
  private ipfsClient: IPFSClient;

  constructor(private config: StorageConfig) {
    this.supabaseClient = new SupabaseStorageClient(config.supabase);
    this.ipfsClient = new IPFSClient(config.ipfs);
    
    if (config.supabase.client) {
      console.log('✅ StorageOrchestrator: Configured with existing Supabase client');
    } else {
      console.warn('⚠️ StorageOrchestrator: No existing client provided, will create new one');
    }
  }

  /**
   * Main flow: Ensure image is available in Supabase
   */
  async ensureImageInSupabase(
    input: ImageSourceInput,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<StorageFlowResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

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
        } else {
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

        const transferResult = await this.transferIPFSToSupabase(
          input.ipfsHash,
          (progress) => {
            const adjustedProgress = {
              ...progress,
              percentage: 30 + (progress.percentage * 0.6)
            };
            onProgress?.(adjustedProgress);
          }
        );

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
        } else {
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

    } catch (error) {
      throw new Error(
        `Complete storage flow failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Transfer specific IPFS hash to Supabase Storage
   */
  async transferIPFSToSupabase(
    ipfsHash: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<TransferResult> {
    const startTime = Date.now();

    try {
      if (!isValidIpfsHash(ipfsHash)) {
        throw new Error('Invalid IPFS hash provided');
      }

      // Generate unique storage path
      const extension = 'jpg';
      const storagePath = `evermarks/${ipfsHash.slice(0, 8)}/${ipfsHash}.${extension}`;

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
            message: `Downloading from IPFS...`
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

      const uploadResult = await this.supabaseClient.uploadFile(
        ipfsResult.data,
        storagePath,
        {
          contentType: ipfsResult.data.type || 'image/jpeg',
          onProgress: (uploadProgress) => {
            const adjustedProgress = {
              ...uploadProgress,
              percentage: 70 + (uploadProgress.percentage * 0.25)
            };
            onProgress?.(adjustedProgress);
          }
        }
      );

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
        supabaseUrl: uploadResult.supabaseUrl!,
        ipfsHash,
        transferTime: Date.now() - startTime,
        fileSize: ipfsResult.data.size
      };

    } catch (error) {
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
  private async testUrlAccessibility(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}