import express from 'express';
import { query } from '../utils/db.js';
import { HealthScoreCalculator } from '../services/healthScoreCalculator.js';

const router = express.Router();

// Calculate health score for a patient
router.post('/calculate/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Calculate health score
    const scoreResult = await HealthScoreCalculator.calculateScore(patientId);
    
    // Save to database
    const result = await query(
      `INSERT INTO health_performance_scores (
        patient_id, overall_score, activity_score, sleep_score, stress_score,
        labs_score, lifestyle_score, preventive_scans_score, breakdown, badges
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        patientId,
        scoreResult.overall_score,
        scoreResult.activity_score,
        scoreResult.sleep_score,
        scoreResult.stress_score,
        scoreResult.labs_score,
        scoreResult.lifestyle_score,
        scoreResult.preventive_scans_score,
        JSON.stringify(scoreResult.breakdown),
        JSON.stringify(scoreResult.badges)
      ]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        breakdown: scoreResult.breakdown,
        badges: scoreResult.badges
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get latest health score
router.get('/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const result = await query(
      `SELECT overall_score, activity_score, sleep_score, stress_score,
              labs_score, lifestyle_score, preventive_scans_score,
              breakdown, badges, calculated_at
       FROM health_performance_scores
       WHERE patient_id = $1
       ORDER BY calculated_at DESC
       LIMIT 1`,
      [patientId]
    );
    
    if (result.rows.length === 0) {
      // Calculate if no score exists
      const scoreResult = await HealthScoreCalculator.calculateScore(patientId);
      return res.json({
        success: true,
        data: {
          ...scoreResult,
          calculated_at: new Date()
        }
      });
    }
    
    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        ...row,
        breakdown: typeof row.breakdown === 'string' 
          ? JSON.parse(row.breakdown) 
          : row.breakdown,
        badges: typeof row.badges === 'string' 
          ? JSON.parse(row.badges) 
          : row.badges
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get score history
router.get('/:patientId/history', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user;
    const { limit = 30 } = req.query;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const result = await query(
      `SELECT overall_score, activity_score, sleep_score, stress_score,
              labs_score, lifestyle_score, preventive_scans_score,
              calculated_at
       FROM health_performance_scores
       WHERE patient_id = $1
       ORDER BY calculated_at DESC
       LIMIT $2`,
      [patientId, parseInt(limit)]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

export { router as scoreRouter };

