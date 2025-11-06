import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Body Scan Service
 * Handles 3D body scans, posture analysis, and skin lesion tracking
 */

export class BodyScanService {
  /**
   * Create a new body scan record
   */
  async createBodyScan(patientId, scanData) {
    const {
      scanType,
      meshDataUrl,
      referencePoints,
      measurements,
      comparisonData,
      aiAnalysis,
    } = scanData;

    const result = await query(
      `INSERT INTO body_scans (
        patient_id, scan_type, mesh_data_url, reference_points,
        measurements, comparison_data, ai_analysis
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        patientId,
        scanType,
        meshDataUrl,
        JSON.stringify(referencePoints || {}),
        JSON.stringify(measurements || {}),
        JSON.stringify(comparisonData || {}),
        JSON.stringify(aiAnalysis || {}),
      ]
    );

    return result.rows[0];
  }

  /**
   * Get all body scans for a patient
   */
  async getBodyScans(patientId, scanType = null) {
    let sql = 'SELECT * FROM body_scans WHERE patient_id = $1';
    const params = [patientId];

    if (scanType) {
      sql += ' AND scan_type = $2';
      params.push(scanType);
    }

    sql += ' ORDER BY created_at DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  /**
   * Get a specific body scan by ID
   */
  async getBodyScanById(scanId, patientId) {
    const result = await query(
      'SELECT * FROM body_scans WHERE id = $1 AND patient_id = $2',
      [scanId, patientId]
    );

    if (result.rows.length === 0) {
      throw new Error('Body scan not found');
    }

    return result.rows[0];
  }

  /**
   * Compare current scan with previous scans
   */
  async compareScans(patientId, currentScanId, scanType) {
    const previousScans = await query(
      `SELECT * FROM body_scans 
       WHERE patient_id = $1 
       AND scan_type = $2 
       AND id != $3
       ORDER BY created_at DESC 
       LIMIT 5`,
      [patientId, scanType, currentScanId]
    );

    const currentScan = await this.getBodyScanById(currentScanId, patientId);

    // Calculate differences
    const comparison = {
      previousScanCount: previousScans.rows.length,
      measurements: this.compareMeasurements(
        currentScan.measurements,
        previousScans.rows[0]?.measurements
      ),
      changes: this.detectChanges(currentScan, previousScans.rows[0]),
    };

    return comparison;
  }

  /**
   * Compare measurements between two scans
   */
  compareMeasurements(current, previous) {
    if (!previous) return { message: 'No previous scan for comparison' };

    const changes = {};
    const currentMeas = typeof current === 'string' ? JSON.parse(current) : current;
    const previousMeas = typeof previous === 'string' ? JSON.parse(previous) : previous;

    for (const key in currentMeas) {
      if (previousMeas[key] !== undefined) {
        const diff = currentMeas[key] - previousMeas[key];
        changes[key] = {
          current: currentMeas[key],
          previous: previousMeas[key],
          difference: diff,
          percentChange: ((diff / previousMeas[key]) * 100).toFixed(2),
        };
      }
    }

    return changes;
  }

  /**
   * Detect changes between scans
   */
  detectChanges(current, previous) {
    if (!previous) return [];

    const changes = [];
    const currentData = typeof current === 'object' ? current : JSON.parse(JSON.stringify(current));
    const previousData = typeof previous === 'object' ? previous : JSON.parse(JSON.stringify(previous));

    // Compare key metrics
    if (currentData.measurements && previousData.measurements) {
      const currentMeas = typeof currentData.measurements === 'string' 
        ? JSON.parse(currentData.measurements) 
        : currentData.measurements;
      const previousMeas = typeof previousData.measurements === 'string'
        ? JSON.parse(previousData.measurements)
        : previousData.measurements;

      for (const key in currentMeas) {
        if (previousMeas[key] !== undefined) {
          const diff = Math.abs(currentMeas[key] - previousMeas[key]);
          if (diff > 0.1) { // Threshold for significant change
            changes.push({
              metric: key,
              change: diff > 0 ? 'increase' : 'decrease',
              magnitude: diff,
            });
          }
        }
      }
    }

    return changes;
  }

  /**
   * Analyze posture from scan data
   */
  async analyzePosture(patientId, scanId) {
    const scan = await this.getBodyScanById(scanId, patientId);

    if (scan.scan_type !== 'posture') {
      throw new Error('Scan is not a posture scan');
    }

    const measurements = typeof scan.measurements === 'string'
      ? JSON.parse(scan.measurements)
      : scan.measurements;

    const analysis = {
      postureScore: this.calculatePostureScore(measurements),
      issues: this.detectPostureIssues(measurements),
      recommendations: this.generatePostureRecommendations(measurements),
      timestamp: new Date(),
    };

    // Update scan with analysis
    await query(
      `UPDATE body_scans 
       SET ai_analysis = $1 
       WHERE id = $2`,
      [JSON.stringify(analysis), scanId]
    );

    return analysis;
  }

  /**
   * Calculate posture score (0-100)
   */
  calculatePostureScore(measurements) {
    // Simplified posture scoring algorithm
    let score = 100;
    const issues = [];

    // Check alignment metrics
    if (measurements.shoulderAlignment) {
      const alignment = Math.abs(measurements.shoulderAlignment);
      if (alignment > 5) {
        score -= 15;
        issues.push('Shoulder misalignment detected');
      }
    }

    if (measurements.spineCurvature) {
      const curvature = Math.abs(measurements.spineCurvature);
      if (curvature > 10) {
        score -= 20;
        issues.push('Spine curvature detected');
      }
    }

    if (measurements.headPosition) {
      const position = Math.abs(measurements.headPosition);
      if (position > 3) {
        score -= 10;
        issues.push('Forward head posture');
      }
    }

    return Math.max(0, score);
  }

  /**
   * Detect posture issues
   */
  detectPostureIssues(measurements) {
    const issues = [];

    if (measurements.shoulderAlignment && Math.abs(measurements.shoulderAlignment) > 5) {
      issues.push({
        type: 'shoulder_misalignment',
        severity: 'moderate',
        description: 'Shoulders are not level',
      });
    }

    if (measurements.spineCurvature && Math.abs(measurements.spineCurvature) > 10) {
      issues.push({
        type: 'spine_curvature',
        severity: 'high',
        description: 'Abnormal spine curvature detected',
      });
    }

    return issues;
  }

  /**
   * Generate posture recommendations
   */
  generatePostureRecommendations(measurements) {
    const recommendations = [];

    if (measurements.shoulderAlignment && Math.abs(measurements.shoulderAlignment) > 5) {
      recommendations.push('Consider stretching exercises for shoulder alignment');
    }

    if (measurements.spineCurvature && Math.abs(measurements.spineCurvature) > 10) {
      recommendations.push('Consult with a physical therapist for spine health');
    }

    if (measurements.headPosition && Math.abs(measurements.headPosition) > 3) {
      recommendations.push('Practice exercises to correct forward head posture');
    }

    return recommendations.length > 0
      ? recommendations
      : ['Your posture looks good! Continue maintaining good posture habits.'];
  }
}

export default new BodyScanService();

