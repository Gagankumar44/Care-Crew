import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * SOAP Notes Generator
 */
class SOAPNotesGenerator {
  static convertToSOAP(transcript) {
    const soap = {
      subjective: this._extractSubjective(transcript),
      objective: this._extractObjective(transcript),
      assessment: this._extractAssessment(transcript),
      plan: this._extractPlan(transcript),
    };

    return soap;
  }

  static _extractSubjective(text) {
    const lowerText = text.toLowerCase();
    const subjective = [];
    
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

    if (subjective.length === 0) {
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      subjective.push(...sentences.slice(0, 3));
    }

    return subjective.join(' ').trim() || text;
  }

  static _extractObjective(text) {
    const lowerText = text.toLowerCase();
    const objective = [];
    
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

  static _extractAssessment(text) {
    const lowerText = text.toLowerCase();
    const assessment = [];
    
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

    const icdPattern = /[A-Z]\d{2}\.?\d*/gi;
    const icdMatches = text.match(icdPattern);
    if (icdMatches) {
      assessment.push(`ICD codes: ${icdMatches.join(', ')}`);
    }

    return assessment.join('; ').trim() || 'Assessment pending';
  }

  static _extractPlan(text) {
    const lowerText = text.toLowerCase();
    const plan = [];
    
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

    const medicationPattern = /(?:prescribe|prescription|take|give)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
    const medMatches = [...text.matchAll(medicationPattern)];
    if (medMatches.length > 0) {
      plan.push(`Medications: ${medMatches.map(m => m[1]).join(', ')}`);
    }

    return plan.join('; ').trim() || 'Plan pending';
  }
}

/**
 * Doctor Co-Pilot Service
 * Handles AI-generated SOAP notes, prescription suggestions, and risk alerts
 */

export class DoctorCoPilotService {
  /**
   * Create AI-generated notes from audio transcript
   */
  async createAIDoctorNotes(consultationId, doctorId, patientId, audioTranscript) {
    // Generate SOAP notes from transcript
    const soapNotes = SOAPNotesGenerator.convertToSOAP(audioTranscript);

    // Generate prescription suggestions
    const prescriptionSuggestions = this.generatePrescriptionSuggestions(soapNotes);

    // Generate risk alerts based on patient history
    const riskAlerts = await this.generateRiskAlerts(patientId, soapNotes);

    const result = await query(
      `INSERT INTO ai_doctor_notes (
        consultation_id, doctor_id, patient_id, audio_transcript,
        auto_soap_notes, prescription_suggestions, risk_alerts
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        consultationId,
        doctorId,
        patientId,
        audioTranscript,
        JSON.stringify(soapNotes),
        JSON.stringify(prescriptionSuggestions),
        JSON.stringify(riskAlerts),
      ]
    );

    return result.rows[0];
  }

  /**
   * Get AI notes by consultation ID
   */
  async getAIDoctorNotes(consultationId, doctorId) {
    const result = await query(
      `SELECT * FROM ai_doctor_notes 
       WHERE consultation_id = $1 AND (doctor_id = $2 OR $2 IS NULL)
       ORDER BY created_at DESC
       LIMIT 1`,
      [consultationId, doctorId]
    );

    if (result.rows.length === 0) {
      throw new Error('AI doctor notes not found');
    }

    return result.rows[0];
  }

  /**
   * Get all notes for a doctor
   */
  async getDoctorNotes(doctorId, limit = 50, offset = 0) {
    const result = await query(
      `SELECT * FROM ai_doctor_notes 
       WHERE doctor_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [doctorId, limit, offset]
    );

    return result.rows;
  }

  /**
   * Get all notes for a patient
   */
  async getPatientNotes(patientId, limit = 50, offset = 0) {
    const result = await query(
      `SELECT * FROM ai_doctor_notes 
       WHERE patient_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [patientId, limit, offset]
    );

    return result.rows;
  }

  /**
   * Approve AI notes (doctor reviews and approves)
   */
  async approveNotes(noteId, doctorId, editedNotes = null) {
    const updateFields = ['doctor_approved = TRUE', 'updated_at = NOW()'];
    const values = [];
    let paramIndex = 1;

    if (editedNotes) {
      updateFields.push(`doctor_edited_notes = $${paramIndex++}`);
      values.push(JSON.stringify(editedNotes));
    }

    values.push(noteId, doctorId);

    const result = await query(
      `UPDATE ai_doctor_notes 
       SET ${updateFields.join(', ')} 
       WHERE id = $${paramIndex++} AND doctor_id = $${paramIndex++}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('AI doctor notes not found');
    }

    return result.rows[0];
  }

  /**
   * Update notes with doctor edits
   */
  async updateNotes(noteId, doctorId, updates) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updates.autoSoapNotes) {
      fields.push(`auto_soap_notes = $${paramIndex++}`);
      values.push(JSON.stringify(updates.autoSoapNotes));
    }

    if (updates.prescriptionSuggestions) {
      fields.push(`prescription_suggestions = $${paramIndex++}`);
      values.push(JSON.stringify(updates.prescriptionSuggestions));
    }

    if (updates.riskAlerts) {
      fields.push(`risk_alerts = $${paramIndex++}`);
      values.push(JSON.stringify(updates.riskAlerts));
    }

    if (updates.doctorEditedNotes) {
      fields.push(`doctor_edited_notes = $${paramIndex++}`);
      values.push(JSON.stringify(updates.doctorEditedNotes));
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(noteId, doctorId);

    const result = await query(
      `UPDATE ai_doctor_notes 
       SET ${fields.join(', ')} 
       WHERE id = $${paramIndex++} AND doctor_id = $${paramIndex++}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('AI doctor notes not found');
    }

    return result.rows[0];
  }

  /**
   * Generate prescription suggestions based on SOAP notes
   */
  generatePrescriptionSuggestions(soapNotes) {
    const suggestions = [];

    // Analyze assessment and plan to suggest medications
    const assessment = typeof soapNotes.assessment === 'string'
      ? soapNotes.assessment
      : JSON.stringify(soapNotes.assessment);
    const plan = typeof soapNotes.plan === 'string'
      ? soapNotes.plan
      : JSON.stringify(soapNotes.plan);

    const lowerText = (assessment + ' ' + plan).toLowerCase();

    // Simple medication suggestions based on conditions
    if (lowerText.includes('hypertension') || lowerText.includes('high blood pressure')) {
      suggestions.push({
        medication: 'Lisinopril',
        dosage: '10mg daily',
        reason: 'ACE inhibitor for hypertension',
        confidence: 'medium',
      });
    }

    if (lowerText.includes('diabetes') || lowerText.includes('blood sugar')) {
      suggestions.push({
        medication: 'Metformin',
        dosage: '500mg twice daily',
        reason: 'First-line treatment for type 2 diabetes',
        confidence: 'medium',
      });
    }

    if (lowerText.includes('pain') || lowerText.includes('ache')) {
      suggestions.push({
        medication: 'Ibuprofen',
        dosage: '400mg every 6-8 hours',
        reason: 'NSAID for pain management',
        confidence: 'low',
      });
    }

    if (lowerText.includes('infection') || lowerText.includes('bacterial')) {
      suggestions.push({
        medication: 'Amoxicillin',
        dosage: '500mg three times daily',
        reason: 'Broad-spectrum antibiotic',
        confidence: 'low',
        note: 'Confirm bacterial infection before prescribing',
      });
    }

    if (lowerText.includes('anxiety') || lowerText.includes('stress')) {
      suggestions.push({
        medication: 'Sertraline',
        dosage: '50mg daily',
        reason: 'SSRI for anxiety',
        confidence: 'low',
        note: 'Requires psychiatric evaluation',
      });
    }

    return suggestions;
  }

  /**
   * Generate risk alerts based on patient history
   */
  async generateRiskAlerts(patientId, soapNotes) {
    const alerts = [];

    // Check patient's medication history for interactions
    const medicationHistory = await this.getPatientMedicationHistory(patientId);
    const suggestedMeds = this.extractMedicationsFromSOAP(soapNotes);

    // Check for drug interactions
    for (const suggestedMed of suggestedMeds) {
      for (const currentMed of medicationHistory) {
        const interaction = this.checkDrugInteraction(suggestedMed, currentMed);
        if (interaction) {
          alerts.push({
            type: 'drug_interaction',
            severity: 'high',
            message: `Potential interaction between ${suggestedMed} and ${currentMed.name}`,
            details: interaction,
          });
        }
      }
    }

    // Check for allergies
    const allergies = await this.getPatientAllergies(patientId);
    for (const med of suggestedMeds) {
      if (allergies.some(allergy => med.toLowerCase().includes(allergy.toLowerCase()))) {
        alerts.push({
          type: 'allergy',
          severity: 'critical',
          message: `Patient has allergy to ${med}`,
          action: 'DO NOT PRESCRIBE',
        });
      }
    }

    // Check for contraindications based on conditions
    const conditions = await this.getPatientConditions(patientId);
    for (const med of suggestedMeds) {
      const contraindications = this.checkContraindications(med, conditions);
      if (contraindications.length > 0) {
        alerts.push({
          type: 'contraindication',
          severity: 'high',
          message: `${med} may be contraindicated`,
          details: contraindications,
        });
      }
    }

    return alerts;
  }

  /**
   * Get patient medication history
   */
  async getPatientMedicationHistory(patientId) {
    // Query patient_data_service or health_data for medication history
    // For now, return empty array
    return [];
  }

  /**
   * Extract medications from SOAP notes
   */
  extractMedicationsFromSOAP(soapNotes) {
    const medications = [];
    const plan = typeof soapNotes.plan === 'string'
      ? soapNotes.plan
      : JSON.stringify(soapNotes.plan);

    // Simple pattern matching for medication names
    const medPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    const matches = plan.match(medPattern);

    if (matches) {
      medications.push(...matches.filter(m => m.length > 3));
    }

    return medications;
  }

  /**
   * Check for drug interactions (simplified)
   */
  checkDrugInteraction(med1, med2) {
    // Simplified interaction checker
    // In production, use a drug interaction database
    const knownInteractions = {
      'warfarin': ['aspirin', 'ibuprofen', 'naproxen'],
      'aspirin': ['warfarin', 'ibuprofen'],
    };

    const med1Lower = med1.toLowerCase();
    const med2Lower = med2.name?.toLowerCase() || med2.toLowerCase();

    if (knownInteractions[med1Lower]?.includes(med2Lower)) {
      return {
        interaction: 'Increased bleeding risk',
        severity: 'high',
      };
    }

    return null;
  }

  /**
   * Get patient allergies
   */
  async getPatientAllergies(patientId) {
    // Query patient profile for allergies
    // For now, return empty array
    return [];
  }

  /**
   * Get patient conditions
   */
  async getPatientConditions(patientId) {
    // Query patient profile for conditions
    // For now, return empty array
    return [];
  }

  /**
   * Check contraindications
   */
  checkContraindications(medication, conditions) {
    const contraindications = [];

    // Simplified contraindication checker
    if (medication.toLowerCase().includes('ace') && conditions.includes('pregnancy')) {
      contraindications.push('ACE inhibitors contraindicated in pregnancy');
    }

    return contraindications;
  }
}

export default new DoctorCoPilotService();

