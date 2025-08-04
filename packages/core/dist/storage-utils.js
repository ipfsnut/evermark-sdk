/**
 * Pure utility functions for storage operations - no side effects
 * NO EXTERNAL DEPENDENCIES
 */
/**
 * Validates if a URL string is properly formatted
 */
export function isValidUrl(url) {
    if (!url || typeof url !== 'string')
        return false;
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    }
    catch {
        return false;
    }
}
/**
 * Enhanced IPFS hash validation with multiple format support
 */
export function isValidIpfsHash(hash) {
    if (!hash || typeof hash !== 'string')
        return false;
    // CIDv0 (base58btc, starts with Qm)
    const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
    // CIDv1 (base32, starts with b)
    const cidv1Base32Regex = /^b[a-z2-7]{58}$/;
    // CIDv1 (base32upper, starts with B)  
    const cidv1Base32UpperRegex = /^B[A-Z2-7]{58}$/;
    // CIDv1 (base58btc, starts with z)
    const cidv1Base58Regex = /^z[1-9A-HJ-NP-Za-km-z]{48,}$/;
    // CIDv1 (base16, starts with f or F)
    const cidv1Base16Regex = /^[fF][0-9a-fA-F]{50,}$/;
    return (cidv0Regex.test(hash) ||
        cidv1Base32Regex.test(hash) ||
        cidv1Base32UpperRegex.test(hash) ||
        cidv1Base58Regex.test(hash) ||
        cidv1Base16Regex.test(hash));
}
/**
 * Enhanced Supabase URL validation
 */
export function isValidSupabaseUrl(url) {
    if (!isValidUrl(url))
        return false;
    try {
        const parsed = new URL(url);
        const supabasePatterns = [
            /\.supabase\.co/,
            /\.supabase\.in/,
            /supabase\.storage/,
            /storage\.supabase/
        ];
        return supabasePatterns.some(pattern => pattern.test(parsed.hostname));
    }
    catch {
        return false;
    }
}
/**
 * Extract Supabase project ID from URL
 */
export function extractSupabaseProjectId(url) {
    try {
        const parsed = new URL(url);
        const parts = parsed.hostname.split('.');
        if (parts.length >= 3 && parts[1] === 'supabase') {
            return parts[0] || null;
        }
        return null;
    }
    catch {
        return null;
    }
}
/**
 * Generate storage path from IPFS hash
 */
export function generateStoragePath(ipfsHash, options = {}) {
    const { prefix = 'images', includeHash = true, extension } = options;
    if (!isValidIpfsHash(ipfsHash)) {
        throw new Error(`Invalid IPFS hash: ${ipfsHash}`);
    }
    const parts = [prefix];
    if (includeHash) {
        const hashPrefix = ipfsHash.slice(0, 8);
        parts.push(hashPrefix);
    }
    let filename = ipfsHash;
    if (extension) {
        filename += `.${extension}`;
    }
    parts.push(filename);
    return parts.join('/');
}
/**
 * ✅ FIXED: Create default storage configuration with existing client support
 */
export function createDefaultStorageConfig(supabaseUrl, supabaseKey, bucketName = 'evermark-images', existingClient // ✅ FIXED: Added optional client parameter
) {
    // Validate required parameters
    if (!supabaseUrl || typeof supabaseUrl !== 'string') {
        throw new Error('Invalid supabaseUrl: must be a non-empty string');
    }
    if (!supabaseKey || typeof supabaseKey !== 'string') {
        throw new Error('Invalid supabaseKey: must be a non-empty string');
    }
    if (!bucketName || typeof bucketName !== 'string') {
        throw new Error('Invalid bucketName: must be a non-empty string');
    }
    const config = {
        supabase: {
            url: supabaseUrl,
            anonKey: supabaseKey,
            bucketName,
        },
        ipfs: {
            gateway: 'https://gateway.pinata.cloud/ipfs',
            fallbackGateways: [
                'https://ipfs.io/ipfs',
                'https://cloudflare-ipfs.com/ipfs',
                'https://gateway.ipfs.io/ipfs'
            ],
            timeout: 10000
        },
        upload: {
            maxFileSize: 10 * 1024 * 1024, // 10MB
            allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            generateThumbnails: true,
            thumbnailSize: { width: 400, height: 400 }
        }
    };
    // ✅ FIXED: Include existing client if provided
    if (existingClient) {
        config.supabase.client = existingClient;
        console.log('✅ createDefaultStorageConfig: Using existing Supabase client');
    }
    else {
        console.warn('⚠️ createDefaultStorageConfig: No existing client provided, will create new one');
    }
    return config;
}
/**
 * ✅ ENHANCED: Validate storage configuration with deprecation warnings
 */
export function validateStorageConfig(config) {
    const errors = [];
    const warnings = [];
    if (!config.supabase) {
        errors.push('Supabase configuration is required');
    }
    else {
        if (!config.supabase.url || !isValidUrl(config.supabase.url)) {
            errors.push('Valid Supabase URL is required');
        }
        if (!config.supabase.anonKey || config.supabase.anonKey.length < 10) {
            errors.push('Valid Supabase anonymous key is required');
        }
        // ✅ ENHANCED: Handle bucket deprecation
        if (!config.supabase.bucketName) {
            if (config.bucket) {
                warnings.push('`bucket` field is deprecated, use `supabase.bucketName` instead');
                // Auto-migrate deprecated bucket to new field
                config.supabase.bucketName = config.bucket;
            }
            else {
                warnings.push('No bucket name specified, using default: evermark-images');
                config.supabase.bucketName = 'evermark-images';
            }
        }
        // Warn about deprecated bucket field
        if (config.bucket && config.supabase.bucketName && config.bucket !== config.supabase.bucketName) {
            warnings.push('Conflicting bucket names: `bucket` field will be ignored in favor of `supabase.bucketName`');
        }
    }
    if (!config.ipfs) {
        errors.push('IPFS configuration is required');
    }
    else {
        if (!config.ipfs.gateway || !isValidUrl(config.ipfs.gateway)) {
            errors.push('Valid IPFS gateway URL is required');
        }
    }
    // Validate upload config if present (make it optional)
    if (config.upload) {
        if (config.upload.maxFileSize && config.upload.maxFileSize <= 0) {
            errors.push('Upload max file size must be positive');
        }
        if (config.upload.allowedFormats && !Array.isArray(config.upload.allowedFormats)) {
            errors.push('Upload allowed formats must be an array');
        }
        if (config.upload.thumbnailSize) {
            if (typeof config.upload.thumbnailSize.width !== 'number' || config.upload.thumbnailSize.width <= 0) {
                errors.push('Thumbnail width must be a positive number');
            }
            if (typeof config.upload.thumbnailSize.height !== 'number' || config.upload.thumbnailSize.height <= 0) {
                errors.push('Thumbnail height must be a positive number');
            }
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
/**
 * ✅ ENHANCED: Migrate deprecated bucket configuration
 */
export function migrateStorageConfig(config) {
    const migratedConfig = { ...config };
    // Handle bucket deprecation migration
    if (config.bucket && !config.supabase.bucketName) {
        console.warn('⚠️ Migrating deprecated `bucket` field to `supabase.bucketName`');
        migratedConfig.supabase = {
            ...config.supabase,
            bucketName: config.bucket
        };
    }
    // Remove deprecated bucket field
    if (migratedConfig.bucket) {
        console.warn('⚠️ Removing deprecated `bucket` field (use `supabase.bucketName` instead)');
        delete migratedConfig.bucket;
    }
    return migratedConfig;
}
/**
 * Extract file extension from URL or filename
 */
export function extractFileExtension(urlOrFilename) {
    try {
        let pathname;
        try {
            pathname = new URL(urlOrFilename).pathname;
        }
        catch {
            pathname = urlOrFilename;
        }
        const parts = pathname.split('.');
        if (parts.length > 1) {
            return parts[parts.length - 1]?.toLowerCase() || null;
        }
        return null;
    }
    catch {
        return null;
    }
}
/**
 * Check if file is an image based on MIME type or extension
 */
export function isImageFile(file) {
    if (typeof file === 'string') {
        const extension = file.split('.').pop()?.toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '');
    }
    return file.type.startsWith('image/');
}
/**
 * ✅ NEW: Get bucket name from config (handles deprecation)
 */
export function getBucketName(config) {
    // Priority: supabase.bucketName > deprecated bucket > default
    if (config.supabase.bucketName) {
        return config.supabase.bucketName;
    }
    if (config.bucket) {
        console.warn('⚠️ Using deprecated `bucket` field, consider migrating to `supabase.bucketName`');
        return config.bucket;
    }
    console.warn('⚠️ No bucket name found, using default: evermark-images');
    return 'evermark-images';
}
/**
 * ✅ NEW: Check if config has existing client
 */
export function hasExistingClient(config) {
    return !!(config.supabase?.client);
}
/**
 * ✅ NEW: Create config with client validation
 */
export function createStorageConfigWithClient(supabaseUrl, supabaseKey, bucketName, client) {
    if (!client) {
        throw new Error('Client is required but not provided');
    }
    const config = createDefaultStorageConfig(supabaseUrl, supabaseKey, bucketName, client);
    // Validate that client was properly set
    if (!hasExistingClient(config)) {
        throw new Error('Failed to set existing client in configuration');
    }
    return config;
}
//# sourceMappingURL=storage-utils.js.map