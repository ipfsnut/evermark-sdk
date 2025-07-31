import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Complete upload component with drag & drop
 */
import React, { useCallback, useState, useEffect } from 'react';
import { useImageUpload } from '../hooks/useImageUpload.js';
export const ImageUpload = ({ storageConfig, onUploadComplete, onUploadError, className = '', generateThumbnails = true, allowedTypes, maxFileSize }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    // Handle strict TypeScript mode - only pass defined values
    const uploadOptions = {
        storageConfig,
        generateThumbnails
    };
    // Only add optional properties if they have values
    if (allowedTypes) {
        Object.assign(uploadOptions, { allowedTypes });
    }
    if (maxFileSize) {
        Object.assign(uploadOptions, { maxFileSize });
    }
    const { status, progress, result, error, upload } = useImageUpload(uploadOptions);
    // Handle completion
    useEffect(() => {
        if (status === 'complete' && result && result.originalUrl) {
            onUploadComplete?.(result);
        }
    }, [status, result, onUploadComplete]);
    // Handle errors
    useEffect(() => {
        if (status === 'failed' && error) {
            onUploadError?.(error);
        }
    }, [status, error, onUploadError]);
    const handleFile = useCallback(async (file) => {
        await upload(file);
    }, [upload]);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0 && files[0]) {
            handleFile(files[0]);
        }
    }, [handleFile]);
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);
    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);
    const handleFileSelect = useCallback((e) => {
        const files = e.target.files;
        if (files && files.length > 0 && files[0]) {
            handleFile(files[0]);
        }
    }, [handleFile]);
    const isUploading = status === 'uploading';
    return (_jsx("div", { className: className, children: _jsxs("div", { className: `
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer'}
        `, onDrop: handleDrop, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onClick: () => !isUploading && document.getElementById('file-input')?.click(), children: [_jsx("input", { id: "file-input", type: "file", accept: "image/*", onChange: handleFileSelect, className: "hidden", disabled: isUploading }), isUploading ? (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" }), progress && (_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-blue-500 h-2 rounded-full transition-all duration-300", style: { width: `${progress.percentage}%` } }) }), _jsx("p", { className: "text-sm text-gray-600", children: progress.message }), _jsxs("p", { className: "text-xs text-gray-500", children: [progress.percentage.toFixed(0), "% complete"] })] }))] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "mx-auto w-12 h-12 text-gray-400", children: _jsx("svg", { fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z", clipRule: "evenodd" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "text-lg font-medium text-gray-900", children: "Upload an image" }), _jsx("p", { className: "text-sm text-gray-500", children: "Drag and drop or click to select" }), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Max ", Math.round((maxFileSize || 10485760) / 1024 / 1024), "MB \u2022 ", allowedTypes?.join(', ') || 'Images only'] })] })] })), status === 'failed' && error && (_jsx("div", { className: "mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm", children: error })), status === 'complete' && result && (_jsx("div", { className: "mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm", children: "\u2705 Upload successful!" }))] }) }));
};
//# sourceMappingURL=ImageUpload.js.map