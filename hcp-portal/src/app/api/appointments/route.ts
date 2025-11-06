import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/appointments
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();
    
    // Get user from clerk_id
    const { data: user } = await supabase
      .from('users')
      .select('id, role')
      .eq('clerk_id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let query = supabase
      .from('appointments')
      .select(`
        *,
        doctors (*, users (name, email)),
        hospitals (id, name),
        users!appointments_patient_id_fkey (id, name)
      `);

    if (user.role === 'patient') {
      query = query.eq('patient_id', user.id);
    } else if (user.role === 'doctor') {
      const { data: doctor } = await supabase
        .from('doctors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (doctor) {
        query = query.eq('doctor_id', doctor.id);
      }
    }

    const { data, error } = await query.order('scheduled_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch appointments' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/appointments
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

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: user.id,
        doctor_id: body.doctor_id,
        hospital_id: body.hospital_id,
        scheduled_at: body.scheduled_at,
        type: body.type || 'virtual',
        reason: body.reason,
        status: 'scheduled',
      })
      .select(`
        *,
        doctors (*, users (name, email)),
        hospitals (id, name)
      `)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create appointment' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
