/**
 * Hook for uploading new images directly
 * MINIMAL CHANGES: Fixed import paths only
 */
import type { StorageConfig, UploadProgress } from '../../core/types.js';
export interface UseImageUploadOptions {
    storageConfig: StorageConfig;
    generateThumbnails?: boolean;
    allowedTypes?: string[];
    maxFileSize?: number;
    debug?: boolean;
}
export interface UseImageUploadResult {
    status: 'idle' | 'uploading' | 'complete' | 'failed';
    progress: UploadProgress | null;
    result: {
        originalUrl?: string;
        thumbnailUrl?: string;
    } | null;
    error: string | null;
    isUploading: boolean;
    upload: (file: File) => Promise<void>;
    reset: () => void;
}
export declare function useImageUpload(options: UseImageUploadOptions): UseImageUploadResult;
//# sourceMappingURL=useImageUpload.d.ts.map