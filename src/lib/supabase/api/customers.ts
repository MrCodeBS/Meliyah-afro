import { supabase } from '../config';
import { handleError } from '../utils/error';
import { memoize } from '../utils/cache';

export const customersApi = {
  getAll: memoize(async (options = { limit: 20, offset: 0 }) => {
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select(`
          *,
          bookings:bookings(
            id,
            date,
            total_price,
            package:packages(name)
          )
        `, { count: 'exact' })
        .eq('role', 'CUSTOMER')
        .range(options.offset, options.offset + options.limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleError(error, 'Failed to fetch customers');
      throw error;
    }
  }),

  getCustomerStats: memoize(async (customerId: string) => {
    try {
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          total_price,
          created_at,
          package:packages(name)
        `)
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        totalSpent: bookings?.reduce((sum, b) => sum + b.total_price, 0) || 0,
        bookingsCount: bookings?.length || 0,
        lastBooking: bookings?.[0]?.created_at || null,
        favoritePackage: bookings?.reduce((acc, booking) => {
          const pkgName = booking.package?.name;
          if (!pkgName) return acc;
          acc[pkgName] = (acc[pkgName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      handleError(error, 'Failed to fetch customer statistics');
      throw error;
    }
  })
};