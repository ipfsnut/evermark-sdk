/**
 * Complete upload component with drag & drop
 * MINIMAL CHANGES: Fixed import paths only
 */
import React from 'react';
import type { StorageConfig } from '../../core/types.js';
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