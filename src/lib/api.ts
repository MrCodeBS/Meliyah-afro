import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Package, Service, Product, Booking } from '@/types';

const supabase = createClient();

export const api = {
  // Services
  async getServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch services:', error);
      toast.error('Error loading services');
      throw error;
    }
  },

  async createService(service: Omit<Service, 'id'>): Promise<Service> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create service:', error);
      toast.error('Error creating service');
      throw error;
    }
  },

  async updateService(id: string, service: Partial<Service>): Promise<Service> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(service)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update service:', error);
      toast.error('Error updating service');
      throw error;
    }
  },

  async deleteService(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete service:', error);
      toast.error('Error deleting service');
      throw error;
    }
  },

  // Packages
  async getPackages(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          services (*)
        `);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      toast.error('Error loading packages');
      throw error;
    }
  },

  async createPackage(pkg: Omit<Package, 'id'>): Promise<Package> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([pkg])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create package:', error);
      toast.error('Error creating package');
      throw error;
    }
  },

  async updatePackage(id: string, pkg: Partial<Package>): Promise<Package> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(pkg)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update package:', error);
      toast.error('Error updating package');
      throw error;
    }
  },

  async deletePackage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete package:', error);
      toast.error('Error deleting package');
      throw error;
    }
  },

  // Products
  async getProducts(): Promise<Product[]> {
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

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error('Error creating product');
      throw error;
    }
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Error updating product');
      throw error;
    }
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Error deleting product');
      throw error;
    }
  },

  // Bookings
  async getBookings(): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:users(*),
          package:packages(*),
          products(*)
        `);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Error loading bookings');
      throw error;
    }
  },

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
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

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update booking status:', error);
      toast.error('Error updating booking status');
      throw error;
    }
  },

  async updatePaymentStatus(
    id: string,
    paymentStatus: Booking['paymentStatus'],
    paymentMethod?: Booking['paymentMethod']
  ): Promise<Booking> {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ paymentStatus, paymentMethod })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Error updating payment status');
      throw error;
    }
  },
};