/**
 * Shows transfer progress and status
 */
import React from 'react';
import type { StorageConfig } from '@evermark-sdk/core';
interface ImageTransferStatusProps {
    ipfsHash: string;
    storageConfig: StorageConfig;
    onTransferComplete?: (result: {
        supabaseUrl: string;
    }) => void;
    onTransferError?: (error: string) => void;
    autoStart?: boolean;
    showRetryButton?: boolean;
}
export declare const ImageTransferStatus: React.FC<ImageTransferStatusProps>;
export {};
//# sourceMappingURL=ImageTransferStatus.d.ts.map