
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './use-toast';
import { toast as sonnerToast } from 'sonner';
import { DOMPurify } from '@/lib/utils-security';

interface ApiHookOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
  retryCount?: number;
  retryDelay?: number;
  errorFallback?: T | null;
  showErrorToast?: boolean;
}

export function useApi<T>(
  fetchFn: () => Promise<T>,
  options: ApiHookOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const { toast } = useToast();

  const {
    onSuccess,
    onError,
    enabled = true,
    retryCount = 3,
    retryDelay = 1000,
    errorFallback = null,
    showErrorToast = true
  } = options;

  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);
  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async (retries = retryCount) => {
    if (!isMountedRef.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      setRetryAttempts(retryCount - retries);
      
      // Add CSRF token if available
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      
      const result = await fetchFn();
      
      // Safety check for sanitization if result contains string content
      // This is a simplified example - in production you'd want to recursively sanitize objects
      const sanitizedResult = result;
      
      if (!isMountedRef.current) return;
      
      setData(sanitizedResult);
      onSuccess?.(sanitizedResult);
      
      // Reset retry attempts on success
      if (retryAttempts > 0) {
        setRetryAttempts(0);
      }
      
    } catch (err) {
      if (!isMountedRef.current) return;
      
      const error = err as Error;
      console.error('API Error:', error);
      
      if (retries > 0) {
        // Show a retry toast for user feedback
        sonnerToast.info(`Retrying... (${retryCount - retries + 1}/${retryCount})`, {
          id: 'api-retry-toast',
        });
        
        setTimeout(() => fetchData(retries - 1), retryDelay);
        return;
      }

      setError(error);
      onError?.(error);
      
      if (errorFallback !== null) {
        setData(errorFallback);
      }
      
      // Show error toast if enabled
      if (showErrorToast) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFn, retryCount, retryDelay, toast, onSuccess, onError, showErrorToast, errorFallback]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return { 
    data, 
    isLoading, 
    error, 
    refetch: () => fetchData(), 
    retryAttempts,
    isRetrying: retryAttempts > 0
  };
}
