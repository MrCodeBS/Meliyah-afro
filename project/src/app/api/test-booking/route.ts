import { NextResponse } from 'next/server';
import { adminClient as supabase } from '@/lib/supabase/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const debug = { steps: [] };

  try {
    // Step 1: Get a package
    debug.steps.push('Fetching package...');
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .select('*')
      .limit(1)
      .single();

    if (packageError) {
      debug.steps.push('Failed to fetch package: ' + packageError.message);
      throw packageError;
    }
    debug.steps.push('Found package: ' + JSON.stringify(packageData));

    // Step 2: Create test user
    debug.steps.push('Creating test user...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '0774471179',
        role: 'CUSTOMER'
      }, {
        onConflict: 'email'
      })
      .select()
      .single();

    if (userError) {
      debug.steps.push('Failed to create user: ' + userError.message);
      throw userError;
    }
    debug.steps.push('User created/found: ' + JSON.stringify(userData));

    // Step 3: Create test booking
    debug.steps.push('Creating booking...');
    const bookingData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      package_id: packageData.id,
      date: '2024-02-01',
      time: '14:00',
      total_price: packageData.price,
      marketing_consent: false
    };

    const response = await fetch('http://localhost:3000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    const result = await response.json();
    debug.steps.push('Booking API response: ' + JSON.stringify(result));

    if (!result.success) {
      throw new Error(result.error || 'Failed to create booking');
    }

    return NextResponse.json({
      success: true,
      debug,
      bookingData: result.data
    });

  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      success: false,
      debug,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}