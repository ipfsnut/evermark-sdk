/**
 * Shows transfer progress and status
 * MINIMAL CHANGES: Fixed import paths only
 */

import React, { useEffect } from 'react';
import { useStorageFlow } from '../hooks/useStorageFlow.js';
import type { StorageConfig } from '../../core/types.js';

interface ImageTransferStatusProps {
  ipfsHash: string;
  storageConfig: StorageConfig;
  onTransferComplete?: (result: { supabaseUrl: string }) => void;
  onTransferError?: (error: string) => void;
  autoStart?: boolean;
  showRetryButton?: boolean;
}

export const ImageTransferStatus: React.FC<ImageTransferStatusProps> = ({
  ipfsHash,
  storageConfig,
  onTransferComplete,
  onTransferError,
  autoStart = true,
  showRetryButton = true
}) => {
  const { status, result, progress, error, startFlow, retry } = useStorageFlow({
    storageConfig,
    autoStart: false
  });

  // Auto-start effect
  useEffect(() => {
    if (autoStart && ipfsHash && status === 'idle') {
      startFlow({ ipfsHash });
    }
  }, [autoStart, ipfsHash, status, startFlow]);

  // Handle completion
  useEffect(() => {
    if (result?.transferPerformed && result.transferResult?.supabaseUrl) {
      onTransferComplete?.({ supabaseUrl: result.transferResult.supabaseUrl });
    }
  }, [result, onTransferComplete]);

  // Handle errors
  useEffect(() => {
    if (error) {
      onTransferError?.(error);
    }
  }, [error, onTransferError]);

  if (status === 'idle') {
    return (
      <button 
        onClick={() => startFlow({ ipfsHash })}
        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
      >
        Start Transfer
      </button>
    );
  }

  if (status === 'failed') {
    return (
      <div className="space-y-2">
        <div className="text-red-600 text-sm">❌ {error}</div>
        {showRetryButton && (
          <button 
            onClick={retry}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            Retry Transfer
          </button>
        )}
      </div>
    );
  }

  if (status === 'complete') {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">
          {result?.transferPerformed ? 'Transferred' : 'Already available'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-600">
          {status === 'checking' ? 'Checking sources...' : 'Transferring...'}
        </span>
      </div>
      {progress && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">{progress.message}</p>
        </div>
      )}
    </div>
  );
};