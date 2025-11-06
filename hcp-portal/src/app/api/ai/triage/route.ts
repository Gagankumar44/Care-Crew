import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { openai, TRIAGE_SYSTEM_MESSAGE } from '@/lib/openai';

// POST /api/ai/triage
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { symptoms, severity, age, gender, medical_history } = body;

    if (!symptoms) {
      return NextResponse.json(
        { error: 'Symptoms are required' },
        { status: 400 }
      );
    }

    // Check for emergency keywords
    const emergencyKeywords = ['chest pain', 'chest tightness', 'difficulty breathing', 'shortness of breath', 'loss of consciousness', 'severe bleeding', 'unconscious'];
    const symptomsLower = symptoms.toLowerCase();
    const isEmergency = emergencyKeywords.some(keyword => symptomsLower.includes(keyword));

    if (isEmergency) {
      return NextResponse.json({
        success: true,
        data: {
          urgency: 'critical',
          message: 'Your symptoms require immediate medical attention. Call emergency services or go to the nearest ER now.',
          suggested_specialties: ['Emergency Medicine', 'Cardiology'],
          next_action: [
            'Call emergency number immediately',
            'If possible, enable live location sharing with your emergency contacts',
          ],
        },
      });
    }

    // Build prompt for OpenAI
    const userPrompt = `Symptoms: ${symptoms}
Severity: ${severity || 'not specified'}
Age: ${age || 'not specified'}
Gender: ${gender || 'not specified'}
Medical History: ${medical_history || 'none'}

Please provide a triage assessment in JSON format with: urgency_level (low/moderate/high/critical), suggested_specialty, suggested_next_action (array of 1-2 actionable steps), and a brief message explaining the recommendation.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: TRIAGE_SYSTEM_MESSAGE },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const parsedResponse = JSON.parse(responseContent);

    return NextResponse.json({
      success: true,
      data: {
        urgency: parsedResponse.urgency_level || 'moderate',
        message: parsedResponse.message || 'Please consult with a healthcare provider.',
        suggested_specialties: parsedResponse.suggested_specialty 
          ? [parsedResponse.suggested_specialty]
          : [],
        next_action: Array.isArray(parsedResponse.suggested_next_action)
          ? parsedResponse.suggested_next_action
          : [parsedResponse.suggested_next_action || 'Schedule a consultation'],
      },
    });
  } catch (error) {
    console.error('Error in AI triage:', error);
    return NextResponse.json(
      { error: 'Failed to process triage request' },
      { status: 500 }
    );
  }
}

