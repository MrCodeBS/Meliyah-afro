import { supabase } from '../config';
import { logger } from '@/lib/logger';
import { Service } from '@/types';

export const servicesApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to fetch services:', error);
      throw error;
    }
  },

  async create(service: Omit<Service, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to create service:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Service>) {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Failed to update service:', error);
      throw error;
    }
  }
};