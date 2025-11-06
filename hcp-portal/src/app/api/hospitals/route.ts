import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// GET /api/hospitals
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const facility = searchParams.get('facility');
    const minCost = searchParams.get('min_cost');
    const maxCost = searchParams.get('max_cost');
    const q = searchParams.get('q');

    let query = supabase.from('hospitals').select('*');

    if (state) {
      query = query.eq('state', state);
    }
    if (city) {
      query = query.eq('city', city);
    }
    if (minCost) {
      query = query.gte('avg_cost', parseFloat(minCost));
    }
    if (maxCost) {
      query = query.lte('avg_cost', parseFloat(maxCost));
    }
    if (q) {
      query = query.or(`name.ilike.%${q}%,address.ilike.%${q}%`);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch hospitals' },
        { status: 400 }
      );
    }

    // Filter by facility if provided
    let filteredData = data;
    if (facility && data) {
      filteredData = data.filter((hospital: any) => {
        const facilities = hospital.facilities || {};
        return facilities[facility] === true;
      });
    }

    return NextResponse.json({ success: true, data: filteredData || [] });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

