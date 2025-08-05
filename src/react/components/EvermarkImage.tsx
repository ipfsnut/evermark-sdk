/**
 * Enhanced EvermarkImage component with storage flow integration
 * MINIMAL CHANGES: Fixed import paths only
 */

import React, { useState, useEffect } from 'react';
import { ImageDisplay } from './ImageDisplay.js';
import { ImageTransferStatus } from './ImageTransferStatus.js';
import type { ImageSourceInput, StorageConfig } from '../../core/types.js';

interface EvermarkImageProps {
  /** Evermark data */
  evermark: {
    id: string;
    tokenId: number;
    title: string;
    contentType: string;
    supabaseImageUrl?: string;
    thumbnailUrl?: string;
    processed_image_url?: string;
    ipfsHash?: string;
    imageStatus?: 'processed' | 'processing' | 'failed' | 'none';
  };
  /** Storage configuration for transfer operations */
  storageConfig?: StorageConfig;
  /** Display variant */
  variant?: 'hero' | 'standard' | 'compact' | 'list';
  /** Show placeholder when no image */
  showPlaceholder?: boolean;
  /** Enable automatic IPFS→Supabase transfer */
  enableAutoTransfer?: boolean;
  /** Show transfer status overlay */
  showTransferStatus?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when image loads */
  onImageLoad?: () => void;
  /** Callback when image fails */
  onImageError?: (error: string) => void;
  /** Callback when transfer completes */
  onTransferComplete?: (result: { supabaseUrl: string }) => void;
}

/**
 * Enhanced EvermarkImage component using the SDK with storage integration
 * Backward compatible - works with or without storageConfig
 */
export const EvermarkImage: React.FC<EvermarkImageProps> = ({
  evermark,
  storageConfig,
  variant = 'standard',
  showPlaceholder = true,
  enableAutoTransfer = true,
  showTransferStatus = true,
  className = '',
  onImageLoad,
  onImageError,
  onTransferComplete
}) => {
  const [currentSupabaseUrl, setCurrentSupabaseUrl] = useState(evermark.supabaseImageUrl);
  const [transferInProgress, setTransferInProgress] = useState(false);

  // Convert evermark data to ImageSourceInput - handle strict TypeScript mode
  const sources: ImageSourceInput = {};
  
  // Only add properties if they have values (strict mode compliance)
  if (currentSupabaseUrl) {
    sources.supabaseUrl = currentSupabaseUrl;
  }
  if (evermark.thumbnailUrl) {
    sources.thumbnailUrl = evermark.thumbnailUrl;
  }
  if (evermark.processed_image_url) {
    sources.processedUrl = evermark.processed_image_url;
  }
  if (evermark.ipfsHash) {
    sources.ipfsHash = evermark.ipfsHash;
  }
  
  // Set preferThumbnail flag
  sources.preferThumbnail = variant === 'compact' || variant === 'list';

  // Only show transfer if storage config is provided and conditions are met
  const shouldShowTransfer = storageConfig &&
    enableAutoTransfer && 
    showTransferStatus &&
    !currentSupabaseUrl && 
    evermark.ipfsHash &&
    !transferInProgress;

  const handleTransferComplete = (result: { supabaseUrl: string }) => {
    setCurrentSupabaseUrl(result.supabaseUrl);
    setTransferInProgress(false);
    onTransferComplete?.(result);
  };

  // Variant-specific styles
  const getVariantStyles = () => {
    const baseStyles = 'relative overflow-hidden bg-gray-800 border border-gray-700 rounded-lg';
    
    switch (variant) {
      case 'hero':
        return `${baseStyles} h-64 sm:h-80`;
      case 'compact':
        return `${baseStyles} h-32 sm:h-40`;
      case 'list':
        return `${baseStyles} w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0`;
      default:
        return `${baseStyles} h-48 sm:h-56`;
    }
  };

  // Content type styling
  const getContentTypeStyle = (contentType: string) => {
    const styles = {
      'Cast': { gradient: 'from-purple-500 to-pink-500', icon: '💬' },
      'DOI': { gradient: 'from-blue-500 to-cyan-500', icon: '📄' },
      'ISBN': { gradient: 'from-green-500 to-teal-500', icon: '📚' },
      'URL': { gradient: 'from-orange-500 to-red-500', icon: '🌐' },
      'Custom': { gradient: 'from-gray-500 to-gray-700', icon: '✨' }
    };
    
    return styles[contentType as keyof typeof styles] || styles.Custom;
  };

  const contentStyle = getContentTypeStyle(evermark.contentType);

  // Placeholder component
  const placeholder = showPlaceholder ? (
    <div className={`absolute inset-0 bg-gradient-to-br ${contentStyle.gradient} flex flex-col items-center justify-center`}>
      <div className="text-center">
        <div className="text-4xl mb-2">{contentStyle.icon}</div>
        <div className="text-white/80 text-sm font-medium">#{evermark.tokenId}</div>
        {variant !== 'compact' && variant !== 'list' && (
          <div className="text-white/60 text-xs mt-1 px-2 max-w-[120px] truncate">
            {evermark.title}
          </div>
        )}
      </div>
    </div>
  ) : undefined;

  // Error placeholder with retry
  const errorPlaceholder = (
    <div className={`absolute inset-0 bg-gradient-to-br ${contentStyle.gradient} flex flex-col items-center justify-center`}>
      <div className="text-center">
        <div className="text-2xl mb-2">⚠️</div>
        <div className="text-white/80 text-xs font-medium">#{evermark.tokenId}</div>
        <div className="text-white/60 text-xs mt-1">Click to retry</div>
      </div>
    </div>
  );

  // Resolution config
  const resolutionConfig = { 
    preferThumbnail: variant === 'compact' || variant === 'list',
    maxSources: 3 
  };

  // Loader options
  const loaderOptions = {
    debug: false,
    timeout: variant === 'list' ? 5000 : 8000
  };

  // Handle transfer status props - strict mode compliance
  const transferStatusProps: {
    ipfsHash: string;
    storageConfig: StorageConfig;
    onTransferComplete: (result: { supabaseUrl: string }) => void;
    autoStart: boolean;
    onTransferError?: (error: string) => void;
  } = {
    ipfsHash: evermark.ipfsHash!,
    storageConfig: storageConfig!,
    onTransferComplete: handleTransferComplete,
    autoStart: enableAutoTransfer
  };

  // Only add onTransferError if defined
  if (onImageError) {
    transferStatusProps.onTransferError = onImageError;
  }

  return (
    <div className={`${getVariantStyles()} ${className} group cursor-pointer hover:scale-105 transition-transform`}>
      {/* Main Image Display */}
      <ImageDisplay
        sources={sources}
        alt={evermark.title}
        className="w-full h-full object-cover"
        loadingPlaceholder={placeholder}
        errorPlaceholder={errorPlaceholder}
        onLoad={onImageLoad ? ((url: string, fromCache: boolean) => { onImageLoad(); }) : undefined}
        onError={onImageError}
        resolution={resolutionConfig}
        loaderOptions={loaderOptions}
      />

      {/* Transfer Status Overlay - Only shows if storage config provided */}
      {shouldShowTransfer && evermark.ipfsHash && storageConfig && (
        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded backdrop-blur-sm">
          <ImageTransferStatus {...transferStatusProps} />
        </div>
      )}

      {/* Status indicators */}
      {evermark.imageStatus === 'processing' && (
        <div className="absolute bottom-2 left-2 bg-black/80 text-xs px-2 py-1 rounded backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-400">Processing</span>
          </div>
        </div>
      )}

      {/* Transfer Status Badge */}
      {transferInProgress && (
        <div className="absolute top-2 right-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Transferring</span>
          </div>
        </div>
      )}

      {/* Token ID badge */}
      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono backdrop-blur-sm">
        #{evermark.tokenId}
      </div>
    </div>
  );
};