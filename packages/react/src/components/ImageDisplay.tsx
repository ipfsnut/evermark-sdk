import React, { forwardRef } from 'react';
import { useImageLoader } from '../hooks/useImageLoader.js';
import type { ImageSourceInput, SourceResolutionConfig } from '@evermark-sdk/core';
import type { UseImageLoaderOptions } from '../hooks/useImageLoader.js';

export interface ImageDisplayProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onLoad' | 'onError'> {
  /** Image source input */
  sources: ImageSourceInput;
  /** Alt text for accessibility */
  alt: string;
  /** Resolution configuration */
  resolution?: SourceResolutionConfig;
  /** Loader options */
  loaderOptions?: UseImageLoaderOptions;
  /** Loading placeholder component */
  loadingPlaceholder?: React.ReactNode;
  /** Error placeholder component */
  errorPlaceholder?: React.ReactNode;
  /** Callback when image loads successfully */
  onLoad?: ((url: string, fromCache: boolean) => void) | undefined;
  /** Callback when image fails to load */
  onError?: ((error: string) => void) | undefined; // <-- override here
  /** Show debug information */
  showDebugInfo?: boolean;
}

/**
 * Image component with intelligent loading and fallbacks
 */
export const ImageDisplay = forwardRef<HTMLImageElement, ImageDisplayProps>(
  ({
    sources,
    alt,
    resolution,
    loaderOptions,
    loadingPlaceholder,
    errorPlaceholder,
    onLoad,
    onError,
    showDebugInfo = false,
    className = '',
    ...imgProps
  }, ref) => {
    const loaderConfig: UseImageLoaderOptions = {
      autoLoad: true,
      ...(resolution && { resolution }),
      ...(loaderOptions && loaderOptions)
    };

    const {
      imageUrl,
      isLoading,
      hasError,
      error,
      fromCache,
      loadTime,
      retry,
      attempts
    } = useImageLoader(sources, loaderConfig);

    // Handle load success
    React.useEffect(() => {
      if (imageUrl && onLoad) {
        onLoad(imageUrl, fromCache);
      }
    }, [imageUrl, fromCache, onLoad]);

    // Handle load error
    React.useEffect(() => {
      if (hasError && error && onError) {
        onError(error);
      }
    }, [hasError, error, onError]);

    // Loading state
    if (isLoading) {
      return (
        <div className={`evermark-image-loading ${className}`}>
          {loadingPlaceholder || (
            <div className="flex items-center justify-center bg-gray-200 animate-pulse">
              <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      );
    }

    // Error state
    if (hasError) {
      return (
        <div className={`evermark-image-error ${className}`}>
          {errorPlaceholder || (
            <div className="flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
              <svg className="w-6 h-6 text-red-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-600 mb-2">Failed to load image</p>
              <button
                onClick={retry}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Retry
              </button>
              {showDebugInfo && (
                <details className="mt-2 text-xs text-gray-500">
                  <summary>Debug Info</summary>
                  <div className="mt-1">
                    <p>Error: {error}</p>
                    <p>Attempts: {attempts.length}</p>
                    {attempts.map((attempt, index) => (
                      <p key={index}>
                        {index + 1}. {attempt.url} - {attempt.success ? 'Success' : `Failed: ${attempt.error}`}
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      );
    }

    // Success state
    if (imageUrl) {
      return (
        <div className="evermark-image-container relative">
          <img
            ref={ref}
            src={imageUrl}
            alt={alt}
            className={className}
            {...imgProps}
          />
          {showDebugInfo && (
            <div className="absolute top-0 left-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
              <p>✅ Loaded {fromCache ? 'from cache' : 'from network'}</p>
              {loadTime && <p>Time: {loadTime}ms</p>}
              <p>Source: {imageUrl.includes('supabase') ? 'Supabase' : imageUrl.includes('ipfs') ? 'IPFS' : 'Other'}</p>
            </div>
          )}
        </div>
      );
    }

    return null;
  }
);

ImageDisplay.displayName = 'ImageDisplay';