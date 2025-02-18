import { NextResponse } from 'next/server';
import { sendBookingConfirmation } from '@/lib/email/resend';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await sendBookingConfirmation({
      bookingId: 'TEST-123',
      customerName: 'Carlos',
      customerEmail: 'carvalho06cc@gmail.com',
      packageName: 'Paket Gold',
      date: new Date('2024-02-01'),
      time: '14:00',
      price: 180.00
    });

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send test email',
          details: result.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Test email sent successfully',
      data: result.data
    });

  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}