import { NextResponse } from 'next/server';
import { testSupabaseConnection } from '@/lib/supabase/test';
import { logger } from '@/lib/logger';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await testSupabaseConnection();

    if (!status.success) {
      logger.error('Health check failed', { context: status.error });
      return NextResponse.json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: status.error
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      ...status
    });
  } catch (error) {
    logger.error('Health check failed', {
      context: { error: error instanceof Error ? error.message : 'Unknown error' }
    });
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}