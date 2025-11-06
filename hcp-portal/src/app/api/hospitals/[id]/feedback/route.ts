import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// POST /api/hospitals/[id]/feedback
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating, comments } = body;

    if (!rating) {
      return NextResponse.json(
        { error: 'Rating is required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
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

    // Check if feedback already exists
    const { data: existing } = await supabase
      .from('feedbacks')
      .select('id')
      .eq('user_id', user.id)
      .eq('hospital_id', params.id)
      .single();

    let data;
    if (existing) {
      // Update existing feedback
      const { data: updated, error } = await supabase
        .from('feedbacks')
        .update({
          rating,
          comments: comments || null,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      data = updated;
    } else {
      // Create new feedback
      const { data: created, error } = await supabase
        .from('feedbacks')
        .insert({
          user_id: user.id,
          hospital_id: params.id,
          rating,
          comments: comments || null,
        })
        .select()
        .single();

      if (error) throw error;
      data = created;
    }

    // Update hospital rating
    const { data: feedbacks } = await supabase
      .from('feedbacks')
      .select('rating')
      .eq('hospital_id', params.id);

    if (feedbacks && feedbacks.length > 0) {
      const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
      await supabase
        .from('hospitals')
        .update({ rating: Math.round(avgRating * 10) / 10 })
        .eq('id', params.id);
    }

    return NextResponse.json({ success: true, data }, { status: existing ? 200 : 201 });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/hospitals/[id]/feedback
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data, error } = await supabase
      .from('feedbacks')
      .select(`
        *,
        users (id, name)
      `)
      .eq('hospital_id', params.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch feedbacks' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

