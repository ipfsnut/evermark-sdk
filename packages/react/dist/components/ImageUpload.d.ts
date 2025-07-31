/**
 * Complete upload component with drag & drop
 */
import React from 'react';
import type { StorageConfig } from '@ipfsnut/evermark-sdk-core';
interface ImageUploadProps {
    storageConfig: StorageConfig;
    onUploadComplete?: (result: {
        originalUrl: string;
        thumbnailUrl?: string;
    }) => void;
    onUploadError?: (error: string) => void;
    className?: string;
    generateThumbnails?: boolean;
    allowedTypes?: string[];
    maxFileSize?: number;
}
export declare const ImageUpload: React.FC<ImageUploadProps>;
export {};
//# sourceMappingURL=ImageUpload.d.ts.map