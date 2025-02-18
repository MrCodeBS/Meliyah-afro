import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = 'https://dnkvupubwzmgactvdhtg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRua3Z1cHVid3ptZ2FjdHZkaHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1NTg4NTQsImV4cCI6MjA0ODEzNDg1NH0.EHvLF-9Tsz8yfCnSPpKNGv-ZpwCo7ShLrtm5RxMeaLA';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRua3Z1cHVid3ptZ2FjdHZkaHRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjU1ODg1NCwiZXhwIjoyMDQ4MTM0ODU0fQ.C-mkhnkODTPQeewowXWCvZjmJYr3UGPhNrFptF6MHxs';

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase configuration');
}

// Create Supabase client with service role for admin operations
export const adminClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create Supabase client with anon key for public operations
export const publicClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export const supabase = publicClient;