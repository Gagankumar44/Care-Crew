import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { query } from '../utils/db.js';
import { PreCheckService } from '../services/preCheckService.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Create digital lobby session
router.post('/session', async (req, res, next) => {
  try {
    const { patientId, hospitalId, doctorId } = req.body;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Generate queue token
    const queueToken = crypto.randomBytes(8).toString('hex').toUpperCase();
    
    // Create session
    const result = await query(
      `INSERT INTO digital_lobby_sessions (
        patient_id, hospital_id, doctor_id, status, queue_token
      )
      VALUES ($1, $2, $3, 'pending', $4)
      RETURNING *`,
      [patientId, hospitalId || null, doctorId || null, queueToken]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        queue_token: queueToken
      }
    });
  } catch (error) {
    next(error);
  }
});

// Perform pre-check health assessment
router.post('/session/:sessionId/pre-check', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { vitals, symptoms } = req.body;
    const { userId } = req.user;
    
    // Verify session belongs to user
    const sessionCheck = await query(
      `SELECT dls.* FROM digital_lobby_sessions dls
       JOIN patient_profiles pp ON dls.patient_id = pp.id
       WHERE dls.id = $1 AND pp.user_id = $2`,
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Perform pre-check analysis
    const preCheckResult = await PreCheckService.performPreCheck(vitals, symptoms);
    
    // Update session
    const result = await query(
      `UPDATE digital_lobby_sessions 
       SET pre_check_data = $1, status = 'pre_checked'
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(preCheckResult), sessionId]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        pre_check_data: preCheckResult
      }
    });
  } catch (error) {
    next(error);
  }
});

// Submit form data
router.post('/session/:sessionId/form', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { formData } = req.body;
    const { userId } = req.user;
    
    // Verify session belongs to user
    const sessionCheck = await query(
      `SELECT dls.* FROM digital_lobby_sessions dls
       JOIN patient_profiles pp ON dls.patient_id = pp.id
       WHERE dls.id = $1 AND pp.user_id = $2`,
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Update session with form data
    const result = await query(
      `UPDATE digital_lobby_sessions 
       SET form_data = $1
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(formData), sessionId]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        form_data: formData
      }
    });
  } catch (error) {
    next(error);
  }
});

// Upload reports
router.post('/session/:sessionId/reports', upload.array('reports'), async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.user;
    
    // Verify session belongs to user
    const sessionCheck = await query(
      `SELECT dls.* FROM digital_lobby_sessions dls
       JOIN patient_profiles pp ON dls.patient_id = pp.id
       WHERE dls.id = $1 AND pp.user_id = $2`,
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Store report URLs (in production, upload to cloud storage)
    const reportUrls = req.files.map(file => ({
      filename: file.originalname,
      url: `reports/${Date.now()}_${file.originalname}`,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    // Get existing reports
    const existingReports = sessionCheck.rows[0].uploaded_reports 
      ? (typeof sessionCheck.rows[0].uploaded_reports === 'string' 
          ? JSON.parse(sessionCheck.rows[0].uploaded_reports) 
          : sessionCheck.rows[0].uploaded_reports)
      : [];
    
    const allReports = [...existingReports, ...reportUrls];
    
    // Update session
    const result = await query(
      `UPDATE digital_lobby_sessions 
       SET uploaded_reports = $1
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(allReports), sessionId]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        uploaded_reports: allReports
      }
    });
  } catch (error) {
    next(error);
  }
});

// Complete session and get queue token
router.post('/session/:sessionId/complete', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.user;
    
    // Verify session belongs to user
    const sessionCheck = await query(
      `SELECT dls.* FROM digital_lobby_sessions dls
       JOIN patient_profiles pp ON dls.patient_id = pp.id
       WHERE dls.id = $1 AND pp.user_id = $2`,
      [sessionId, userId]
    );
    
    if (sessionCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const session = sessionCheck.rows[0];
    
    // Check if pre-check completed
    if (!session.pre_check_data) {
      return res.status(400).json({ error: 'Pre-check not completed' });
    }
    
    // Update status to in_queue
    const result = await query(
      `UPDATE digital_lobby_sessions 
       SET status = 'in_queue'
       WHERE id = $1
       RETURNING *`,
      [sessionId]
    );
    
    // If doctor assigned, add to walk-in queue
    if (session.doctor_id) {
      // Add to queue (would integrate with doctor-queue-service)
      // For now, just return session info
    }
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        queue_token: session.queue_token,
        message: 'Session completed. You are now in queue.'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get session status
router.get('/session/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.user;
    
    const result = await query(
      `SELECT dls.* FROM digital_lobby_sessions dls
       JOIN patient_profiles pp ON dls.patient_id = pp.id
       WHERE dls.id = $1 AND pp.user_id = $2`,
      [sessionId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        ...row,
        pre_check_data: typeof row.pre_check_data === 'string' 
          ? JSON.parse(row.pre_check_data) 
          : row.pre_check_data,
        form_data: typeof row.form_data === 'string' 
          ? JSON.parse(row.form_data) 
          : row.form_data,
        uploaded_reports: typeof row.uploaded_reports === 'string' 
          ? JSON.parse(row.uploaded_reports) 
          : row.uploaded_reports
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get session by queue token
router.get('/token/:queueToken', async (req, res, next) => {
  try {
    const { queueToken } = req.params;
    
    const result = await query(
      `SELECT dls.*, pp.user_id
       FROM digital_lobby_sessions dls
       JOIN patient_profiles pp ON dls.patient_id = pp.id
       WHERE dls.queue_token = $1`,
      [queueToken]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        ...row,
        pre_check_data: typeof row.pre_check_data === 'string' 
          ? JSON.parse(row.pre_check_data) 
          : row.pre_check_data,
        form_data: typeof row.form_data === 'string' 
          ? JSON.parse(row.form_data) 
          : row.form_data,
        uploaded_reports: typeof row.uploaded_reports === 'string' 
          ? JSON.parse(row.uploaded_reports) 
          : row.uploaded_reports
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as lobbyRouter };

