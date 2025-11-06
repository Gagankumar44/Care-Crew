import { logger } from '../utils/logger.js';

/**
 * Bill Analysis Service
 * Analyzes hospital bills and provides explanations
 */
export class BillAnalysisService {
  /**
   * Analyze bill and provide explanations
   */
  static async analyzeBill(ocrText, structuredData) {
    try {
      const analysis = {
        line_items: [],
        total_amount: structuredData.total || 0,
        explanation: {},
        medical_codes: [],
        cheaper_alternatives: []
      };

      // Analyze each line item
      structuredData.items.forEach(item => {
        const itemAnalysis = this._analyzeLineItem(item);
        analysis.line_items.push({
          ...item,
          explanation: itemAnalysis.explanation,
          reasonable_price: itemAnalysis.reasonable_price,
          is_overpriced: itemAnalysis.is_overpriced
        });
      });

      // Extract medical codes (CPT, ICD codes)
      analysis.medical_codes = this._extractMedicalCodes(ocrText);

      // Generate overall explanation
      analysis.explanation = {
        summary: `Total bill amount: ₹${structuredData.total.toLocaleString()}`,
        breakdown: `This bill includes ${structuredData.items.length} line items`,
        recommendations: this._generateRecommendations(analysis.line_items),
        overpriced_items: analysis.line_items.filter(item => item.is_overpriced)
      };

      // Find cheaper alternatives (in production, query hospital database)
      analysis.cheaper_alternatives = await this._findCheaperAlternatives(
        structuredData.hospital_name,
        structuredData.items
      );

      return analysis;
    } catch (error) {
      logger.error('Bill analysis error', { error: error.message });
      throw error;
    }
  }

  /**
   * Analyze individual line item
   */
  static _analyzeLineItem(item) {
    const explanation = {
      description: item.description,
      typical_price_range: this._getTypicalPriceRange(item.description),
      market_average: this._getMarketAverage(item.description)
    };

    const reasonablePrice = explanation.market_average || item.amount * 0.8;
    const isOverpriced = item.amount > (explanation.market_average * 1.2);

    return {
      explanation,
      reasonable_price: reasonablePrice,
      is_overpriced: isOverpriced
    };
  }

  /**
   * Get typical price range for a service
   */
  static _getTypicalPriceRange(description) {
    const lowerDescription = description.toLowerCase();
    
    // Price ranges (in INR, simplified)
    const priceRanges = {
      'consultation': { min: 300, max: 1500 },
      'lab test': { min: 200, max: 2000 },
      'x-ray': { min: 500, max: 2000 },
      'ultrasound': { min: 800, max: 3000 },
      'mri': { min: 3000, max: 10000 },
      'ct scan': { min: 2000, max: 8000 },
      'room': { min: 1000, max: 5000 },
      'surgery': { min: 10000, max: 100000 }
    };

    for (const [key, range] of Object.entries(priceRanges)) {
      if (lowerDescription.includes(key)) {
        return range;
      }
    }

    return { min: 0, max: 0 };
  }

  /**
   * Get market average price
   */
  static _getMarketAverage(description) {
    const range = this._getTypicalPriceRange(description);
    return range.min > 0 ? (range.min + range.max) / 2 : null;
  }

  /**
   * Extract medical codes from text
   */
  static _extractMedicalCodes(text) {
    const codes = [];
    
    // CPT codes (5 digits)
    const cptPattern = /\b\d{5}\b/g;
    const cptMatches = text.match(cptPattern);
    if (cptMatches) {
      codes.push(...cptMatches.map(code => ({ type: 'CPT', code })));
    }

    // ICD codes (alphanumeric)
    const icdPattern = /[A-Z]\d{2}\.?\d*/gi;
    const icdMatches = text.match(icdPattern);
    if (icdMatches) {
      codes.push(...icdMatches.map(code => ({ type: 'ICD', code })));
    }

    return codes;
  }

  /**
   * Generate recommendations
   */
  static _generateRecommendations(lineItems) {
    const recommendations = [];
    const overpricedCount = lineItems.filter(item => item.is_overpriced).length;

    if (overpricedCount > 0) {
      recommendations.push(
        `${overpricedCount} item(s) appear to be overpriced. Consider comparing with other hospitals.`
      );
    }

    const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
    if (total > 50000) {
      recommendations.push(
        'This is a high-value bill. Ensure all charges are justified and request itemized breakdown if not provided.'
      );
    }

    return recommendations;
  }

  /**
   * Find cheaper alternatives (mock - in production, query hospital database)
   */
  static async _findCheaperAlternatives(hospitalName, items) {
    // In production, this would query a hospital database
    // For now, return mock data
    return [
      {
        service: 'Lab Tests',
        current_hospital: hospitalName || 'Current Hospital',
        current_price: 1200,
        alternatives: [
          { hospital: 'Affordable Labs', price: 800, savings: 400 },
          { hospital: 'City Diagnostic Center', price: 950, savings: 250 }
        ]
      }
    ];
  }
}

