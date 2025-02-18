import { supabase } from './config';
import { logger } from '@/lib/logger';

export async function testSupabaseConnection() {
  try {
    // Test database connection with a simple query
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact' })
      .limit(1)
      .single();

    if (error) {
      logger.error('Supabase connection test failed', { context: error });
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }

    return {
      success: true,
      database: 'connected',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Supabase connection test failed', { 
      context: error instanceof Error ? error.message : 'Unknown error' 
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}