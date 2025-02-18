import { supabase } from '../config';
import { logger } from '@/lib/logger';
import { sendBookingConfirmation } from '@/lib/email/resend';
import { Booking } from '@/types';

export const bookingsApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(name, email, phone),
          package:packages(name, price)
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to fetch bookings:', error);
      throw error;
    }
  },

  async create(booking: Omit<Booking, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select(`
          id,
          date,
          time,
          total_price,
          status,
          user:users!inner(name, email),
          package:packages!inner(name)
        `)
        .single();

      if (error) throw error;

      // Send confirmation email
      const emailResult = await sendBookingConfirmation({
        bookingId: data.id,
        customerName: data.user.name,
        customerEmail: data.user.email,
        packageName: data.package.name,
        date: new Date(data.date),
        time: data.time,
        price: data.total_price
      });

      return {
        success: true,
        data,
        emailSent: emailResult.success
      };
    } catch (error) {
      logger.error('Failed to create booking:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Booking>) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to update booking:', error);
      throw error;
    }
  }
};