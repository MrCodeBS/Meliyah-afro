import { supabase } from './config';
import { toast } from 'sonner';
import { Package, Service, Product, Booking } from '@/types';

export const api = {
  // Bookings
  async getBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(*),
          package:packages(*),
          products(*)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Error loading bookings');
      throw error;
    }
  },

  async createBooking(booking: Omit<Booking, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create booking:', error);
      toast.error('Error creating booking');
      throw error;
    }
  },

  // Packages
  async getPackages() {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          services:package_services(
            service:services(*)
          )
        `);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      toast.error('Error loading packages');
      throw error;
    }
  },

  // Products
  async getProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Error loading products');
      throw error;
    }
  },

  // Analytics
  async getDashboardMetrics(period: 'day' | 'week' | 'month' = 'day') {
    try {
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          package:packages(name, price),
          user:users(name, email)
        `)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (bookingsError) throw bookingsError;

      const { data: customers, error: customersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'CUSTOMER');

      if (customersError) throw customersError;

      return {
        totalRevenue: bookings?.reduce((sum, b) => sum + b.total_price, 0) || 0,
        totalBookings: bookings?.length || 0,
        totalCustomers: customers?.length || 0,
        averageBookingValue: bookings?.length 
          ? (bookings.reduce((sum, b) => sum + b.total_price, 0) / bookings.length)
          : 0,
        recentBookings: bookings?.slice(0, 5) || [],
        revenueByPackage: Object.entries(
          bookings?.reduce((acc, booking) => {
            const packageName = booking.package?.name || 'Unknown';
            acc[packageName] = (acc[packageName] || 0) + booking.total_price;
            return acc;
          }, {} as Record<string, number>) || {}
        ).map(([packageName, revenue]) => ({
          packageName,
          revenue
        }))
      };
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
      toast.error('Error loading dashboard metrics');
      throw error;
    }
  }
};