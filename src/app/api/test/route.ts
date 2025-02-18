import { NextResponse } from 'next/server';
import { resend } from '@/lib/email/resend';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test Resend email
    const { data: emailTest, error: emailError } = await resend.emails.send({
      from: 'booking@meliyahafrohair.ch',
      to: 'carvalho06cc@gmail.com',
      subject: 'Test Email - Meliyah afro-shop',
      html: 'This is a test email to verify the email service is working.'
    });

    if (emailError) throw emailError;

    return NextResponse.json({
      success: true,
      email: 'sent',
      emailResult: emailTest
    });

  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}