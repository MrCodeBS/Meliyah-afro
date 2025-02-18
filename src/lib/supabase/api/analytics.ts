import { supabase } from '../config';
import { handleError } from '../utils/error';
import { getDateRangeForPeriod } from '../utils/date';
import { memoize } from '../utils/cache';

export const analyticsApi = {
  getDashboardMetrics: memoize(async (period: 'day' | 'week' | 'month' = 'day') => {
    try {
      const { startDate, endDate } = getDateRangeForPeriod(period);

      const [bookingsResult, customersResult] = await Promise.all([
        supabase
          .from('bookings')
          .select(`
            total_price,
            status,
            package:packages(name)
          `)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        supabase
          .from('users')
          .select('count', { count: 'exact' })
          .eq('role', 'CUSTOMER')
      ]);

      if (bookingsResult.error) throw bookingsResult.error;
      if (customersResult.error) throw customersResult.error;

      const bookings = bookingsResult.data || [];
      
      const metrics = bookings.reduce((acc, booking) => {
        if (booking.status !== 'CANCELLED') {
          acc.totalRevenue += booking.total_price;
          acc.packageRevenue[booking.package?.name || 'Unknown'] = 
            (acc.packageRevenue[booking.package?.name || 'Unknown'] || 0) + booking.total_price;
        }
        return acc;
      }, {
        totalRevenue: 0,
        packageRevenue: {} as Record<string, number>
      });

      return {
        totalRevenue: metrics.totalRevenue,
        totalBookings: bookings.filter(b => b.status !== 'CANCELLED').length,
        totalCustomers: customersResult.count || 0,
        averageBookingValue: bookings.length ? metrics.totalRevenue / bookings.length : 0,
        revenueByPackage: Object.entries(metrics.packageRevenue)
          .map(([name, revenue]) => ({
            packageName: name,
            revenue
          }))
          .sort((a, b) => b.revenue - a.revenue)
      };
    } catch (error) {
      handleError(error, 'Failed to fetch dashboard metrics');
      throw error;
    }
  })
};