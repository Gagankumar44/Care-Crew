import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generatePrescriptionPDFFile } from '@/lib/prescription-generator';

// POST /api/prescriptions/generate-pdf
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
    
    const pdfBuffer = await generatePrescriptionPDFFile({
      doctor_name: body.doctor_name,
      qualification: body.qualification,
      hospital_name: body.hospital_name,
      date: body.date || new Date().toLocaleDateString(),
      prescription_id: body.prescription_id || crypto.randomUUID(),
      patient_name: body.patient_name,
      age: body.age,
      notes: body.notes,
      medications: body.medications || [],
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="prescription-${body.prescription_id || 'new'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating prescription PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

