/**
 * Main hook implementing your 3-step storage flow
 * MINIMAL CHANGES: Fixed import paths only
 */
import type { ImageSourceInput, StorageConfig, StorageFlowResult, UploadProgress } from '../../core/types.js';
export interface UseStorageFlowOptions {
    storageConfig: StorageConfig;
    autoStart?: boolean;
    debug?: boolean;
}
export interface UseStorageFlowResult {
    status: 'idle' | 'checking' | 'transferring' | 'complete' | 'failed';
    result: StorageFlowResult | null;
    progress: UploadProgress | null;
    error: string | null;
    isProcessing: boolean;
    startFlow: (input: ImageSourceInput) => Promise<void>;
    reset: () => void;
    retry: () => Promise<void>;
}
export declare function useStorageFlow(options: UseStorageFlowOptions): UseStorageFlowResult;
//# sourceMappingURL=useStorageFlow.d.ts.map