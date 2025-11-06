export async function generatePrescriptionPDF(prescriptionData: {
  doctor_name: string;
  qualification: string;
  hospital_name: string;
  date: string;
  prescription_id: string;
  patient_name: string;
  age: number;
  notes: string;
  medications: Array<{
    name: string;
    dosage: string;
    instructions: string;
  }>;
}): Promise<string> {
  // HTML template for prescription
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
          }
          .header-left h2 {
            margin: 0 0 10px 0;
            color: #2563eb;
          }
          .doctor {
            font-weight: 600;
            margin: 5px 0;
          }
          .header-right {
            text-align: right;
          }
          .patient-info {
            margin: 20px 0;
            padding: 15px;
            background-color: #f3f4f6;
            border-radius: 8px;
            font-weight: 600;
          }
          .diagnosis {
            margin: 20px 0;
          }
          .medications {
            margin: 20px 0;
          }
          .medications ol {
            padding-left: 20px;
          }
          .medications li {
            margin: 10px 0;
            line-height: 1.6;
          }
          .signature {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #333;
          }
          hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <h2>MediAR Clinic</h2>
            <div class="doctor">Dr. ${prescriptionData.doctor_name}</div>
            <div>${prescriptionData.qualification}</div>
            <div>${prescriptionData.hospital_name}</div>
          </div>
          <div class="header-right">
            <div>Date: ${prescriptionData.date}</div>
            <div>Prescription ID: ${prescriptionData.prescription_id}</div>
          </div>
        </div>
        
        <div class="patient-info">
          Patient: ${prescriptionData.patient_name} | Age: ${prescriptionData.age}
        </div>
        
        <div class="diagnosis">
          <p><strong>Diagnosis / Notes:</strong> ${prescriptionData.notes}</p>
        </div>
        
        <div class="medications">
          <h4>Medications:</h4>
          <ol>
            ${prescriptionData.medications.map(med => 
              `<li><strong>${med.name}</strong> — ${med.dosage} — ${med.instructions}</li>`
            ).join('')}
          </ol>
        </div>
        
        <hr/>
        
        <div class="signature">
          <div>Signature: ____________________</div>
          <div style="margin-top: 10px;">Dr. ${prescriptionData.doctor_name}</div>
        </div>
      </body>
    </html>
  `;

  // In production, use Puppeteer to convert HTML to PDF
  // For MVP, return HTML string that can be converted on client-side or server-side
  return html;
}

// Server-side PDF generation function using Puppeteer
export async function generatePrescriptionPDFFile(prescriptionData: {
  doctor_name: string;
  qualification: string;
  hospital_name: string;
  date: string;
  prescription_id: string;
  patient_name: string;
  age: number;
  notes: string;
  medications: Array<{
    name: string;
    dosage: string;
    instructions: string;
  }>;
}): Promise<Buffer> {
  const puppeteer = require('puppeteer');
  
  const html = await generatePrescriptionPDF(prescriptionData);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  
  const page = await browser.newPage();
  await page.setContent(html);
  
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px',
    },
  });
  
  await browser.close();
  
  return pdf;
}

