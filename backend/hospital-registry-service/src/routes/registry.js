import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  getAllHospitals,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital,
  logRegistryAction,
  createInspection,
  getHospitalStatistics,
} from '../services/registryService.js';

const router = express.Router();

/**
 * Get all hospitals
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      stateCode: req.query.stateCode,
      city: req.query.city,
      status: req.query.status,
      type: req.query.type,
    };
    
    const hospitals = await getAllHospitals(filters);
    res.json({ data: hospitals });
  } catch (error) {
    next(error);
  }
});

/**
 * Get hospital statistics
 */
router.get('/statistics', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      stateCode: req.query.stateCode,
    };
    
    const stats = await getHospitalStatistics(filters);
    res.json({ data: stats });
  } catch (error) {
    next(error);
  }
});

/**
 * Get hospital by ID
 */
router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const hospital = await getHospitalById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Hospital not found',
        },
      });
    }
    res.json({ data: hospital });
  } catch (error) {
    next(error);
  }
});

/**
 * Create hospital (admin only)
 */
router.post('/', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const hospital = await createHospital(req.body);
    
    // Log the action
    await logRegistryAction(hospital.id, req.user.id, 'create', {
      hospitalName: hospital.name,
    });
    
    res.status(201).json({ data: hospital });
  } catch (error) {
    next(error);
  }
});

/**
 * Update hospital (admin only)
 */
router.put('/:id', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const hospital = await updateHospital(req.params.id, req.body);
    
    if (!hospital) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Hospital not found',
        },
      });
    }
    
    // Log the action
    await logRegistryAction(hospital.id, req.user.id, 'update', {
      updates: req.body,
    });
    
    res.json({ data: hospital });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete hospital (admin only)
 */
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res, next) => {
  try {
    const hospital = await deleteHospital(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Hospital not found',
        },
      });
    }
    
    // Log the action
    await logRegistryAction(hospital.id, req.user.id, 'delete', {
      hospitalName: hospital.name,
    });
    
    res.json({ data: hospital });
  } catch (error) {
    next(error);
  }
});

/**
 * Create inspection (admin only)
 */
router.post('/:id/inspections', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const inspection = await createInspection({
      hospitalId: req.params.id,
      inspectorId: req.user.id,
      ...req.body,
    });
    
    res.status(201).json({ data: inspection });
  } catch (error) {
    next(error);
  }
});

export { router as registryRouter };

