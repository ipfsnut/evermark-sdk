/**
 * Core types for the Evermark SDK image handling system
 * These types are designed to be framework-agnostic and pure
 */
/**
 * Error types specific to image loading
 */
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
//# sourceMappingURL=types.js.map