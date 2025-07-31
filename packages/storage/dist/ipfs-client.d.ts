/**
 * IPFS fetching with multiple gateway fallbacks
 */
import type { StorageConfig } from '@evermark-sdk/core';
export interface IPFSFetchOptions {
    timeout?: number;
    maxRetries?: number;
    onProgress?: (loaded: number, total?: number) => void;
}
export declare class IPFSClient {
    private config;
    private gateways;
    private timeout;
    constructor(config: StorageConfig['ipfs']);
    /**
     * Fetch file from IPFS with gateway fallbacks
     */
    fetchFile(ipfsHash: string, options?: IPFSFetchOptions): Promise<{
        success: boolean;
        data?: Blob;
        error?: string;
        gateway?: string;
        metadata?: {
            size: number;
            type: string;
            loadTime: number;
        };
    }>;
    /**
     * Fetch with progress tracking and timeout
     */
    private fetchWithProgress;
    /**
     * Test IPFS gateway availability
     */
    testGateways(): Promise<Array<{
        gateway: string;
        available: boolean;
        latency?: number;
    }>>;
}
//# sourceMappingURL=ipfs-client.d.ts.map