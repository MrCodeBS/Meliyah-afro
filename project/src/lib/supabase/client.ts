import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export const createClient = () => {
  return createClientComponentClient<Database>({
    supabaseUrl: 'https://dnkvupubwzmgactvdhtg.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRua3Z1cHVid3ptZ2FjdHZkaHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NTg4NTQsImV4cCI6MjA0ODEzNDg1NH0.EHvLF-9Tsz8yfCnSPpKNGv-ZpwCo7ShLrtm5RxMeaLA',
  });
};

// Create a singleton instance for direct use
export const supabase = createClient();