/**
 * Convenient API - the "happy path" for most users
 * PHASE 2: Simple functions for common use cases
 */

import { StorageOrchestrator } from './storage/storage-orchestrator.js';
import { EnhancedImageLoader } from './browser/enhanced-image-loader.js';
import { ImageLoader } from './browser/image-loader.js';
import { resolveImageSources } from './core/url-resolver.js';
import { createDefaultStorageConfig } from './core/storage-utils.js';
import type { 
  ImageSourceInput, 
  StorageConfig, 
  UploadProgress, 
  StorageFlowResult,
  LoadImageResult,
  ImageLoaderOptions
} from './core/types.js';

/**
 * Load an image with intelligent fallbacks and optional auto-transfer
 * This is what most users actually want - just load an image reliably
 */
export async function loadImage(
  input: ImageSourceInput,
  options?: {
    storageConfig?: StorageConfig;
    preferThumbnail?: boolean;
    autoTransfer?: boolean;
    timeout?: number;
    debug?: boolean;
  }
): Promise<LoadImageResult> {
  const {
    storageConfig,
    autoTransfer = false,
    timeout = 8000,
    debug = false,
    preferThumbnail = false
  } = options || {};

  // Enhance input with preference
  const enhancedInput = { ...input, preferThumbnail };

  if (storageConfig && autoTransfer) {
    // Use enhanced loader with storage flow - only pass storageConfig when defined
    const loader = new EnhancedImageLoader({
      storageConfig,
      autoTransfer: true,
      timeout,
      debug
    });
    return await loader.loadImageWithStorageFlow(enhancedInput);
  } else {
    // Use basic loader
    const sources = resolveImageSources(enhancedInput);
    const loader = new ImageLoader({ timeout, debug });
    return await loader.loadImage(sources);
  }
}

/**
 * Transfer IPFS image to Supabase - simple wrapper
 * This is the other main use case users have
 */
export async function transferToSupabase(
  ipfsHash: string,
  storageConfig: StorageConfig,
  onProgress?: (progress: UploadProgress) => void
): Promise<StorageFlowResult> {
  const orchestrator = new StorageOrchestrator(storageConfig);
  return await orchestrator.ensureImageInSupabase({ ipfsHash }, onProgress);
}

/**
 * Create an image loader with common defaults
 * Simple factory for the most common case
 */
export function createImageLoader(options?: {
  supabaseUrl?: string;
  supabaseKey?: string;
  bucketName?: string;
  existingClient?: any;
  mobile?: boolean;
  autoTransfer?: boolean;
}): EnhancedImageLoader {
  const { 
    mobile = false, 
    autoTransfer = true,
    ...storageOptions 
  } = options || {};
  
  // FIXED: Handle undefined storageConfig properly for strict TypeScript
  const baseLoaderOptions = {
    autoTransfer,
    timeout: mobile ? 5000 : 8000,
    maxRetries: mobile ? 1 : 2,
    debug: false
  };

  if (storageOptions.supabaseUrl && storageOptions.supabaseKey) {
    const storageConfig = createDefaultStorageConfig(
      storageOptions.supabaseUrl,
      storageOptions.supabaseKey,
      storageOptions.bucketName || 'images',
      storageOptions.existingClient
    );
    
    return new EnhancedImageLoader({
      ...baseLoaderOptions,
      storageConfig
    });
  }

  // Return without storageConfig if not provided
  return new EnhancedImageLoader(baseLoaderOptions);
}

/**
 * One-liner: "just show this image reliably"
 * The simplest possible API for basic use cases
 */
export async function showImage(
  imageData: {
    supabaseUrl?: string;
    ipfsHash?: string;
    thumbnailUrl?: string;
  },
  supabaseConfig?: {
    url: string;
    key: string;
    existingClient?: any;
  }
): Promise<string | null> {
  try {
    // FIXED: Only pass storageConfig when it's defined
    const loadOptions: {
      autoTransfer: boolean;
      timeout: number;
      storageConfig?: StorageConfig;
    } = {
      autoTransfer: !!supabaseConfig,
      timeout: 8000
    };

    if (supabaseConfig) {
      loadOptions.storageConfig = createDefaultStorageConfig(
        supabaseConfig.url,
        supabaseConfig.key,
        'images',
        supabaseConfig.existingClient
      );
    }

    const result = await loadImage(imageData, loadOptions);
    return result.success ? result.imageUrl || null : null;
  } catch (error) {
    console.warn('showImage failed:', error);
    return null;
  }
}

/**
 * Enhanced createStorageOrchestrator with defaults
 */
export function createStorageOrchestrator(
  supabaseUrl: string,
  supabaseKey: string,
  bucketName: string = 'images',
  existingClient?: any
): StorageOrchestrator {
  const config = createDefaultStorageConfig(
    supabaseUrl,
    supabaseKey,
    bucketName,
    existingClient
  );

  return new StorageOrchestrator(config);
}