/**
 * Core types for the Evermark SDK
 * Consolidated from multiple files with proper Supabase integration
 */
// =================
// ERROR TYPES
// =================
export class ImageLoadingError extends Error {
    code;
    source;
    constructor(message, code, source) {
        super(message);
        this.code = code;
        this.source = source;
        this.name = 'ImageLoadingError';
    }
}
export class StorageError extends Error {
    code;
    provider;
    constructor(message, code, provider = 'unknown') {
        super(message);
        this.code = code;
        this.provider = provider;
        this.name = 'StorageError';
    }
}
//# sourceMappingURL=types.js.map