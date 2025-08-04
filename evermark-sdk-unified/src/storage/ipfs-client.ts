/**
 * IPFS fetching with multiple gateway fallbacks
 */

import { isValidIpfsHash } from '../core/url-resolver';
import type { StorageConfig, IPFSFetchOptions } from '../core/types';

export class IPFSClient {
  private gateways: string[];
  private timeout: number;

  constructor(private config: StorageConfig['ipfs']) {
    this.gateways = [
      config.gateway,
      ...(config.fallbackGateways || [])
    ];
    this.timeout = config.timeout || 10000;
  }

  /**
   * Fetch file from IPFS with gateway fallbacks
   */
  async fetchFile(ipfsHash: string, options: IPFSFetchOptions = {}): Promise<{
    success: boolean;
    data?: Blob;
    error?: string;
    gateway?: string;
    metadata?: {
      size: number;
      type: string;
      loadTime: number;
    };
  }> {
    if (!isValidIpfsHash(ipfsHash)) {
      return { success: false, error: 'Invalid IPFS hash' };
    }

    const { timeout = this.timeout, onProgress } = options;
    const startTime = Date.now();
    
    for (const gateway of this.gateways) {
      try {
        const url = `${gateway}/${ipfsHash}`;
        console.log(`Attempting to fetch from gateway: ${gateway}`);
        
        const response = await this.fetchWithProgress(url, timeout, onProgress);
        
        if (response.ok) {
          const data = await response.blob();
          const loadTime = Date.now() - startTime;
          
          return { 
            success: true, 
            data, 
            gateway,
            metadata: {
              size: data.size,
              type: data.type,
              loadTime
            }
          };
        }
        
      } catch (error) {
        console.warn(`Failed to fetch from gateway ${gateway}:`, error);
        continue;
      }
    }

    return { 
      success: false, 
      error: `Failed to fetch from all ${this.gateways.length} gateways` 
    };
  }

  /**
   * Fetch with progress tracking and timeout
   */
  private async fetchWithProgress(
    url: string, 
    timeout: number,
    onProgress?: (loaded: number, total?: number) => void
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle progress tracking
      if (onProgress && response.body) {
        const total = parseInt(response.headers.get('content-length') || '0');
        let loaded = 0;

        const reader = response.body.getReader();
        const stream = new ReadableStream({
          start(controller) {
            function pump(): Promise<void> {
              return reader.read().then(({ done, value }) => {
                if (done) {
                  controller.close();
                  return;
                }
                
                loaded += value?.length || 0;
                if (onProgress) {
                  onProgress(loaded, total || undefined);
                }
                controller.enqueue(value);
                return pump();
              });
            }
            return pump();
          }
        });

        return new Response(stream, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText
        });
      }

      return response;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Test IPFS gateway availability
   */
  async testGateways(): Promise<Array<{ gateway: string; available: boolean; latency?: number }>> {
    const results = await Promise.allSettled(
      this.gateways.map(async (gateway) => {
        const startTime = Date.now();
        try {
          const testHash = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
          const response = await fetch(`${gateway}/${testHash}`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
          });
          
          return {
            gateway,
            available: response.ok,
            latency: Date.now() - startTime
          };
        } catch {
          return { gateway, available: false };
        }
      })
    );

    return results.map((result, index) => 
      result.status === 'fulfilled' 
        ? result.value 
        : { gateway: this.gateways[index]!, available: false }
    );
  }
}