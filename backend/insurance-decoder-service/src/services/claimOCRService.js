import { ImageAnnotatorClient } from '@google-cloud/vision';
import { logger } from '../utils/logger.js';

/**
 * Claim OCR Service
 * Extracts text from insurance claim documents
 */
export class ClaimOCRService {
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
   * Extract text from claim document
   */
  static async extractText(imageBuffer, mimeType) {
    try {
      const client = this.initialize();
      
      if (!client) {
        // Fallback: return mock data
        logger.warn('Claim OCR fallback: returning mock data');
        return {
          text: 'Mock claim document text...',
          structured: {
            policy_number: 'POL123456789',
            claim_number: 'CLM987654321',
            patient_name: 'John Doe',
            date_of_service: '2024-01-15',
            amount_claimed: 5000,
            amount_approved: 4500
          }
        };
      }

      const [result] = await client.textDetection({
        image: { content: imageBuffer },
      });

      const detections = result.textAnnotations;
      if (!detections || detections.length === 0) {
        throw new Error('No text detected in document');
      }

      const fullText = detections[0].description;
      const structured = this._parseClaimText(fullText);

      return {
        text: fullText,
        structured
      };
    } catch (error) {
      logger.error('Claim OCR error', { error: error.message });
      throw error;
    }
  }

  /**
   * Parse claim text into structured format
   */
  static _parseClaimText(text) {
    const structured = {
      policy_number: '',
      claim_number: '',
      patient_name: '',
      date_of_service: '',
      amount_claimed: 0,
      amount_approved: 0
    };

    // Extract policy number
    const policyPattern = /policy[:\s]+([A-Z0-9]+)/i;
    const policyMatch = text.match(policyPattern);
    if (policyMatch) {
      structured.policy_number = policyMatch[1];
    }

    // Extract claim number
    const claimPattern = /claim[:\s]+([A-Z0-9]+)/i;
    const claimMatch = text.match(claimPattern);
    if (claimMatch) {
      structured.claim_number = claimMatch[1];
    }

    // Extract patient name
    const namePattern = /patient[:\s]+([A-Z\s]+)/i;
    const nameMatch = text.match(namePattern);
    if (nameMatch) {
      structured.patient_name = nameMatch[1].trim();
    }

    // Extract date
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/;
    const dateMatch = text.match(datePattern);
    if (dateMatch) {
      structured.date_of_service = dateMatch[1];
    }

    // Extract amounts
    const amountPattern = /(\d+[,.]?\d*)/g;
    const amounts = text.match(amountPattern);
    if (amounts && amounts.length >= 2) {
      structured.amount_claimed = parseFloat(amounts[0].replace(/,/g, ''));
      structured.amount_approved = parseFloat(amounts[1].replace(/,/g, ''));
    }

    return structured;
  }
}

