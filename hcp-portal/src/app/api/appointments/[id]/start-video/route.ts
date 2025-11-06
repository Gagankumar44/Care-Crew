import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// POST /api/appointments/:id/start-video
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

    const supabase = await createServerSupabaseClient();
    
    // Get appointment
    const { data: appointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Generate video call token (using Daily.co or similar)
    // For MVP, we'll generate a simple token
    // In production, integrate with Daily.co API
    const videoToken = `daily_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Update appointment with video token
    await supabase
      .from('appointments')
      .update({ video_call_token: videoToken })
      .eq('id', params.id);

    return NextResponse.json({
      success: true,
      data: {
        token: videoToken,
        room_url: process.env.DAILY_DOMAIN 
          ? `https://${process.env.DAILY_DOMAIN}/room/${appointment.id}`
          : null,
      },
    });
  } catch (error) {
    console.error('Error starting video call:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

