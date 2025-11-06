import { logger } from '../utils/logger.js';

/**
 * Pre-Check Service
 * Performs health assessment before hospital visit
 */
export class PreCheckService {
  /**
   * Perform pre-check health assessment
   */
  static async performPreCheck(vitals, symptoms) {
    try {
      const assessment = {
        risk_level: 'low',
        recommendations: [],
        vitals_analysis: {},
        symptoms_analysis: {},
        can_proceed: true
      };

      // Analyze vitals
      if (vitals) {
        assessment.vitals_analysis = this._analyzeVitals(vitals);
      }

      // Analyze symptoms
      if (symptoms && symptoms.length > 0) {
        assessment.symptoms_analysis = this._analyzeSymptoms(symptoms);
      }

      // Determine overall risk level
      assessment.risk_level = this._determineRiskLevel(
        assessment.vitals_analysis,
        assessment.symptoms_analysis
      );

      // Generate recommendations
      assessment.recommendations = this._generateRecommendations(assessment);

      // Determine if can proceed
      if (assessment.risk_level === 'high' || assessment.risk_level === 'critical') {
        assessment.can_proceed = false;
        assessment.recommendations.push('Consider immediate medical attention before visit.');
      }

      return assessment;
    } catch (error) {
      logger.error('Pre-check error', { error: error.message });
      throw error;
    }
  }

  /**
   * Analyze vital signs
   */
  static _analyzeVitals(vitals) {
    const analysis = {
      status: 'normal',
      flags: []
    };

    // Blood pressure
    if (vitals.blood_pressure_systolic) {
      const systolic = vitals.blood_pressure_systolic;
      const diastolic = vitals.blood_pressure_diastolic || 80;

      if (systolic > 180 || diastolic > 120) {
        analysis.flags.push('Hypertensive crisis');
        analysis.status = 'critical';
      } else if (systolic > 140 || diastolic > 90) {
        analysis.flags.push('High blood pressure');
        analysis.status = analysis.status === 'normal' ? 'elevated' : analysis.status;
      } else if (systolic < 90 || diastolic < 60) {
        analysis.flags.push('Low blood pressure');
        analysis.status = 'elevated';
      }
    }

    // Heart rate
    if (vitals.heart_rate) {
      const hr = vitals.heart_rate;
      if (hr > 100) {
        analysis.flags.push('Elevated heart rate');
        analysis.status = analysis.status === 'normal' ? 'elevated' : analysis.status;
      } else if (hr < 60) {
        analysis.flags.push('Low heart rate');
        analysis.status = analysis.status === 'normal' ? 'elevated' : analysis.status;
      }
    }

    // Temperature
    if (vitals.temperature) {
      const temp = vitals.temperature;
      if (temp > 38.0) {
        analysis.flags.push('Fever detected');
        analysis.status = 'elevated';
      }
    }

    // Oxygen saturation
    if (vitals.oxygen_saturation) {
      const spo2 = vitals.oxygen_saturation;
      if (spo2 < 95) {
        analysis.flags.push('Low oxygen saturation');
        analysis.status = 'critical';
      }
    }

    return analysis;
  }

  /**
   * Analyze symptoms
   */
  static _analyzeSymptoms(symptoms) {
    const analysis = {
      severity: 'mild',
      urgent_symptoms: [],
      general_symptoms: []
    };

    const urgentKeywords = [
      'chest pain', 'difficulty breathing', 'severe pain',
      'unconscious', 'severe bleeding', 'seizure'
    ];

    symptoms.forEach(symptom => {
      const lowerSymptom = symptom.toLowerCase();
      const isUrgent = urgentKeywords.some(keyword => lowerSymptom.includes(keyword));

      if (isUrgent) {
        analysis.urgent_symptoms.push(symptom);
        analysis.severity = 'critical';
      } else {
        analysis.general_symptoms.push(symptom);
        if (analysis.severity === 'mild') {
          analysis.severity = 'moderate';
        }
      }
    });

    return analysis;
  }

  /**
   * Determine overall risk level
   */
  static _determineRiskLevel(vitalsAnalysis, symptomsAnalysis) {
    if (vitalsAnalysis.status === 'critical' || symptomsAnalysis.severity === 'critical') {
      return 'critical';
    }
    if (vitalsAnalysis.status === 'elevated' || symptomsAnalysis.severity === 'moderate') {
      return 'high';
    }
    if (vitalsAnalysis.flags.length > 0 || symptomsAnalysis.general_symptoms.length > 0) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Generate recommendations
   */
  static _generateRecommendations(assessment) {
    const recommendations = [];

    if (assessment.vitals_analysis.flags.length > 0) {
      recommendations.push(
        `Vital signs flagged: ${assessment.vitals_analysis.flags.join(', ')}`
      );
    }

    if (assessment.symptoms_analysis.urgent_symptoms.length > 0) {
      recommendations.push(
        `Urgent symptoms detected: ${assessment.symptoms_analysis.urgent_symptoms.join(', ')}`
      );
    }

    if (assessment.risk_level === 'low') {
      recommendations.push('You are cleared to proceed with your visit.');
    } else if (assessment.risk_level === 'medium') {
      recommendations.push('Proceed with caution. Inform staff about your condition.');
    } else if (assessment.risk_level === 'high') {
      recommendations.push('Consider consulting with a doctor before your scheduled visit.');
    }

    return recommendations;
  }
}

