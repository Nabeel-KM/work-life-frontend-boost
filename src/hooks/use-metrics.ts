
import { useState, useCallback } from 'react';
import { useApi } from './use-api';
import { api, SystemMetrics, UserMetrics } from '@/lib/api';

export function useSystemMetrics() {
  const fetchSystemMetrics = useCallback(() => {
    return api.fetchSystemMetrics();
  }, []);

  return useApi<SystemMetrics>(fetchSystemMetrics);
}

export function useUserMetrics(username: string, startDate?: string, endDate?: string) {
  const [isEnabled, setIsEnabled] = useState(false);

  const fetchUserMetrics = useCallback(() => {
    return api.fetchUserMetrics(username, startDate, endDate);
  }, [username, startDate, endDate]);

  const result = useApi<UserMetrics>(fetchUserMetrics, { 
    enabled: isEnabled && !!username 
  });

  const fetchMetrics = useCallback(() => {
    setIsEnabled(true);
    result.refetch();
  }, [result]);

  return {
    ...result,
    fetchMetrics,
    isEnabled
  };
}
