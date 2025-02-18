import { supabase } from '../config';
import { toast } from 'sonner';
import { Product } from '@/types';

export const productsApi = {
  async getAll() {
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

  async create(product: Omit<Product, 'id'>) {
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
  }
};