/**
 * Hook for uploading new images directly
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { SupabaseStorageClient } from '@evermark-sdk/storage';
import type { StorageConfig, UploadProgress } from '@evermark-sdk/core';

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

export function useImageUpload(options: UseImageUploadOptions): UseImageUploadResult {
  const { 
    storageConfig, 
    generateThumbnails = true,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize = 10 * 1024 * 1024, // 10MB
    debug = false
  } = options;

  const [status, setStatus] = useState<UseImageUploadResult['status']>('idle');
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [result, setResult] = useState<UseImageUploadResult['result']>(null);
  const [error, setError] = useState<string | null>(null);

  const clientRef = useRef<SupabaseStorageClient | null>(null);

  // Initialize client
  useEffect(() => {
    clientRef.current = new SupabaseStorageClient(storageConfig.supabase);
  }, [storageConfig]);

  const upload = useCallback(async (file: File) => {
    if (!clientRef.current) return;

    try {
      // Validate file
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} not allowed`);
      }

      if (file.size > maxFileSize) {
        throw new Error(`File size ${file.size} exceeds maximum ${maxFileSize}`);
      }

      setStatus('uploading');
      setError(null);
      setProgress(null);
      setResult(null);

      if (debug) console.log('[ImageUpload] Starting upload:', file.name);

      // Generate unique path
      const timestamp = Date.now();
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const originalPath = `uploads/${timestamp}.${extension}`;

      // Upload original
      const uploadResult = await clientRef.current.uploadFile(
        file,
        originalPath,
        {
          onProgress: setProgress
        }
      );

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      setResult({
        originalUrl: uploadResult.supabaseUrl,
        thumbnailUrl: undefined // Could add thumbnail generation here
      });
      setStatus('complete');

      if (debug) console.log('[ImageUpload] Upload completed');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setStatus('failed');
      setProgress(null);

      if (debug) console.error('[ImageUpload] Upload failed:', err);
    }
  }, [allowedTypes, maxFileSize, debug]);

  const reset = useCallback(() => {
    setStatus('idle');
    setProgress(null);
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    progress,
    result,
    error,
    isUploading: status === 'uploading',
    upload,
    reset
  };
}