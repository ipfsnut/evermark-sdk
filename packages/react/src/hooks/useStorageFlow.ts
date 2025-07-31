/**
 * Main hook implementing your 3-step storage flow
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { StorageOrchestrator } from '@evermark-sdk/storage';
import type { 
  ImageSourceInput, 
  StorageConfig, 
  StorageFlowResult, 
  UploadProgress 
} from '@evermark-sdk/core';

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

export function useStorageFlow(options: UseStorageFlowOptions): UseStorageFlowResult {
  const { storageConfig, autoStart = false, debug = false } = options;

  const [status, setStatus] = useState<UseStorageFlowResult['status']>('idle');
  const [result, setResult] = useState<StorageFlowResult | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<ImageSourceInput | null>(null);

  const orchestratorRef = useRef<StorageOrchestrator | null>(null);

  // Initialize orchestrator
  useEffect(() => {
    orchestratorRef.current = new StorageOrchestrator(storageConfig);
  }, [storageConfig]);

  const startFlow = useCallback(async (input: ImageSourceInput) => {
    if (!orchestratorRef.current) return;

    try {
      setStatus('checking');
      setError(null);
      setProgress(null);
      setResult(null);
      setLastInput(input);

      if (debug) console.log('[StorageFlow] Starting flow with input:', input);

      const flowResult = await orchestratorRef.current.ensureImageInSupabase(
        input,
        (progressUpdate) => {
          setProgress(progressUpdate);
          if (progressUpdate.phase === 'uploading') {
            setStatus('transferring');
          }
        }
      );

      setResult(flowResult);
      setStatus('complete');
      setProgress({ phase: 'complete', percentage: 100, message: 'Flow complete' });

      if (debug) console.log('[StorageFlow] Flow completed:', flowResult);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Storage flow failed';
      setError(errorMessage);
      setStatus('failed');
      setProgress(null);

      if (debug) console.error('[StorageFlow] Flow failed:', err);
    }
  }, [debug]);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setProgress(null);
    setError(null);
    setLastInput(null);
  }, []);

  const retry = useCallback(async () => {
    if (lastInput) await startFlow(lastInput);
  }, [lastInput, startFlow]);

  return {
    status,
    result,
    progress,
    error,
    isProcessing: status === 'checking' || status === 'transferring',
    startFlow,
    reset,
    retry
  };
}