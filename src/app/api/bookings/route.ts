import { NextResponse } from 'next/server';
import { sendBookingConfirmation } from '@/lib/email/resend';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  package_id: z.string().min(1, 'Package ID is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  total_price: z.number().positive('Price must be positive'),
  marketing_consent: z.boolean().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received booking request:', body);

    // Step 1: Validate request data
    const validatedData = bookingSchema.parse(body);
    console.log('Validated booking data:', validatedData);

    // Step 2: Insert booking data into the database
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .insert([validatedData])
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // Step 3: Send confirmation email
    const emailResult = await sendBookingConfirmation({
      bookingId: bookingData.id,
      customerName: validatedData.name,
      customerEmail: validatedData.email,
      packageName: 'Test Package',
      date: new Date(validatedData.date),
      time: validatedData.time,
      price: validatedData.total_price
    });

    return NextResponse.json({
      success: true,
      data: {
        id: bookingData.id,
        date: validatedData.date,
        time: validatedData.time,
        packageId: validatedData.package_id,
        packageName: 'Test Package',
        totalPrice: validatedData.total_price,
        status: 'PENDING'
      },
      emailSent: emailResult.success
    });

  } catch (error) {
    console.error('Booking creation failed:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid booking data',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process booking'
    }, { status: 500 });
  }
}
