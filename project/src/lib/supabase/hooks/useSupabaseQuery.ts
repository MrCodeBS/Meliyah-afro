import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../config';
import { handleError } from '../utils/error';

interface UseSupabaseQueryOptions<T> extends Omit<UseQueryOptions<T, PostgrestError>, 'queryKey' | 'queryFn'> {
  enabled?: boolean;
}

export function useSupabaseQuery<T>(
  key: string[],
  query: () => Promise<{ data: T; error: PostgrestError | null }>,
  options: UseSupabaseQueryOptions<T> = {}
) {
  return useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await query();
      if (error) {
        handleError(error, `Query failed: ${key.join('/')}`);
        throw error;
      }
      return data;
    },
    ...options
  });
}