import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// POST /api/emergency
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
      .from('emergencies')
      .insert({
        user_id: user.id,
        location: body.location || {},
        contact_person: body.contact_person || {},
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create emergency record' },
        { status: 400 }
      );
    }

    // In production, trigger SMS/push notifications here
    // For MVP, we'll just return the record

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error('Error creating emergency:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

