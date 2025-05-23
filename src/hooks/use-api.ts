
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface ApiHookOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  retryCount?: number;
  retryDelay?: number;
  initialData?: T | null;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: ApiHookOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(options.enabled !== false);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState<number>(0);
  const { toast } = useToast();

  const {
    onSuccess,
    onError,
    enabled = true,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const fetchData = useCallback(async (manualRetry: boolean = false) => {
    if (manualRetry) {
      setRetries(0);
    }
    
    if (!enabled) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔄 Fetching data, attempt ${retries + 1}/${retryCount}`);
      const result = await fetchFn();
      
      // Validate result to ensure it's not null or undefined
      if (result === null || result === undefined) {
        throw new Error("Received empty response from server");
      }
      
      setData(result);
      setRetries(0); // Reset retries on success
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('API Error:', error);
      
      if (retries < retryCount) {
        console.log(`⚠️ Retry ${retries + 1}/${retryCount} in ${retryDelay}ms`);
        setRetries(prev => prev + 1);
        setTimeout(() => fetchData(), retryDelay);
        return;
      }

      setError(error);
      onError?.(error);
      
      // Only show toast on final retry failure
      if (retries >= retryCount - 1) {
        toast({
          title: "Connection Error",
          description: "Unable to load data. Please check your connection.",
          variant: "destructive"
        });
      }
    } finally {
      if (retries >= retryCount) {
        setIsLoading(false);
      }
    }
  }, [enabled, fetchFn, onError, onSuccess, retries, retryCount, retryDelay, toast]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
    
    return () => {
      // Cleanup function in case component unmounts during fetch
      setIsLoading(false);
    };
  }, [enabled, fetchData]);

  return { 
    data, 
    isLoading, 
    error, 
    refetch, 
    isError: error !== null 
  };
}
