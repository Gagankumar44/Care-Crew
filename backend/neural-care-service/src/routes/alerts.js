import express from 'express';
import { query } from '../utils/db.js';
import { PatternDetectionService } from '../services/patternDetectionService.js';

const router = express.Router();

// Get all alerts for a patient
router.get('/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user;
    const { acknowledged, severity } = req.query;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    let queryText = `
      SELECT id, alert_type, severity, title, message, context_data, 
             acknowledged, acknowledged_at, created_at
      FROM health_alerts
      WHERE patient_id = $1
    `;
    const params = [patientId];
    let paramIndex = 2;
    
    if (acknowledged !== undefined) {
      queryText += ` AND acknowledged = $${paramIndex}`;
      params.push(acknowledged === 'true');
      paramIndex++;
    }
    
    if (severity) {
      queryText += ` AND severity = $${paramIndex}`;
      params.push(severity);
      paramIndex++;
    }
    
    queryText += ' ORDER BY created_at DESC LIMIT 50';
    
    const result = await query(queryText, params);
    
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

// Acknowledge an alert
router.post('/:alertId/acknowledge', async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const { userId } = req.user;
    
    // Verify alert belongs to user's patient
    const alertCheck = await query(
      `SELECT ha.id FROM health_alerts ha
       JOIN patient_profiles pp ON ha.patient_id = pp.id
       WHERE ha.id = $1 AND pp.user_id = $2`,
      [alertId, userId]
    );
    
    if (alertCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    await query(
      'UPDATE health_alerts SET acknowledged = TRUE, acknowledged_at = NOW() WHERE id = $1',
      [alertId]
    );
    
    res.json({ success: true, message: 'Alert acknowledged' });
  } catch (error) {
    next(error);
  }
});

// Trigger alert generation
router.post('/:patientId/generate', async (req, res, next) => {
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
    
    const alerts = await PatternDetectionService.generateProactiveAlerts(patientId);
    
    res.json({
      success: true,
      data: {
        alerts_generated: alerts.length,
        alerts: alerts
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as alertsRouter };

