import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { forwardRef } from 'react';
import { useImageLoader } from '../hooks/useImageLoader.js';
/**
 * Image component with intelligent loading and fallbacks
 */
export const ImageDisplay = forwardRef(({ sources, alt, resolution, loaderOptions, loadingPlaceholder, errorPlaceholder, onLoad, onError, showDebugInfo = false, className = '', ...imgProps }, ref) => {
    const loaderConfig = {
        autoLoad: true,
        ...(resolution && { resolution }),
        ...(loaderOptions && loaderOptions)
    };
    const { imageUrl, isLoading, hasError, error, fromCache, loadTime, retry, attempts } = useImageLoader(sources, loaderConfig);
    // Handle load success
    React.useEffect(() => {
        if (imageUrl && onLoad) {
            onLoad(imageUrl, fromCache);
        }
    }, [imageUrl, fromCache, onLoad]);
    // Handle load error
    React.useEffect(() => {
        if (hasError && error && onError) {
            onError(error);
        }
    }, [hasError, error, onError]);
    // Loading state
    if (isLoading) {
        return (_jsx("div", { className: `evermark-image-loading ${className}`, children: loadingPlaceholder || (_jsx("div", { className: "flex items-center justify-center bg-gray-200 animate-pulse", children: _jsx("svg", { className: "w-6 h-6 text-gray-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z", clipRule: "evenodd" }) }) })) }));
    }
    // Error state
    if (hasError) {
        return (_jsx("div", { className: `evermark-image-error ${className}`, children: errorPlaceholder || (_jsxs("div", { className: "flex flex-col items-center justify-center bg-gray-100 p-4 text-center", children: [_jsx("svg", { className: "w-6 h-6 text-red-400 mb-2", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z", clipRule: "evenodd" }) }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: "Failed to load image" }), _jsx("button", { onClick: retry, className: "text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600", children: "Retry" }), showDebugInfo && (_jsxs("details", { className: "mt-2 text-xs text-gray-500", children: [_jsx("summary", { children: "Debug Info" }), _jsxs("div", { className: "mt-1", children: [_jsxs("p", { children: ["Error: ", error] }), _jsxs("p", { children: ["Attempts: ", attempts.length] }), attempts.map((attempt, index) => (_jsxs("p", { children: [index + 1, ". ", attempt.url, " - ", attempt.success ? 'Success' : `Failed: ${attempt.error}`] }, index)))] })] }))] })) }));
    }
    // Success state
    if (imageUrl) {
        return (_jsxs("div", { className: "evermark-image-container relative", children: [_jsx("img", { ref: ref, src: imageUrl, alt: alt, className: className, ...imgProps }), showDebugInfo && (_jsxs("div", { className: "absolute top-0 left-0 bg-black bg-opacity-75 text-white text-xs p-2 rounded", children: [_jsxs("p", { children: ["\u2705 Loaded ", fromCache ? 'from cache' : 'from network'] }), loadTime && _jsxs("p", { children: ["Time: ", loadTime, "ms"] }), _jsxs("p", { children: ["Source: ", imageUrl.includes('supabase') ? 'Supabase' : imageUrl.includes('ipfs') ? 'IPFS' : 'Other'] })] }))] }));
    }
    return null;
});
ImageDisplay.displayName = 'ImageDisplay';
//# sourceMappingURL=ImageDisplay.js.map