import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Shows transfer progress and status
 * MINIMAL CHANGES: Fixed import paths only
 */
import React, { useEffect } from 'react';
import { useStorageFlow } from '../hooks/useStorageFlow.js';
export const ImageTransferStatus = ({ ipfsHash, storageConfig, onTransferComplete, onTransferError, autoStart = true, showRetryButton = true }) => {
    const { status, result, progress, error, startFlow, retry } = useStorageFlow({
        storageConfig,
        autoStart: false
    });
    // Auto-start effect
    useEffect(() => {
        if (autoStart && ipfsHash && status === 'idle') {
            startFlow({ ipfsHash });
        }
    }, [autoStart, ipfsHash, status, startFlow]);
    // Handle completion
    useEffect(() => {
        if (result?.transferPerformed && result.transferResult?.supabaseUrl) {
            onTransferComplete?.({ supabaseUrl: result.transferResult.supabaseUrl });
        }
    }, [result, onTransferComplete]);
    // Handle errors
    useEffect(() => {
        if (error) {
            onTransferError?.(error);
        }
    }, [error, onTransferError]);
    if (status === 'idle') {
        return (_jsx("button", { onClick: () => startFlow({ ipfsHash }), className: "px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors", children: "Start Transfer" }));
    }
    if (status === 'failed') {
        return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "text-red-600 text-sm", children: ["\u274C ", error] }), showRetryButton && (_jsx("button", { onClick: retry, className: "px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors", children: "Retry Transfer" }))] }));
    }
    if (status === 'complete') {
        return (_jsxs("div", { className: "flex items-center space-x-2 text-green-600", children: [_jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }), _jsx("span", { className: "text-sm", children: result?.transferPerformed ? 'Transferred' : 'Already available' })] }));
    }
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" }), _jsx("span", { className: "text-sm text-gray-600", children: status === 'checking' ? 'Checking sources...' : 'Transferring...' })] }), progress && (_jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "w-full bg-gray-200 rounded-full h-1.5", children: _jsx("div", { className: "bg-blue-500 h-1.5 rounded-full transition-all duration-300", style: { width: `${progress.percentage}%` } }) }), _jsx("p", { className: "text-xs text-gray-500", children: progress.message })] }))] }));
};
//# sourceMappingURL=ImageTransferStatus.js.map