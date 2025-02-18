import { supabase } from '../config';
import { logger } from '@/lib/logger';
import { Package } from '@/types';

export const packagesApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select(`
          *,
          services:package_services(
            service:services(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to fetch packages:', error);
      throw error;
    }
  },

  async create(pkg: Omit<Package, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([pkg])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to create package:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Package>) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to update package:', error);
      throw error;
    }
  }
};