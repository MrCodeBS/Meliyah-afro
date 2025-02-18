import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { format, subDays } from 'date-fns';

interface RevenueData {
  date: string;
  revenue: number;
}

export function useRevenueTimeline(
  period: 'day' | 'week' | 'month',
  startDate: string,
  endDate: string
) {
  return useQuery({
    queryKey: ['revenue', period, startDate, endDate],
    queryFn: async () => {
      // In a real application, this would fetch from your API
      // For now, we'll generate mock data
      const days = Math.ceil(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / 
        (1000 * 60 * 60 * 24)
      );

      return Array.from({ length: days }, (_, i) => ({
        date: format(subDays(new Date(endDate), i), 'yyyy-MM-dd'),
        revenue: Math.floor(Math.random() * 1000) + 500
      })).reverse() as RevenueData[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}