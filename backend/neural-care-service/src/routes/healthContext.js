import express from 'express';
import { PatternDetectionService } from '../services/patternDetectionService.js';
import { query } from '../utils/db.js';

const router = express.Router();

// Get health context memory for a patient
router.get('/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user; // From auth middleware
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const result = await query(
      `SELECT id, context_type, context_data, confidence_score, created_at, updated_at
       FROM health_context_memory
       WHERE patient_id = $1
       ORDER BY updated_at DESC`,
      [patientId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        context_data: typeof row.context_data === 'string' 
          ? JSON.parse(row.context_data) 
          : row.context_data
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Trigger pattern detection
router.post('/:patientId/detect-patterns', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user;
    const { days = 30 } = req.body;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Detect all patterns
    const [symptomPatterns, vitalTrends, sleepPatterns, stressPatterns] = await Promise.all([
      PatternDetectionService.detectSymptomPatterns(patientId, days),
      PatternDetectionService.detectVitalTrends(patientId, days),
      PatternDetectionService.detectSleepPatterns(patientId, days),
      PatternDetectionService.detectStressPatterns(patientId, days)
    ]);
    
    // Generate proactive alerts
    const alerts = await PatternDetectionService.generateProactiveAlerts(patientId);
    
    res.json({
      success: true,
      data: {
        symptom_patterns: symptomPatterns,
        vital_trends: vitalTrends,
        sleep_patterns: sleepPatterns,
        stress_patterns: stressPatterns,
        alerts_generated: alerts.length
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as healthContextRouter };

