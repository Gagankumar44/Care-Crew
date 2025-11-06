import express from 'express';
import { query } from '../utils/db.js';
import crypto from 'crypto';

const router = express.Router();

// Share report with care circle member
router.post('/', async (req, res, next) => {
  try {
    const { patientId, reportType, reportId, sharedWithUserId, expiresInDays } = req.body;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Verify shared with user exists
    if (sharedWithUserId) {
      const sharedUserCheck = await query(
        'SELECT id FROM users WHERE id = $1',
        [sharedWithUserId]
      );
      
      if (sharedUserCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Shared user not found' });
      }
    }
    
    // Generate access token
    const accessToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = expiresInDays 
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days
    
    // Insert shared report
    const result = await query(
      `INSERT INTO shared_reports (
        patient_id, report_type, report_id, shared_with_user_id, access_token, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        patientId,
        reportType,
        reportId || null,
        sharedWithUserId || null,
        accessToken,
        expiresAt
      ]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        share_link: `/shared-reports/${accessToken}`,
        expires_at: expiresAt
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get shared reports for a patient
router.get('/patient/:patientId', async (req, res, next) => {
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
      `SELECT sr.*, u.email as shared_with_email
       FROM shared_reports sr
       LEFT JOIN users u ON sr.shared_with_user_id = u.id
       WHERE sr.patient_id = $1
       ORDER BY sr.created_at DESC`,
      [patientId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        is_expired: new Date(row.expires_at) < new Date()
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Get reports shared with me
router.get('/shared-with-me', async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    const result = await query(
      `SELECT sr.*, pp.id as patient_id, u.email as patient_email, u.first_name, u.last_name
       FROM shared_reports sr
       JOIN patient_profiles pp ON sr.patient_id = pp.id
       JOIN users u ON pp.user_id = u.id
       WHERE sr.shared_with_user_id = $1
         AND sr.expires_at > NOW()
       ORDER BY sr.created_at DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Access shared report via token
router.get('/token/:accessToken', async (req, res, next) => {
  try {
    const { accessToken } = req.params;
    
    const result = await query(
      `SELECT sr.*, pp.id as patient_id, u.email as patient_email, u.first_name, u.last_name
       FROM shared_reports sr
       JOIN patient_profiles pp ON sr.patient_id = pp.id
       JOIN users u ON pp.user_id = u.id
       WHERE sr.access_token = $1
         AND sr.expires_at > NOW()`,
      [accessToken]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shared report not found or expired' });
    }
    
    const report = result.rows[0];
    
    // Increment access count
    await query(
      'UPDATE shared_reports SET access_count = access_count + 1 WHERE id = $1',
      [report.id]
    );
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
});

// Revoke shared report
router.delete('/:reportId', async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { userId } = req.user;
    
    // Verify report belongs to user's patient
    const reportCheck = await query(
      `SELECT sr.* FROM shared_reports sr
       JOIN patient_profiles pp ON sr.patient_id = pp.id
       WHERE sr.id = $1 AND pp.user_id = $2`,
      [reportId, userId]
    );
    
    if (reportCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Shared report not found' });
    }
    
    await query('DELETE FROM shared_reports WHERE id = $1', [reportId]);
    
    res.json({ success: true, message: 'Shared report revoked' });
  } catch (error) {
    next(error);
  }
});

export { router as sharedReportsRouter };

