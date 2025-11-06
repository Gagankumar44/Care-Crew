import { logger } from '../utils/logger.js';

/**
 * SOAP Notes Service
 * Converts doctor's voice notes to structured SOAP format
 */
export class SOAPNotesService {
  /**
   * Convert transcript to SOAP notes
   */
  static async convertToSOAP(transcript) {
    try {
      // In production, use ML model or NLP service
      // For now, use pattern matching and structure extraction
      
      const soap = {
        subjective: this._extractSubjective(transcript),
        objective: this._extractObjective(transcript),
        assessment: this._extractAssessment(transcript),
        plan: this._extractPlan(transcript),
      };

      return soap;
    } catch (error) {
      logger.error('SOAP conversion error', { error: error.message });
      return {
        subjective: transcript,
        objective: '',
        assessment: '',
        plan: '',
      };
    }
  }

  /**
   * Extract subjective information (patient's description)
   */
  static _extractSubjective(text) {
    const lowerText = text.toLowerCase();
    const subjective = [];
    
    // Patient-reported symptoms
    const symptomPhrases = [
      'patient reports',
      'patient says',
      'patient complains',
      'patient feels',
      'chief complaint',
    ];

    symptomPhrases.forEach(phrase => {
      if (lowerText.includes(phrase)) {
        const index = lowerText.indexOf(phrase);
        const snippet = text.substring(index, Math.min(index + 200, text.length));
        subjective.push(snippet.trim());
      }
    });

    // If no specific phrases found, use first few sentences
    if (subjective.length === 0) {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      subjective.push(...sentences.slice(0, 3));
    }

    return subjective.join(' ').trim() || text;
  }

  /**
   * Extract objective information (observations, vitals)
   */
  static _extractObjective(text) {
    const lowerText = text.toLowerCase();
    const objective = [];
    
    // Vital signs patterns
    const vitalPatterns = [
      /blood pressure[:\s]+(\d+\/\d+)/gi,
      /heart rate[:\s]+(\d+)/gi,
      /temperature[:\s]+(\d+\.?\d*)/gi,
      /oxygen[:\s]+(\d+)/gi,
      /weight[:\s]+(\d+)/gi,
    ];

    vitalPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        objective.push(...matches);
      }
    });

    // Physical examination findings
    const examKeywords = ['appears', 'visible', 'palpable', 'auscultation', 'inspection'];
    examKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const index = lowerText.indexOf(keyword);
        const snippet = text.substring(Math.max(0, index - 50), Math.min(index + 150, text.length));
        if (!objective.includes(snippet.trim())) {
          objective.push(snippet.trim());
        }
      }
    });

    return objective.join('; ').trim() || 'No objective findings recorded';
  }

  /**
   * Extract assessment (diagnosis, differential)
   */
  static _extractAssessment(text) {
    const lowerText = text.toLowerCase();
    const assessment = [];
    
    // Diagnosis keywords
    const diagnosisKeywords = [
      'diagnosis',
      'likely',
      'suspected',
      'probable',
      'consistent with',
      'rule out',
      'differential',
    ];

    diagnosisKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const index = lowerText.indexOf(keyword);
        const snippet = text.substring(Math.max(0, index - 20), Math.min(index + 200, text.length));
        assessment.push(snippet.trim());
      }
    });

    // ICD codes (if mentioned)
    const icdPattern = /[A-Z]\d{2}\.?\d*/gi;
    const icdMatches = text.match(icdPattern);
    if (icdMatches) {
      assessment.push(`ICD codes: ${icdMatches.join(', ')}`);
    }

    return assessment.join('; ').trim() || 'Assessment pending';
  }

  /**
   * Extract plan (treatment, follow-up)
   */
  static _extractPlan(text) {
    const lowerText = text.toLowerCase();
    const plan = [];
    
    // Treatment keywords
    const planKeywords = [
      'prescribe',
      'prescription',
      'medication',
      'treatment',
      'follow up',
      'referral',
      'recommend',
      'advise',
    ];

    planKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        const index = lowerText.indexOf(keyword);
        const snippet = text.substring(Math.max(0, index - 10), Math.min(index + 200, text.length));
        plan.push(snippet.trim());
      }
    });

    // Medication names (simple pattern)
    const medicationPattern = /(?:prescribe|prescription|take|give)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
    const medMatches = [...text.matchAll(medicationPattern)];
    if (medMatches.length > 0) {
      plan.push(`Medications: ${medMatches.map(m => m[1]).join(', ')}`);
    }

    return plan.join('; ').trim() || 'Plan pending';
  }
}

