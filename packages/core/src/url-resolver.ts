/**
 * Pure functions for resolving image sources from various input types
 * This module contains no side effects and is easily testable
 */

import type { 
  ImageSource, 
  ImageSourceInput, 
  SourceResolutionConfig,
  SourceResolver 
} from './types.js';

/**
 * Default configuration for source resolution
 */
const DEFAULT_CONFIG: Required<SourceResolutionConfig> = {
  maxSources: 5,
  defaultTimeout: 8000,
  includeIpfs: true,
  ipfsGateway: 'https://gateway.pinata.cloud/ipfs',
  mobileOptimization: false,
  priorityOverrides: {}
};

/**
 * Default timeouts by source type (in milliseconds)
 */
const DEFAULT_TIMEOUTS = {
  thumbnail: 3000,
  primary: 5000,
  fallback: 8000,
  placeholder: 1000
} as const;

/**
 * Validates if a URL string is properly formatted
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validates if an IPFS hash is properly formatted
 */
export function isValidIpfsHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false;
  
  // Check for various IPFS hash formats
  const ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|B[A-Z2-7]{58}|z[1-9A-HJ-NP-Za-km-z]{48}|F[0-9A-F]{50})$/;
  return ipfsHashRegex.test(hash);
}

/**
 * Creates an IPFS gateway URL from a hash
 */
export function createIpfsUrl(hash: string, gateway: string = DEFAULT_CONFIG.ipfsGateway): string {
  if (!isValidIpfsHash(hash)) {
    throw new Error(`Invalid IPFS hash: ${hash}`);
  }
  
  const cleanGateway = gateway.replace(/\/$/, '');
  return `${cleanGateway}/${hash}`;
}

/**
 * Determines storage provider from URL
 */
function getStorageProvider(url: string): 'supabase' | 'ipfs' | 'cdn' | 'external' {
  if (url.includes('supabase')) return 'supabase';
  if (url.includes('ipfs') || url.includes('pinata')) return 'ipfs';
  if (url.includes('cloudflare') || url.includes('cdn')) return 'cdn';
  return 'external';
}

/**
 * Extract image format from URL
 */
function extractImageFormat(url: string): 'jpg' | 'png' | 'gif' | 'webp' | 'svg' | undefined {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const extension = pathname.split('.').pop();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return extension === 'jpeg' ? 'jpg' : extension as 'jpg' | 'png' | 'gif' | 'webp' | 'svg';
    }
  } catch {
    // Invalid URL, ignore
  }
  
  return undefined;
}

/**
 * Resolves multiple image sources from input with intelligent prioritization
 */
export const resolveImageSources: SourceResolver = (
  input: ImageSourceInput,
  config: SourceResolutionConfig = {}
): ImageSource[] => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const sources: ImageSource[] = [];

  // Helper to add a source with proper priority and metadata
  const addSource = (
    url: string,
    type: ImageSource['type'],
    basePriority: number,
    size?: 'thumbnail' | 'medium' | 'large' | 'original'
  ) => {
    if (!isValidUrl(url)) return;

    const customPriority = finalConfig.priorityOverrides[url];
    const priority = customPriority ?? basePriority;
    
    const metadata: ImageSource['metadata'] = {
      storageProvider: getStorageProvider(url)
    };
    
    if (size) {
      metadata.size = size;
    }
    
    const format = extractImageFormat(url);
    if (format) {
      metadata.format = format;
    }

    sources.push({
      url,
      type,
      priority,
      timeout: DEFAULT_TIMEOUTS[type] || finalConfig.defaultTimeout,
      metadata
    });
  };

  // 1. Add thumbnail first if preferred or on mobile
  if ((input.preferThumbnail || finalConfig.mobileOptimization) && input.thumbnailUrl) {
    addSource(input.thumbnailUrl, 'thumbnail', 1, 'thumbnail');
  }

  // 2. Add primary Supabase URL
  if (input.supabaseUrl) {
    const priority = input.preferThumbnail ? 2 : 1;
    addSource(input.supabaseUrl, 'primary', priority, 'large');
  }

  // 3. Add thumbnail if not already added
  if (!input.preferThumbnail && !finalConfig.mobileOptimization && input.thumbnailUrl) {
    addSource(input.thumbnailUrl, 'thumbnail', 2, 'thumbnail');
  }

  // 4. Add legacy processed URL
  if (input.processedUrl && input.processedUrl !== input.supabaseUrl) {
    addSource(input.processedUrl, 'fallback', 3, 'medium');
  }

  // 5. Add external URLs
  if (input.externalUrls) {
    input.externalUrls.forEach((url, index) => {
      addSource(url, 'fallback', 4 + index, 'original');
    });
  }

  // 6. Add IPFS fallback if enabled
  if (finalConfig.includeIpfs && input.ipfsHash && isValidIpfsHash(input.ipfsHash)) {
    try {
      const ipfsUrl = createIpfsUrl(input.ipfsHash, finalConfig.ipfsGateway);
      addSource(ipfsUrl, 'fallback', 10, 'original'); // Always lowest priority
    } catch (error) {
      console.warn('Failed to create IPFS URL:', error);
    }
  }

  // Sort by priority and limit to maxSources
  const sortedSources = sources
    .sort((a, b) => a.priority - b.priority)
    .slice(0, finalConfig.maxSources);

  return sortedSources;
};

/**
 * Creates a placeholder source for fallback display
 */
export function createPlaceholderSource(
  type: 'loading' | 'error' | 'empty',
  customUrl?: string
): ImageSource {
  const placeholderUrls = {
    loading: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0yMCAxMlYyMEw2IDI2IiBzdHJva2U9IiMzNzQxNTEiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=',
    error: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIHN0cm9rZT0iI0VGNDQ0NCIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxwYXRoIGQ9Ik0xNSAxNUwyNSAyNU0yNSAxNUwxNSAyNSIgc3Ryb2tlPSIjRUY0NDQ0IiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K',
    empty: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iMTQiIGN5PSIxNCIgcj0iMiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMzIgMjhMMjYgMjJMMTAgMzIiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+Cg=='
  };

  return {
    url: customUrl || placeholderUrls[type],
    type: 'placeholder',
    priority: 999,
    timeout: 100,
    metadata: {
      storageProvider: 'external',
      size: 'thumbnail',
      format: 'svg'
    }
  };
}

/**
 * Filters sources based on network conditions or preferences
 */
export function filterSourcesByCondition(
  sources: ImageSource[],
  condition: 'slow-network' | 'fast-network' | 'prefer-thumbnails' | 'avoid-ipfs'
): ImageSource[] {
  switch (condition) {
    case 'slow-network':
      return sources.filter(s => 
        s.type === 'thumbnail' || 
        (s.metadata?.storageProvider === 'supabase' && s.metadata?.size !== 'original')
      );
    
    case 'fast-network':
      return sources; // Use all sources
    
    case 'prefer-thumbnails':
      return sources.filter(s => s.type === 'thumbnail' || s.type === 'primary');
    
    case 'avoid-ipfs':
      return sources.filter(s => s.metadata?.storageProvider !== 'ipfs');
    
    default:
      return sources;
  }
}

/**
 * Validates a complete image source configuration
 */
export function validateImageSources(sources: ImageSource[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (sources.length === 0) {
    errors.push('No image sources provided');
  }

  for (let i = 0; i < sources.length; i++) {
    const source = sources[i];
    
    if (!source) {
      errors.push(`Source at index ${i} is undefined`);
      continue;
    }
    
    if (!isValidUrl(source.url)) {
      errors.push(`Invalid URL at index ${i}: ${source.url}`);
    }
    
    if (typeof source.priority !== 'number' || source.priority < 0) {
      errors.push(`Invalid priority at index ${i}: ${source.priority}`);
    }
    
    if (source.timeout && (typeof source.timeout !== 'number' || source.timeout <= 0)) {
      errors.push(`Invalid timeout at index ${i}: ${source.timeout}`);
    }
  }

  // Check for duplicate priorities
  const priorities = sources.map(s => s.priority);
  const duplicates = priorities.filter((p, i) => priorities.indexOf(p) !== i);
  if (duplicates.length > 0) {
    errors.push(`Duplicate priorities found: ${duplicates.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}