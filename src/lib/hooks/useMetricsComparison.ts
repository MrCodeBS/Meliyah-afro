import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { startOfDay, subDays, startOfWeek, startOfMonth } from 'date-fns';

interface MetricsComparison {
  current: number;
  previous: number;
  percentageChange: number;
}

export function useMetricsComparison(
  metric: 'bookings' | 'revenue' | 'customers' | 'emailRate',
  period: 'day' | 'week' | 'month'
) {
  return useQuery({
    queryKey: ['metrics', metric, period],
    queryFn: async () => {
      // In a real application, this would fetch from your API
      // For now, we'll use mock data
      const mockData = {
        bookings: { current: 12, previous: 10 },
        revenue: { current: 1250, previous: 1100 },
        customers: { current: 45, previous: 40 },
        emailRate: { current: 68, previous: 65 }
      };

      const data = mockData[metric];
      const percentageChange = data.previous === 0 
        ? 0 
        : ((data.current - data.previous) / data.previous) * 100;

      return {
        current: data.current,
        previous: data.previous,
        percentageChange
      } as MetricsComparison;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}