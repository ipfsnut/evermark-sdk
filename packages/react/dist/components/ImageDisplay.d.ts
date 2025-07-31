import React from 'react';
import type { ImageSourceInput, SourceResolutionConfig } from '@evermark-sdk/core';
import type { UseImageLoaderOptions } from '../hooks/useImageLoader.js';
export interface ImageDisplayProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onLoad' | 'onError'> {
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
    onError?: ((error: string) => void) | undefined;
    /** Show debug information */
    showDebugInfo?: boolean;
}
/**
 * Image component with intelligent loading and fallbacks
 */
export declare const ImageDisplay: React.ForwardRefExoticComponent<ImageDisplayProps & React.RefAttributes<HTMLImageElement>>;
//# sourceMappingURL=ImageDisplay.d.ts.map