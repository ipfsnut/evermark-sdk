import React from 'react';
import { ImageDisplay } from './ImageDisplay.js';
import type { ImageSourceInput } from '@evermark-sdk/core';

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
  /** Display variant */
  variant?: 'hero' | 'standard' | 'compact' | 'list';
  /** Show placeholder when no image */
  showPlaceholder?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Callback when image loads */
  onImageLoad?: () => void;
  /** Callback when image fails */
  onImageError?: (error: string) => void;
}

/**
 * Enhanced EvermarkImage component using the SDK
 * This is a drop-in replacement for your existing component
 */
export const EvermarkImage: React.FC<EvermarkImageProps> = ({
  evermark,
  variant = 'standard',
  showPlaceholder = true,
  className = '',
  onImageLoad,
  onImageError
}) => {
  // Convert evermark data to ImageSourceInput
  const sources: ImageSourceInput = {
    supabaseUrl: evermark.supabaseImageUrl,
    thumbnailUrl: evermark.thumbnailUrl,
    processedUrl: evermark.processed_image_url,
    ipfsHash: evermark.ipfsHash,
    preferThumbnail: variant === 'compact' || variant === 'list'
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

  return (
    <div className={`${getVariantStyles()} ${className} group cursor-pointer hover:scale-105 transition-transform`}>
      <ImageDisplay
        sources={sources}
        alt={evermark.title}
        className="w-full h-full object-cover"
        loadingPlaceholder={placeholder}
        errorPlaceholder={errorPlaceholder}
        onLoad={onImageLoad}
        onError={onImageError}
        resolution={{
          preferThumbnail: variant === 'compact' || variant === 'list',
          maxSources: 3
        }}
        loaderOptions={{
          debug: import.meta.env.DEV,
          timeout: variant === 'list' ? 5000 : 8000
        }}
      />

      {/* Status indicators */}
      {evermark.imageStatus === 'processing' && (
        <div className="absolute bottom-2 left-2 bg-black/80 text-xs px-2 py-1 rounded backdrop-blur-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-blue-400">Processing</span>
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
