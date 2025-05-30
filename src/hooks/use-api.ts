import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';

interface ApiHookOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  initialData?: T | null;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: ApiHookOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [isLoading, setIsLoading] = useState<boolean>(options.enabled !== false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const fetchFnRef = useRef(fetchFn);
  const mountedRef = useRef(true);

  const {
    onSuccess,
    onError,
    enabled = true
  } = options;

  // Update the ref when fetchFn changes
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const fetchData = useCallback(async () => {
    if (!enabled || !mountedRef.current) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching data');
      const result = await fetchFnRef.current();
      
      if (!mountedRef.current) return;
      
      // Validate result to ensure it's not null or undefined
      if (result === null || result === undefined) {
        throw new Error("Received empty response from server");
      }
      
      setData(result);
      onSuccess?.(result);
      setIsLoading(false);
    } catch (err) {
      if (!mountedRef.current) return;
      
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('API Error:', error);
      
      setError(error);
      setIsLoading(false);
      onError?.(error);
      
      toast({
        title: "Connection Error",
        description: "Unable to load data. Please check your connection and try refreshing manually.",
        variant: "destructive"
      });
    }
  }, [enabled, onError, onSuccess, toast]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;

    if (enabled) {
      fetchData();
    } else {
      setIsLoading(false);
    }

    return () => {
      mountedRef.current = false;
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
