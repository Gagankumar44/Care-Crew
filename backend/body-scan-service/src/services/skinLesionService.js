import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Skin Lesion Service
 * Tracks skin lesions over time using AR camera analysis
 */

export class SkinLesionService {
  /**
   * Create a new skin lesion record
   */
  async createSkinLesion(patientId, lesionData) {
    const {
      bodyPart,
      location,
      imageUrl,
      measurements,
      characteristics,
      aiAnalysis,
      riskLevel,
    } = lesionData;

    const result = await query(
      `INSERT INTO skin_lesions (
        patient_id, body_part, location, image_url,
        measurements, characteristics, ai_analysis, risk_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        patientId,
        bodyPart,
        JSON.stringify(location || {}),
        imageUrl,
        JSON.stringify(measurements || {}),
        JSON.stringify(characteristics || {}),
        JSON.stringify(aiAnalysis || {}),
        riskLevel || 'low',
      ]
    );

    return result.rows[0];
  }

  /**
   * Get all skin lesions for a patient
   */
  async getSkinLesions(patientId) {
    const result = await query(
      'SELECT * FROM skin_lesions WHERE patient_id = $1 ORDER BY created_at DESC',
      [patientId]
    );

    return result.rows;
  }

  /**
   * Get a specific skin lesion by ID
   */
  async getSkinLesionById(lesionId, patientId) {
    const result = await query(
      'SELECT * FROM skin_lesions WHERE id = $1 AND patient_id = $2',
      [lesionId, patientId]
    );

    if (result.rows.length === 0) {
      throw new Error('Skin lesion not found');
    }

    return result.rows[0];
  }

  /**
   * Update skin lesion record
   */
  async updateSkinLesion(lesionId, patientId, updateData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.imageUrl) {
      fields.push(`image_url = $${paramIndex++}`);
      values.push(updateData.imageUrl);
    }

    if (updateData.measurements) {
      fields.push(`measurements = $${paramIndex++}`);
      values.push(JSON.stringify(updateData.measurements));
    }

    if (updateData.characteristics) {
      fields.push(`characteristics = $${paramIndex++}`);
      values.push(JSON.stringify(updateData.characteristics));
    }

    if (updateData.aiAnalysis) {
      fields.push(`ai_analysis = $${paramIndex++}`);
      values.push(JSON.stringify(updateData.aiAnalysis));
    }

    if (updateData.riskLevel) {
      fields.push(`risk_level = $${paramIndex++}`);
      values.push(updateData.riskLevel);
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(lesionId, patientId);

    const result = await query(
      `UPDATE skin_lesions 
       SET ${fields.join(', ')} 
       WHERE id = $${paramIndex++} AND patient_id = $${paramIndex++}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Skin lesion not found');
    }

    return result.rows[0];
  }

  /**
   * Track changes in a skin lesion over time
   */
  async trackLesionChanges(lesionId, patientId) {
    const lesion = await this.getSkinLesionById(lesionId, patientId);

    // Get all previous records of this lesion (same location)
    const location = typeof lesion.location === 'string'
      ? JSON.parse(lesion.location)
      : lesion.location;

    const previousRecords = await query(
      `SELECT * FROM skin_lesions 
       WHERE patient_id = $1 
       AND body_part = $2
       AND id != $3
       AND location @> $4
       ORDER BY created_at DESC`,
      [patientId, lesion.body_part, lesionId, JSON.stringify(location)]
    );

    const changes = {
      lesionId,
      trackingHistory: previousRecords.rows.length,
      sizeChanges: this.compareSize(lesion, previousRecords.rows),
      characteristicsChanges: this.compareCharacteristics(lesion, previousRecords.rows),
      riskChanges: this.compareRisk(lesion, previousRecords.rows),
    };

    return changes;
  }

  /**
   * Compare size changes
   */
  compareSize(current, previous) {
    if (previous.length === 0) return null;

    const currentMeas = typeof current.measurements === 'string'
      ? JSON.parse(current.measurements)
      : current.measurements;
    const previousMeas = typeof previous[0].measurements === 'string'
      ? JSON.parse(previous[0].measurements)
      : previous[0].measurements;

    if (!currentMeas || !previousMeas) return null;

    const changes = {};

    if (currentMeas.diameter && previousMeas.diameter) {
      const diff = currentMeas.diameter - previousMeas.diameter;
      changes.diameter = {
        current: currentMeas.diameter,
        previous: previousMeas.diameter,
        difference: diff,
        percentChange: previousMeas.diameter > 0
          ? ((diff / previousMeas.diameter) * 100).toFixed(2)
          : 0,
      };
    }

    return changes;
  }

  /**
   * Compare characteristics changes
   */
  compareCharacteristics(current, previous) {
    if (previous.length === 0) return [];

    const currentChar = typeof current.characteristics === 'string'
      ? JSON.parse(current.characteristics)
      : current.characteristics;
    const previousChar = typeof previous[0].characteristics === 'string'
      ? JSON.parse(previous[0].characteristics)
      : previous[0].characteristics;

    const changes = [];

    // Compare color, shape, etc.
    if (currentChar && previousChar) {
      if (currentChar.color !== previousChar.color) {
        changes.push({
          attribute: 'color',
          from: previousChar.color,
          to: currentChar.color,
        });
      }

      if (currentChar.shape !== previousChar.shape) {
        changes.push({
          attribute: 'shape',
          from: previousChar.shape,
          to: currentChar.shape,
        });
      }
    }

    return changes;
  }

  /**
   * Compare risk level changes
   */
  compareRisk(current, previous) {
    if (previous.length === 0) return null;

    const riskLevels = ['low', 'medium', 'high', 'critical'];
    const currentIndex = riskLevels.indexOf(current.risk_level);
    const previousIndex = riskLevels.indexOf(previous[0].risk_level);

    if (currentIndex === -1 || previousIndex === -1) return null;

    return {
      current: current.risk_level,
      previous: previous[0].risk_level,
      increased: currentIndex > previousIndex,
      decreased: currentIndex < previousIndex,
    };
  }

  /**
   * Analyze lesion for risk assessment
   */
  async analyzeLesionRisk(lesionId, patientId) {
    const lesion = await this.getSkinLesionById(lesionId, patientId);

    const measurements = typeof lesion.measurements === 'string'
      ? JSON.parse(lesion.measurements)
      : lesion.measurements;
    const characteristics = typeof lesion.characteristics === 'string'
      ? JSON.parse(lesion.characteristics)
      : lesion.characteristics;

    // ABCDE rule for melanoma detection
    const analysis = {
      riskLevel: this.calculateRiskLevel(measurements, characteristics),
      factors: this.identifyRiskFactors(measurements, characteristics),
      recommendation: this.generateRecommendation(measurements, characteristics),
      timestamp: new Date(),
    };

    // Update lesion with analysis
    await query(
      `UPDATE skin_lesions 
       SET ai_analysis = $1, risk_level = $2 
       WHERE id = $3`,
      [JSON.stringify(analysis), analysis.riskLevel, lesionId]
    );

    return analysis;
  }

  /**
   * Calculate risk level using ABCDE rule
   */
  calculateRiskLevel(measurements, characteristics) {
    let riskScore = 0;

    // Asymmetry
    if (characteristics?.asymmetry) riskScore += 2;

    // Border irregularity
    if (characteristics?.borderIrregular) riskScore += 2;

    // Color variation
    if (characteristics?.colorVariation) riskScore += 2;

    // Diameter (>6mm)
    if (measurements?.diameter && measurements.diameter > 6) riskScore += 2;

    // Evolution (tracked through changes)
    if (characteristics?.evolving) riskScore += 2;

    if (riskScore >= 8) return 'critical';
    if (riskScore >= 6) return 'high';
    if (riskScore >= 4) return 'medium';
    return 'low';
  }

  /**
   * Identify risk factors
   */
  identifyRiskFactors(measurements, characteristics) {
    const factors = [];

    if (characteristics?.asymmetry) {
      factors.push('Asymmetric shape detected');
    }

    if (measurements?.diameter && measurements.diameter > 6) {
      factors.push('Diameter exceeds 6mm');
    }

    if (characteristics?.colorVariation) {
      factors.push('Multiple colors detected');
    }

    return factors;
  }

  /**
   * Generate recommendation
   */
  generateRecommendation(measurements, characteristics) {
    const riskLevel = this.calculateRiskLevel(measurements, characteristics);

    if (riskLevel === 'critical' || riskLevel === 'high') {
      return 'Consult with a dermatologist immediately for professional evaluation';
    }

    if (riskLevel === 'medium') {
      return 'Monitor closely and consider scheduling a dermatologist appointment';
    }

    return 'Continue monitoring. No immediate concerns detected.';
  }
}

export default new SkinLesionService();

