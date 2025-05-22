import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface ApiHookOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: ApiHookOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const {
    onSuccess,
    onError,
    enabled = true,
    retryCount = 3,
    retryDelay = 1000
  } = options;

  const fetchData = async (retries = retryCount) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      console.error('API Error:', error);
      
      if (retries > 0) {
        setTimeout(() => fetchData(retries - 1), retryDelay);
        return;
      }

      setError(error);
      onError?.(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return { data, isLoading, error, refetch: () => fetchData() };
}