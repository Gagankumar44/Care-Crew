import { ImageAnnotatorClient } from '@google-cloud/vision';
import { logger } from '../utils/logger.js';

/**
 * Bill OCR Service
 * Extracts text from hospital bill images using Google Cloud Vision
 */
export class BillOCRService {
  static client = null;

  static initialize() {
    if (!this.client) {
      try {
        this.client = new ImageAnnotatorClient({
          keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
          projectId: process.env.GCP_PROJECT_ID,
        });
      } catch (error) {
        logger.warn('Google Cloud Vision client not initialized. Using fallback.', { error: error.message });
      }
    }
    return this.client;
  }

  /**
   * Extract text from bill image
   */
  static async extractText(imageBuffer, mimeType) {
    try {
      const client = this.initialize();
      
      if (!client) {
        // Fallback: return mock data for development
        logger.warn('Bill OCR fallback: returning mock data');
        return {
          text: 'Mock bill text...',
          structured: {
            hospital_name: 'City General Hospital',
            patient_name: 'John Doe',
            date: '2024-01-15',
            items: [
              { description: 'Consultation', amount: 500 },
              { description: 'Lab Tests', amount: 1200 },
              { description: 'Room Charges', amount: 3000 }
            ],
            total: 4700
          }
        };
      }

      // Perform OCR
      const [result] = await client.textDetection({
        image: { content: imageBuffer },
      });

      const detections = result.textAnnotations;
      if (!detections || detections.length === 0) {
        throw new Error('No text detected in image');
      }

      const fullText = detections[0].description;

      // Parse structured data from bill
      const structured = this._parseBillText(fullText);

      return {
        text: fullText,
        structured
      };
    } catch (error) {
      logger.error('Bill OCR error', { error: error.message });
      throw error;
    }
  }

  /**
   * Parse bill text into structured format
   */
  static _parseBillText(text) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    const structured = {
      hospital_name: '',
      patient_name: '',
      date: '',
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0
    };

    // Extract hospital name (usually first line or contains "Hospital")
    const hospitalLine = lines.find(line => 
      /hospital|clinic|medical center/i.test(line)
    );
    if (hospitalLine) {
      structured.hospital_name = hospitalLine.trim();
    } else if (lines.length > 0) {
      structured.hospital_name = lines[0].trim();
    }

    // Extract patient name (usually contains "Patient:" or "Name:")
    const patientLine = lines.find(line => 
      /patient|name:|patient name/i.test(line)
    );
    if (patientLine) {
      structured.patient_name = patientLine.replace(/patient|name:|patient name/gi, '').trim();
    }

    // Extract date
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
    const dateMatch = text.match(datePattern);
    if (dateMatch) {
      structured.date = dateMatch[1];
    }

    // Extract line items (items with amounts)
    const amountPattern = /(\d+[,.]?\d*)\s*(?:Rs|₹|\$|USD)/i;
    lines.forEach(line => {
      const amountMatch = line.match(amountPattern);
      if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        const description = line.replace(amountPattern, '').trim();
        
        if (description.length > 0 && amount > 0) {
          structured.items.push({
            description,
            amount,
            quantity: 1
          });
        }
      }
    });

    // Extract totals
    const totalPattern = /total[:\s]+(\d+[,.]?\d*)/i;
    const totalMatch = text.match(totalPattern);
    if (totalMatch) {
      structured.total = parseFloat(totalMatch[1].replace(/,/g, ''));
    } else if (structured.items.length > 0) {
      structured.total = structured.items.reduce((sum, item) => sum + item.amount, 0);
    }

    return structured;
  }
}

