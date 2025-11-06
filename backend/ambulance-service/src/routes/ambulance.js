import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  getAllAirAmbulances,
  getAirAmbulanceById,
  createMission,
  getAllMissions,
  getMissionById,
  updateMissionStatus,
  addTrackingUpdate,
  getMissionTracking,
  getDashboardStatistics,
} from '../services/ambulanceService.js';

const router = express.Router();

/**
 * Get dashboard statistics
 */
router.get('/dashboard/statistics', authMiddleware, async (req, res, next) => {
  try {
    const stats = await getDashboardStatistics();
    res.json({ data: stats });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all air ambulances
 */
router.get('/ambulances', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
    };
    const ambulances = await getAllAirAmbulances(filters);
    res.json({ data: ambulances });
  } catch (error) {
    next(error);
  }
});

/**
 * Get air ambulance by ID
 */
router.get('/ambulances/:id', authMiddleware, async (req, res, next) => {
  try {
    const ambulance = await getAirAmbulanceById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Air ambulance not found',
        },
      });
    }
    res.json({ data: ambulance });
  } catch (error) {
    next(error);
  }
});

/**
 * Get all missions
 */
router.get('/missions', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      priority: req.query.priority,
      ambulanceId: req.query.ambulanceId,
    };
    const missions = await getAllMissions(filters);
    res.json({ data: missions });
  } catch (error) {
    next(error);
  }
});

/**
 * Get mission by ID
 */
router.get('/missions/:id', authMiddleware, async (req, res, next) => {
  try {
    const mission = await getMissionById(req.params.id);
    if (!mission) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Mission not found',
        },
      });
    }
    res.json({ data: mission });
  } catch (error) {
    next(error);
  }
});

/**
 * Create mission
 */
router.post('/missions', authMiddleware, requireRole('admin', 'state_admin', 'dispatcher'), async (req, res, next) => {
  try {
    const mission = await createMission({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ data: mission });
  } catch (error) {
    next(error);
  }
});

/**
 * Update mission status
 */
router.patch('/missions/:id/status', authMiddleware, requireRole('admin', 'state_admin', 'dispatcher'), async (req, res, next) => {
  try {
    const { status, ...updates } = req.body;
    if (!status) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing status',
        },
      });
    }
    
    const mission = await updateMissionStatus(req.params.id, status, updates);
    if (!mission) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Mission not found',
        },
      });
    }
    res.json({ data: mission });
  } catch (error) {
    next(error);
  }
});

/**
 * Add tracking update
 */
router.post('/missions/:id/tracking', authMiddleware, async (req, res, next) => {
  try {
    const tracking = await addTrackingUpdate(req.params.id, req.body);
    res.status(201).json({ data: tracking });
  } catch (error) {
    next(error);
  }
});

/**
 * Get mission tracking history
 */
router.get('/missions/:id/tracking', authMiddleware, async (req, res, next) => {
  try {
    const tracking = await getMissionTracking(req.params.id);
    res.json({ data: tracking });
  } catch (error) {
    next(error);
  }
});

export { router as ambulanceRouter };

