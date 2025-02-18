import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export async function getBookings(options = { limit: 10, offset: 0 }) {
  const { data, error, count } = await supabase
    .from('bookings')
    .select(`
      *,
      user:users(name, email, phone),
      package:packages(name, price)
    `, { count: 'exact' })
    .range(options.offset, options.offset + options.limit - 1)
    .order('date', { ascending: false });

  if (error) throw error;
  return { data, count };
}

export async function getCustomers(options = { limit: 10, offset: 0 }) {
  const { data, error, count } = await supabase
    .from('users')
    .select('*', { count: 'exact' })
    .eq('role', 'CUSTOMER')
    .range(options.offset, options.offset + options.limit - 1)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { data, count };
}

export async function getPackages() {
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
}

export async function getDashboardMetrics() {
  const today = new Date().toISOString().split('T')[0];
  
  const [bookingsToday, totalRevenue, customers] = await Promise.all([
    supabase
      .from('bookings')
      .select('count', { count: 'exact' })
      .eq('date', today),
    
    supabase
      .from('bookings')
      .select('total_price')
      .eq('date', today),
    
    supabase
      .from('users')
      .select('count', { count: 'exact' })
      .eq('role', 'CUSTOMER')
  ]);

  return {
    bookingsToday: bookingsToday.count || 0,
    totalRevenue: totalRevenue.data?.reduce((sum, b) => sum + b.total_price, 0) || 0,
    totalCustomers: customers.count || 0
  };
}