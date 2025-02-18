import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T;
  deps?: any[];
  fallbackData?: T;
  retryCount?: number;
  retryDelay?: number;
}

interface UseApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiState<T> & { refetch: () => Promise<void> } {
  const {
    initialData,
    fallbackData,
    retryCount = 3,
    retryDelay = 1000,
    deps = []
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: initialData || null,
    error: null,
    isLoading: true,
    isError: false,
  });

  const fetchData = async (retries = retryCount) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await apiCall();
      setState({ data, error: null, isLoading: false, isError: false });
      options.onSuccess?.(data);
    } catch (error) {
      console.error('API Error:', error);
      
      if (retries > 0) {
        setTimeout(() => fetchData(retries - 1), retryDelay);
        return;
      }

      setState({
        data: fallbackData || null,
        error,
        isLoading: false,
        isError: true,
      });
      options.onError?.(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, deps);

  return {
    ...state,
    refetch: () => fetchData(),
  };
}

// Mock data for development
const mockData = {
  services: [
    {
      id: 'cut-style',
      name: 'Haarschnitt & Styling',
      description: 'Professioneller Haarschnitt mit Styling',
      duration: 60,
      price: 80,
      category: 'hair',
    },
    // ... other services
  ],
  packages: [
    {
      id: 'platinum',
      name: 'Paket Platinum',
      description: 'Das ultimative Verwöhnprogramm',
      services: ['cut-style', 'color', 'treatment'],
      price: 260,
      discountPercentage: 15,
    },
    // ... other packages
  ],
  revenue: {
    daily: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      revenue: Math.floor(Math.random() * 1000) + 500,
    })),
  },
};

// Typed hooks with fallback data
export function useServices() {
  return useApi(() => api.getServices(), {
    fallbackData: mockData.services,
    retryCount: 3,
  });
}

export function usePackages() {
  return useApi(() => api.getPackages(), {
    fallbackData: mockData.packages,
    retryCount: 3,
  });
}

export function useRevenueTimeline(
  period: 'day' | 'week' | 'month',
  startDate: string,
  endDate: string
) {
  return useApi(
    () => api.getRevenueTimeline(period, startDate, endDate),
    {
      fallbackData: mockData.revenue.daily,
      retryCount: 3,
      deps: [period, startDate, endDate],
    }
  );
}