import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/doctors
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const specialization = searchParams.get('specialization');
    const city = searchParams.get('city');
    const hospitalId = searchParams.get('hospital_id');

    let query = supabase
      .from('doctors')
      .select(`
        *,
        users (id, name, email),
        hospitals (id, name, city, state)
      `);

    if (specialization) {
      query = query.eq('specialization', specialization);
    }
    if (hospitalId) {
      query = query.eq('hospital_id', hospitalId);
    }
    if (city) {
      query = query.eq('hospitals.city', city);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch doctors' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

