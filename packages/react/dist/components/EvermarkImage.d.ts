import React from 'react';
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
export declare const EvermarkImage: React.FC<EvermarkImageProps>;
export {};
//# sourceMappingURL=EvermarkImage.d.ts.map