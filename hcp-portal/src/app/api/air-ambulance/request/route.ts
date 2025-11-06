import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// POST /api/air-ambulance/request
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      patientName,
      patientAge,
      condition,
      urgency,
      sourceCity,
      sourceState,
      destinationCity,
      destinationState,
      destinationHospital,
      contactPhone,
      contactEmail,
      additionalInfo,
    } = body;

    // Validate required fields
    if (!patientName || !patientAge || !condition || !sourceCity || !sourceState || 
        !destinationCity || !destinationState || !contactPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    // Get user from clerk_id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find available air ambulance
    const { data: ambulances } = await supabase
      .from('air_ambulances')
      .select('id')
      .eq('status', 'available')
      .limit(1);

    const ambulanceId = ambulances && ambulances.length > 0 ? ambulances[0].id : null;

    // Create mission
    const { data: mission, error } = await supabase
      .from('missions')
      .insert({
        ambulance_id: ambulanceId,
        patient_id: user.id,
        source_city: sourceCity,
        source_state: sourceState,
        destination_city: destinationCity,
        destination_state: destinationState,
        destination_hospital_id: destinationHospital || null,
        status: 'pending',
        patient_info: {
          name: patientName,
          age: parseInt(patientAge),
          condition,
          urgency: urgency || 'medium',
          contact_phone: contactPhone,
          contact_email: contactEmail || null,
          additional_info: additionalInfo || null,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating mission:', error);
      return NextResponse.json(
        { error: 'Failed to create air ambulance request' },
        { status: 400 }
      );
    }

    // Update ambulance status if assigned
    if (ambulanceId) {
      await supabase
        .from('air_ambulances')
        .update({ status: 'on_mission' })
        .eq('id', ambulanceId);
    }

    // In production, trigger notifications to ambulance service
    // For now, just return the mission

    return NextResponse.json({ 
      success: true, 
      data: mission,
      message: 'Air ambulance request submitted successfully. Our team will contact you shortly.' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating air ambulance request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/air-ambulance/request?user_id=xxx
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('user_id');

    const supabase = await createServerSupabaseClient();
    
    // Get user from clerk_id
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const targetUserId = userIdParam || user.id;

    const { data, error } = await supabase
      .from('missions')
      .select(`
        *,
        air_ambulances (*),
        hospitals!missions_destination_hospital_id_fkey (id, name, city, state)
      `)
      .eq('patient_id', targetUserId)
      .order('requested_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch missions' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

