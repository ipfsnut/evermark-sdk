/**
 * Evermark SDK - Main exports
 * FIXED: Only export what actually exists, avoid duplicates
 */

// =================
// CORE EXPORTS (from existing files)
// =================

export type {
  ImageSource,
  ImageSourceInput,
  LoadAttempt,
  LoadingState,
  SourceResolutionConfig,
  StorageConfig,
  TransferResult,
  UploadProgress,
  StorageFlowResult,
  Result
} from './core/types';

// Export core functions
export {
  resolveImageSources,
  createIpfsUrl,
  createPlaceholderSource,
  isValidUrl,
  isValidIpfsHash,
  createDefaultStorageConfig
} from './core/url-resolver';

// =================
// STORAGE EXPORTS (only what we know exists)
// =================

export { StorageOrchestrator } from './storage/storage-orchestrator';

// =================
// BROWSER EXPORTS
// =================

export { ImageLoader } from './browser/image-loader';

// =================
// STORAGE EXPORTS
// =================

export { SupabaseStorageClient } from './storage/supabase-client';
export { IPFSClient } from './storage/ipfs-client';
export { StorageOrchestrator } from './storage/storage-orchestrator';

// =================
// REACT EXPORTS (comment out until files are fixed)
// =================

// TODO: Uncomment once React files are fixed  
// export { ImageDisplay } from './react/components/ImageDisplay';
// export { EvermarkImage } from './react/components/EvermarkImage';

// =================
// CONVENIENCE FUNCTIONS
// =================

/**
 * Create storage orchestrator with config
 */
export function createStorageOrchestrator(
  supabaseUrl: string,
  supabaseKey: string,
  bucketName: string = 'images',
  existingClient?: any
) {
  const config = {
    supabase: {
      url: supabaseUrl,
      anonKey: supabaseKey,
      bucketName,
      ...(existingClient && { client: existingClient })
    },
    ipfs: {
      gateway: 'https://gateway.pinata.cloud/ipfs',
      fallbackGateways: [
        'https://ipfs.io/ipfs',
        'https://cloudflare-ipfs.com/ipfs'
      ],
      timeout: 10000
    },
    upload: {
      maxFileSize: 10 * 1024 * 1024,
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      generateThumbnails: true,
      thumbnailSize: { width: 400, height: 400 }
    }
  };

  return new StorageOrchestrator(config);
}

// =================
// PACKAGE METADATA
// =================

export const PACKAGE_VERSION = '0.1.0';
export const PACKAGE_NAME = 'evermark-sdk';