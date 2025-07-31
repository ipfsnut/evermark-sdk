/**
 * Complete upload component with drag & drop
 */

import React, { useCallback, useState, useEffect } from 'react';
import { useImageUpload } from '../hooks/useImageUpload.js';
import type { StorageConfig } from '@evermark-sdk/core';

interface ImageUploadProps {
  storageConfig: StorageConfig;
  onUploadComplete?: (result: { originalUrl: string; thumbnailUrl?: string }) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  generateThumbnails?: boolean;
  allowedTypes?: string[];
  maxFileSize?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  storageConfig,
  onUploadComplete,
  onUploadError,
  className = '',
  generateThumbnails = true,
  allowedTypes,
  maxFileSize
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const { status, progress, result, error, upload } = useImageUpload({
    storageConfig,
    generateThumbnails,
    allowedTypes,
    maxFileSize
  });

  // Handle completion
  useEffect(() => {
    if (status === 'complete' && result) {
      onUploadComplete?.(result);
    }
  }, [status, result, onUploadComplete]);

  // Handle errors
  useEffect(() => {
    if (status === 'failed' && error) {
      onUploadError?.(error);
    }
  }, [status, error, onUploadError]);

  const handleFile = useCallback(async (file: File) => {
    await upload(file);
  }, [upload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const isUploading = status === 'uploading';

  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            {progress && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{progress.message}</p>
                <p className="text-xs text-gray-500">{progress.percentage.toFixed(0)}% complete</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">Upload an image</p>
              <p className="text-sm text-gray-500">Drag and drop or click to select</p>
              <p className="text-xs text-gray-400 mt-1">
                Max {Math.round((maxFileSize || 10485760) / 1024 / 1024)}MB • {allowedTypes?.join(', ') || 'Images only'}
              </p>
            </div>
          </div>
        )}

        {/* Error display */}
        {status === 'failed' && error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Success display */}
        {status === 'complete' && result && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            ✅ Upload successful!
          </div>
        )}
      </div>
    </div>
  );
};