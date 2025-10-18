import { useState, useCallback } from 'react';
import { useWalletClient } from 'wagmi';
import { IExecService, DarkPoolOrder, IExecResult } from '@/lib/iexec-service';

export function useIExec() {
  const { data: walletClient } = useWalletClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAndExecuteOrder = useCallback(
    async (order: DarkPoolOrder): Promise<IExecResult | null> => {
      if (!walletClient) {
        setError('Wallet not connected');
        return null;
      }

      try {
        setError(null);
        
        const iexecService = new IExecService(walletClient);
        
        setIsSubmitting(true);
        const dealid = await iexecService.submitOrder(order);
        setIsSubmitting(false);
        
        setIsWaiting(true);
        await iexecService.waitForCompletion(dealid);
        setIsWaiting(false);
        
        setIsFetching(true);
        const results = await iexecService.fetchResults(dealid);
        setIsFetching(false);
        
        return results;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setIsSubmitting(false);
        setIsWaiting(false);
        setIsFetching(false);
        return null;
      }
    },
    [walletClient]
  );

  return {
    submitAndExecuteOrder,
    isSubmitting,
    isWaiting,
    isFetching,
    isProcessing: isSubmitting || isWaiting || isFetching,
    error,
  };
}
