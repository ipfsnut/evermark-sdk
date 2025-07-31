/**
 * Enhanced EvermarkImage component with storage flow integration
 * This replaces your existing EvermarkImage.tsx file
 */
import React from 'react';
import type { StorageConfig } from '@ipfsnut/evermark-sdk-core';
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
    onTransferComplete?: (result: {
        supabaseUrl: string;
    }) => void;
}
/**
 * Enhanced EvermarkImage component using the SDK with storage integration
 * Backward compatible - works with or without storageConfig
 */
export declare const EvermarkImage: React.FC<EvermarkImageProps>;
export {};
//# sourceMappingURL=EvermarkImage.d.ts.map