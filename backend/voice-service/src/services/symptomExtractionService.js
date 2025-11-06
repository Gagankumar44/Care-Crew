import { logger } from '../utils/logger.js';

/**
 * Symptom Extraction Service
 * Extracts structured symptom data from natural language
 */
export class SymptomExtractionService {
  /**
   * Extract symptoms from text using NLP/pattern matching
   */
  static async extractSymptoms(text) {
    try {
      // In production, use ML model or NLP service
      // For now, use pattern matching
      
      const symptoms = [];
      const severity = this._extractSeverity(text);
      const duration = this._extractDuration(text);
      const bodyParts = this._extractBodyParts(text);
      
      // Common symptom keywords
      const symptomPatterns = {
        headache: ['headache', 'head pain', 'migraine'],
        fever: ['fever', 'temperature', 'hot'],
        cough: ['cough', 'coughing'],
        pain: ['pain', 'ache', 'sore', 'hurt'],
        fatigue: ['fatigue', 'tired', 'exhausted', 'weak'],
        nausea: ['nausea', 'nauseous', 'sick', 'vomiting'],
        dizziness: ['dizzy', 'dizziness', 'lightheaded'],
        chest_pain: ['chest pain', 'chest tightness', 'chest discomfort'],
        shortness_of_breath: ['shortness of breath', 'can\'t breathe', 'breathing difficulty'],
      };

      const lowerText = text.toLowerCase();
      
      Object.keys(symptomPatterns).forEach(symptom => {
        const patterns = symptomPatterns[symptom];
        const found = patterns.some(pattern => lowerText.includes(pattern));
        
        if (found) {
          symptoms.push({
            symptom,
            mentioned: true,
            severity: severity[symptom] || 'moderate',
            duration: duration[symptom] || duration.general || 'unknown',
            body_part: bodyParts[symptom] || null,
          });
        }
      });

      return {
        symptoms,
        severity,
        duration,
        body_parts: bodyParts,
        extracted_at: new Date().toISOString(),
      };
    } catch (error) {
      logger.error('Symptom extraction error', { error: error.message });
      return {
        symptoms: [],
        error: 'Could not extract symptoms',
      };
    }
  }

  /**
   * Extract severity indicators
   */
  static _extractSeverity(text) {
    const lowerText = text.toLowerCase();
    const severity = {};
    
    const severityKeywords = {
      severe: ['severe', 'very bad', 'extreme', 'intense', 'unbearable'],
      moderate: ['moderate', 'somewhat', 'bit', 'slight'],
      mild: ['mild', 'slight', 'little', 'minor'],
    };

    Object.keys(severityKeywords).forEach(level => {
      severityKeywords[level].forEach(keyword => {
        if (lowerText.includes(keyword)) {
          severity.general = level;
        }
      });
    });

    return severity;
  }

  /**
   * Extract duration information
   */
  static _extractDuration(text) {
    const lowerText = text.toLowerCase();
    const duration = {};
    
    // Pattern matching for duration
    const durationPatterns = [
      { pattern: /(\d+)\s*(day|days)/gi, unit: 'days' },
      { pattern: /(\d+)\s*(hour|hours|hr|hrs)/gi, unit: 'hours' },
      { pattern: /(\d+)\s*(week|weeks)/gi, unit: 'weeks' },
      { pattern: /(\d+)\s*(month|months)/gi, unit: 'months' },
    ];

    durationPatterns.forEach(({ pattern, unit }) => {
      const matches = lowerText.match(pattern);
      if (matches) {
        const numbers = matches.map(m => parseInt(m.match(/\d+/)[0]));
        duration.general = `${numbers[0]} ${unit}`;
      }
    });

    return duration;
  }

  /**
   * Extract body parts mentioned
   */
  static _extractBodyParts(text) {
    const lowerText = text.toLowerCase();
    const bodyParts = {};
    
    const bodyPartKeywords = {
      head: ['head', 'forehead', 'temple'],
      chest: ['chest', 'heart', 'breast'],
      stomach: ['stomach', 'abdomen', 'belly'],
      back: ['back', 'spine'],
      arm: ['arm', 'shoulder', 'elbow'],
      leg: ['leg', 'knee', 'ankle'],
    };

    Object.keys(bodyPartKeywords).forEach(part => {
      const keywords = bodyPartKeywords[part];
      const found = keywords.some(keyword => lowerText.includes(keyword));
      if (found) {
        bodyParts[part] = true;
      }
    });

    return bodyParts;
  }
}

