import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const supabase = createClient();

interface DashboardMetrics {
  totalRevenue: number;
  totalBookings: number;
  totalCustomers: number;
  averageBookingValue: number;
  revenueByPackage: {
    packageName: string;
    revenue: number;
  }[];
  recentBookings: any[];
  topCustomers: any[];
}

export function useAdminDashboard(period: 'day' | 'week' | 'month' = 'day') {
  const queryClient = useQueryClient();

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case 'day':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      default:
        return { start: startOfDay(now), end: endOfDay(now) };
    }
  };

  return useQuery({
    queryKey: ['adminDashboard', period],
    queryFn: async (): Promise<DashboardMetrics> => {
      const { start, end } = getDateRange();

      // Get total revenue and bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          package:packages(name),
          user:users(*)
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (bookingsError) throw bookingsError;

      // Calculate metrics
      const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;
      const totalBookings = bookings?.length || 0;
      const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      // Get revenue by package
      const revenueByPackage = bookings?.reduce((acc: any[], booking) => {
        const packageName = booking.package?.name || 'Unknown';
        const existingPackage = acc.find(p => p.packageName === packageName);
        if (existingPackage) {
          existingPackage.revenue += booking.total_price;
        } else {
          acc.push({ packageName, revenue: booking.total_price });
        }
        return acc;
      }, []) || [];

      // Get unique customers
      const uniqueCustomers = new Set(bookings?.map(booking => booking.user_id));
      const totalCustomers = uniqueCustomers.size;

      // Get recent bookings
      const recentBookings = bookings?.slice(0, 5) || [];

      // Get top customers
      const topCustomers = Array.from(uniqueCustomers).slice(0, 5).map(customerId => {
        const customerBookings = bookings?.filter(booking => booking.user_id === customerId) || [];
        const totalSpent = customerBookings.reduce((sum, booking) => sum + booking.total_price, 0);
        return {
          customer: customerBookings[0]?.user,
          totalSpent,
          bookingsCount: customerBookings.length
        };
      });

      return {
        totalRevenue,
        totalBookings,
        totalCustomers,
        averageBookingValue,
        revenueByPackage,
        recentBookings,
        topCustomers
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}