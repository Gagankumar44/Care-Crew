import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { openai, REPORT_PARSER_SYSTEM_MESSAGE } from '@/lib/openai';

// POST /api/ai/parse-report
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
    const { file_text, file_url } = body;

    if (!file_text && !file_url) {
      return NextResponse.json(
        { error: 'Either file_text or file_url is required' },
        { status: 400 }
      );
    }

    // For MVP, we'll process text. In production, you'd use OCR/vision API
    const userPrompt = file_text || `Parse this medical report: ${file_url}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: REPORT_PARSER_SYSTEM_MESSAGE },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const parsedResponse = JSON.parse(responseContent);

    return NextResponse.json({
      success: true,
      data: {
        test_name: parsedResponse.test_name || 'Unknown',
        key_values: parsedResponse.key_values || [],
        normal_range: parsedResponse.normal_range || 'Not specified',
        flag: parsedResponse.flag || 'normal',
        summary: parsedResponse.summary || 'Report parsed successfully',
        urgent: parsedResponse.flag === 'critical',
      },
    });
  } catch (error) {
    console.error('Error parsing report:', error);
    return NextResponse.json(
      { error: 'Failed to parse report' },
      { status: 500 }
    );
  }
}

