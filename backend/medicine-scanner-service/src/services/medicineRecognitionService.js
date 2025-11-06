import { ImageAnnotatorClient } from '@google-cloud/vision';
import { logger } from '../utils/logger.js';
import axios from 'axios';

/**
 * Medicine Recognition Service
 * Uses Google Cloud Vision API for OCR and medicine database lookup
 */
export class MedicineRecognitionService {
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
   * Recognize medicine from image
   */
  static async recognize(imageBuffer) {
    try {
      const client = this.initialize();
      
      if (!client) {
        // Fallback: return mock data for development
        logger.warn('Medicine recognition fallback: returning mock data');
        return {
          success: true,
          medicine: {
            name: 'Paracetamol 500mg',
            generic_name: 'Acetaminophen',
            manufacturer: 'Generic Pharma',
            dosage: {
              strength: '500mg',
              form: 'tablet',
              recommended_dosage: '1-2 tablets every 4-6 hours'
            },
            warnings: [
              'Do not exceed 4g per day',
              'May cause liver damage if overdosed'
            ],
            expiry_date: '2025-12-31'
          }
        };
      }

      // Perform OCR
      const [result] = await client.textDetection({
        image: { content: imageBuffer },
      });

      const detections = result.textAnnotations;
      if (!detections || detections.length === 0) {
        return {
          success: false,
          error: 'No text detected in image'
        };
      }

      // Extract text (first annotation contains all text)
      const fullText = detections[0].description;

      // Parse medicine information from text
      const medicine = this._parseMedicineText(fullText);

      // Lookup medicine in database/API
      const medicineDetails = await this._lookupMedicine(medicine.name || medicine.generic_name);

      return {
        success: true,
        medicine: {
          ...medicine,
          ...medicineDetails
        }
      };
    } catch (error) {
      logger.error('Medicine recognition error', { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Parse medicine information from OCR text
   */
  static _parseMedicineText(text) {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    const medicine = {
      name: '',
      generic_name: '',
      manufacturer: '',
      dosage: {},
      expiry_date: null
    };

    // Look for medicine name (usually first line or contains "mg", "ml", etc.)
    const nameLine = lines.find(line => 
      /\d+\s*(mg|ml|g|mcg|IU)/i.test(line) || 
      /tablet|capsule|syrup|injection/i.test(line)
    );
    if (nameLine) {
      medicine.name = nameLine.trim();
    } else if (lines.length > 0) {
      medicine.name = lines[0].trim();
    }

    // Look for generic name (often contains "contains" or "ingredient")
    const genericLine = lines.find(line => 
      /contains|ingredient|active ingredient/i.test(line)
    );
    if (genericLine) {
      medicine.generic_name = genericLine.replace(/contains|ingredient|active ingredient/gi, '').trim();
    }

    // Look for manufacturer
    const manufacturerLine = lines.find(line => 
      /manufactured|manufacturer|by|pharma|pharmaceuticals/i.test(line)
    );
    if (manufacturerLine) {
      medicine.manufacturer = manufacturerLine.replace(/manufactured|manufacturer|by/gi, '').trim();
    }

    // Look for dosage information
    const dosageLine = lines.find(line => 
      /\d+\s*(mg|ml|g|mcg)/i.test(line)
    );
    if (dosageLine) {
      const dosageMatch = dosageLine.match(/(\d+)\s*(mg|ml|g|mcg|IU)/i);
      if (dosageMatch) {
        medicine.dosage = {
          strength: `${dosageMatch[1]}${dosageMatch[2]}`,
          form: this._extractForm(lines),
          recommended_dosage: this._extractRecommendedDosage(lines)
        };
      }
    }

    // Look for expiry date
    const expiryPattern = /exp(?:iry|date|\.)?\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i;
    const expiryMatch = text.match(expiryPattern);
    if (expiryMatch) {
      medicine.expiry_date = this._parseDate(expiryMatch[1]);
    }

    return medicine;
  }

  /**
   * Extract form (tablet, capsule, etc.)
   */
  static _extractForm(lines) {
    const text = lines.join(' ').toLowerCase();
    if (text.includes('tablet')) return 'tablet';
    if (text.includes('capsule')) return 'capsule';
    if (text.includes('syrup')) return 'syrup';
    if (text.includes('injection')) return 'injection';
    if (text.includes('cream')) return 'cream';
    return 'tablet'; // default
  }

  /**
   * Extract recommended dosage
   */
  static _extractRecommendedDosage(lines) {
    const dosagePattern = /(\d+)\s*(?:-\s*\d+)?\s*(?:tablet|pill|capsule|ml|mg)\s*(?:every|per|once|twice|daily|hour)/i;
    const dosageMatch = lines.join(' ').match(dosagePattern);
    if (dosageMatch) {
      return dosageMatch[0];
    }
    return 'As directed by physician';
  }

  /**
   * Parse date string
   */
  static _parseDate(dateString) {
    const parts = dateString.split(/[\/\-]/);
    if (parts.length === 3) {
      const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      return `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return null;
  }

  /**
   * Lookup medicine in database/API
   */
  static async _lookupMedicine(medicineName) {
    try {
      // In production, use FDA API or medicine database
      // For now, return mock data
      
      // Could use: https://api.fda.gov/drug/label.json
      // Or: RxNorm API, DrugBank API, etc.
      
      return {
        warnings: [
          'Consult physician before use',
          'Do not exceed recommended dosage'
        ],
        interactions: [] // Will be checked separately
      };
    } catch (error) {
      logger.warn('Medicine lookup failed', { error: error.message });
      return {};
    }
  }

  /**
   * Check if medicine is expired
   */
  static checkExpiry(expiryDate) {
    if (!expiryDate) {
      return {
        is_expired: false,
        is_counterfeit: false,
        reason: 'Expiry date not found'
      };
    }

    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isExpired = expiry < today;
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    return {
      is_expired: isExpired,
      is_counterfeit: false, // Would need additional checks
      expiry_date: expiryDate,
      days_until_expiry: daysUntilExpiry,
      warning: isExpired ? 'This medicine has expired. Do not use.' : 
               daysUntilExpiry < 30 ? 'Medicine expires soon.' : null
    };
  }
}

