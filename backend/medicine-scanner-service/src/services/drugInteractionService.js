import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Drug Interaction Service
 * Checks for drug interactions with patient's medication history
 */
export class DrugInteractionService {
  /**
   * Check interactions with patient's current medications
   */
  static async checkInteractions(patientId, newMedicine) {
    try {
      // Get patient's current medications from scanned medicines
      const currentMedsResult = await query(
        `SELECT medicine_name, generic_name, dosage_info
         FROM scanned_medicines
         WHERE patient_id = $1
           AND created_at >= NOW() - INTERVAL '90 days'
         ORDER BY created_at DESC`,
        [patientId]
      );

      // Get active reminders (current medications)
      const activeRemindersResult = await query(
        `SELECT medicine_name, dosage
         FROM medicine_reminders
         WHERE patient_id = $1 AND is_active = TRUE`,
        [patientId]
      );

      const currentMedications = [
        ...currentMedsResult.rows.map(r => ({
          name: r.medicine_name || r.generic_name,
          dosage: r.dosage_info
        })),
        ...activeRemindersResult.rows.map(r => ({
          name: r.medicine_name,
          dosage: r.dosage
        }))
      ];

      // Check for known interactions
      const interactions = this._checkKnownInteractions(
        newMedicine.name || newMedicine.generic_name,
        currentMedications
      );

      return interactions;
    } catch (error) {
      logger.error('Drug interaction check error', { error: error.message });
      return {
        interactions: [],
        warning: 'Could not check interactions. Consult your doctor.'
      };
    }
  }

  /**
   * Check for known drug interactions
   */
  static _checkKnownInteractions(newMedicineName, currentMedications) {
    const interactions = [];
    const warnings = [];

    // Common interaction patterns (in production, use drug interaction database)
    const interactionDatabase = {
      'warfarin': {
        interactions: ['aspirin', 'ibuprofen', 'paracetamol'],
        severity: 'high',
        message: 'May increase risk of bleeding'
      },
      'aspirin': {
        interactions: ['ibuprofen', 'naproxen'],
        severity: 'medium',
        message: 'May increase risk of gastrointestinal bleeding'
      },
      'acetaminophen': {
        interactions: ['alcohol'],
        severity: 'high',
        message: 'May cause liver damage'
      },
      'metformin': {
        interactions: ['alcohol'],
        severity: 'high',
        message: 'May cause lactic acidosis'
      },
      'digoxin': {
        interactions: ['diuretics'],
        severity: 'high',
        message: 'May cause arrhythmia'
      }
    };

    const newMedLower = newMedicineName.toLowerCase();

    // Check if new medicine has known interactions
    Object.keys(interactionDatabase).forEach(med => {
      if (newMedLower.includes(med.toLowerCase())) {
        const interactionInfo = interactionDatabase[med];
        
        currentMedications.forEach(currentMed => {
          const currentMedLower = currentMed.name.toLowerCase();
          
          interactionInfo.interactions.forEach(interactingMed => {
            if (currentMedLower.includes(interactingMed.toLowerCase())) {
              interactions.push({
                medicine_1: newMedicineName,
                medicine_2: currentMed.name,
                severity: interactionInfo.severity,
                message: interactionInfo.message,
                recommendation: 'Consult your doctor before taking these medications together'
              });
            }
          });
        });
      }
    });

    // Check for duplicate medications
    currentMedications.forEach(currentMed => {
      const currentMedLower = currentMed.name.toLowerCase();
      if (newMedLower.includes(currentMedLower.substring(0, 5)) || 
          currentMedLower.includes(newMedLower.substring(0, 5))) {
        warnings.push({
          type: 'duplicate',
          message: `You may already be taking ${currentMed.name}`,
          recommendation: 'Check with your doctor if you need both medications'
        });
      }
    });

    return {
      interactions,
      warnings,
      has_interactions: interactions.length > 0,
      has_warnings: warnings.length > 0
    };
  }
}

