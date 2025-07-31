import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Enhanced EvermarkImage component with storage flow integration
 * This replaces your existing EvermarkImage.tsx file
 */
import React, { useState, useEffect } from 'react';
import { ImageDisplay } from './ImageDisplay.js';
import { ImageTransferStatus } from './ImageTransferStatus.js';
/**
 * Enhanced EvermarkImage component using the SDK with storage integration
 * Backward compatible - works with or without storageConfig
 */
export const EvermarkImage = ({ evermark, storageConfig, variant = 'standard', showPlaceholder = true, enableAutoTransfer = true, showTransferStatus = true, className = '', onImageLoad, onImageError, onTransferComplete }) => {
    const [currentSupabaseUrl, setCurrentSupabaseUrl] = useState(evermark.supabaseImageUrl);
    const [transferInProgress, setTransferInProgress] = useState(false);
    // Convert evermark data to ImageSourceInput - handle strict TypeScript mode
    const sources = {};
    // Only add properties if they have values (strict mode compliance)
    if (currentSupabaseUrl) {
        sources.supabaseUrl = currentSupabaseUrl;
    }
    if (evermark.thumbnailUrl) {
        sources.thumbnailUrl = evermark.thumbnailUrl;
    }
    if (evermark.processed_image_url) {
        sources.processedUrl = evermark.processed_image_url;
    }
    if (evermark.ipfsHash) {
        sources.ipfsHash = evermark.ipfsHash;
    }
    // Set preferThumbnail flag
    sources.preferThumbnail = variant === 'compact' || variant === 'list';
    // Only show transfer if storage config is provided and conditions are met
    const shouldShowTransfer = storageConfig &&
        enableAutoTransfer &&
        showTransferStatus &&
        !currentSupabaseUrl &&
        evermark.ipfsHash &&
        !transferInProgress;
    const handleTransferComplete = (result) => {
        setCurrentSupabaseUrl(result.supabaseUrl);
        setTransferInProgress(false);
        onTransferComplete?.(result);
    };
    // Variant-specific styles
    const getVariantStyles = () => {
        const baseStyles = 'relative overflow-hidden bg-gray-800 border border-gray-700 rounded-lg';
        switch (variant) {
            case 'hero':
                return `${baseStyles} h-64 sm:h-80`;
            case 'compact':
                return `${baseStyles} h-32 sm:h-40`;
            case 'list':
                return `${baseStyles} w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0`;
            default:
                return `${baseStyles} h-48 sm:h-56`;
        }
    };
    // Content type styling
    const getContentTypeStyle = (contentType) => {
        const styles = {
            'Cast': { gradient: 'from-purple-500 to-pink-500', icon: '💬' },
            'DOI': { gradient: 'from-blue-500 to-cyan-500', icon: '📄' },
            'ISBN': { gradient: 'from-green-500 to-teal-500', icon: '📚' },
            'URL': { gradient: 'from-orange-500 to-red-500', icon: '🌐' },
            'Custom': { gradient: 'from-gray-500 to-gray-700', icon: '✨' }
        };
        return styles[contentType] || styles.Custom;
    };
    const contentStyle = getContentTypeStyle(evermark.contentType);
    // Placeholder component
    const placeholder = showPlaceholder ? (_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${contentStyle.gradient} flex flex-col items-center justify-center`, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-4xl mb-2", children: contentStyle.icon }), _jsxs("div", { className: "text-white/80 text-sm font-medium", children: ["#", evermark.tokenId] }), variant !== 'compact' && variant !== 'list' && (_jsx("div", { className: "text-white/60 text-xs mt-1 px-2 max-w-[120px] truncate", children: evermark.title }))] }) })) : undefined;
    // Error placeholder with retry
    const errorPlaceholder = (_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${contentStyle.gradient} flex flex-col items-center justify-center`, children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl mb-2", children: "\u26A0\uFE0F" }), _jsxs("div", { className: "text-white/80 text-xs font-medium", children: ["#", evermark.tokenId] }), _jsx("div", { className: "text-white/60 text-xs mt-1", children: "Click to retry" })] }) }));
    // Resolution config
    const resolutionConfig = {
        preferThumbnail: variant === 'compact' || variant === 'list',
        maxSources: 3
    };
    // Loader options
    const loaderOptions = {
        debug: false,
        timeout: variant === 'list' ? 5000 : 8000
    };
    // Handle transfer status props - strict mode compliance
    const transferStatusProps = {
        ipfsHash: evermark.ipfsHash,
        storageConfig: storageConfig,
        onTransferComplete: handleTransferComplete,
        autoStart: enableAutoTransfer
    };
    // Only add onTransferError if defined
    if (onImageError) {
        transferStatusProps.onTransferError = onImageError;
    }
    return (_jsxs("div", { className: `${getVariantStyles()} ${className} group cursor-pointer hover:scale-105 transition-transform`, children: [_jsx(ImageDisplay, { sources: sources, alt: evermark.title, className: "w-full h-full object-cover", loadingPlaceholder: placeholder, errorPlaceholder: errorPlaceholder, onLoad: onImageLoad ? ((url, fromCache) => { onImageLoad(); }) : undefined, onError: onImageError, resolution: resolutionConfig, loaderOptions: loaderOptions }), shouldShowTransfer && evermark.ipfsHash && storageConfig && (_jsx("div", { className: "absolute top-2 left-2 bg-black/80 text-white text-xs p-2 rounded backdrop-blur-sm", children: _jsx(ImageTransferStatus, { ...transferStatusProps }) })), evermark.imageStatus === 'processing' && (_jsx("div", { className: "absolute bottom-2 left-2 bg-black/80 text-xs px-2 py-1 rounded backdrop-blur-sm", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-blue-400 rounded-full animate-pulse" }), _jsx("span", { className: "text-blue-400", children: "Processing" })] }) })), transferInProgress && (_jsx("div", { className: "absolute top-2 right-2 bg-blue-500/90 text-white text-xs px-2 py-1 rounded backdrop-blur-sm", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "w-2 h-2 bg-white rounded-full animate-pulse" }), _jsx("span", { children: "Transferring" })] }) })), _jsxs("div", { className: "absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono backdrop-blur-sm", children: ["#", evermark.tokenId] })] }));
};
//# sourceMappingURL=EvermarkImage.js.map