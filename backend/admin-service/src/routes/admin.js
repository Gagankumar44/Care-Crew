import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  getStateAdminByUserId,
  createStateAdmin,
  getStateHospitals,
  logHospitalControlAction,
  getStateSettings,
  updateStateSettings,
  getHospitalControlLogs,
} from '../services/adminService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * Get current admin info
 */
router.get('/me', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const admin = await getStateAdminByUserId(req.user.id);
    if (!admin) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Admin not found',
        },
      });
    }
    res.json({ data: admin });
  } catch (error) {
    next(error);
  }
});

/**
 * Create state admin (super admin only)
 */
router.post('/', authMiddleware, requireRole('admin'), async (req, res, next) => {
  try {
    const { userId, stateCode, stateName, permissions } = req.body;
    
    if (!userId || !stateCode || !stateName) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields: userId, stateCode, stateName',
        },
      });
    }
    
    const admin = await createStateAdmin(userId, stateCode, stateName, permissions);
    res.status(201).json({ data: admin });
  } catch (error) {
    next(error);
  }
});

/**
 * Get hospitals in state
 */
router.get('/hospitals', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const admin = await getStateAdminByUserId(req.user.id);
    if (!admin) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Admin not found',
        },
      });
    }
    
    const hospitals = await getStateHospitals(admin.state_code);
    res.json({ data: hospitals });
  } catch (error) {
    next(error);
  }
});

/**
 * Get state settings
 */
router.get('/settings', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const admin = await getStateAdminByUserId(req.user.id);
    if (!admin) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Admin not found',
        },
      });
    }
    
    const settings = await getStateSettings(admin.state_code);
    res.json({ data: settings });
  } catch (error) {
    next(error);
  }
});

/**
 * Update state settings
 */
router.put('/settings', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const admin = await getStateAdminByUserId(req.user.id);
    if (!admin) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Admin not found',
        },
      });
    }
    
    const { settings } = req.body;
    if (!settings) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing settings',
        },
      });
    }
    
    const updated = await updateStateSettings(admin.state_code, settings);
    res.json({ data: updated });
  } catch (error) {
    next(error);
  }
});

/**
 * Get control logs
 */
router.get('/logs', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const admin = await getStateAdminByUserId(req.user.id);
    if (!admin) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Admin not found',
        },
      });
    }
    
    const limit = parseInt(req.query.limit) || 100;
    const logs = await getHospitalControlLogs(admin.id, limit);
    res.json({ data: logs });
  } catch (error) {
    next(error);
  }
});

/**
 * Control hospital action
 */
router.post('/hospitals/:hospitalId/control', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const admin = await getStateAdminByUserId(req.user.id);
    if (!admin) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Admin not found',
        },
      });
    }
    
    const { hospitalId } = req.params;
    const { action, details } = req.body;
    
    if (!action) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing action',
        },
      });
    }
    
    const log = await logHospitalControlAction(admin.id, hospitalId, action, details);
    res.status(201).json({ data: log });
  } catch (error) {
    next(error);
  }
});

export { router as adminRouter };

