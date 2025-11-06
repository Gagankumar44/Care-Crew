import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  recordSurgeryDemand,
  getHistoricalDemand,
  generatePrediction,
  getPredictions,
  getDemandStatistics,
  recordResourceUtilization,
  getResourceUtilization,
  generateAnalyticsReport,
  getAnalyticsReports,
} from '../services/analyticsService.js';

const router = express.Router();

/**
 * Get historical surgery demand
 */
router.get('/demand/history', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      hospitalId: req.query.hospitalId,
      stateCode: req.query.stateCode,
      surgeryType: req.query.surgeryType,
      specialty: req.query.specialty,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    
    const history = await getHistoricalDemand(filters);
    res.json({ data: history });
  } catch (error) {
    next(error);
  }
});

/**
 * Record surgery demand
 */
router.post('/demand', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const demand = await recordSurgeryDemand(req.body);
    res.status(201).json({ data: demand });
  } catch (error) {
    next(error);
  }
});

/**
 * Get demand statistics
 */
router.get('/demand/statistics', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      hospitalId: req.query.hospitalId,
      stateCode: req.query.stateCode,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    
    const stats = await getDemandStatistics(filters);
    res.json({ data: stats });
  } catch (error) {
    next(error);
  }
});

/**
 * Get predictions
 */
router.get('/predictions', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      hospitalId: req.query.hospitalId,
      stateCode: req.query.stateCode,
      surgeryType: req.query.surgeryType,
      specialty: req.query.specialty,
    };
    
    const predictions = await getPredictions(filters);
    res.json({ data: predictions });
  } catch (error) {
    next(error);
  }
});

/**
 * Generate prediction
 */
router.post('/predictions', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const prediction = await generatePrediction({
      ...req.body,
    });
    res.status(201).json({ data: prediction });
  } catch (error) {
    next(error);
  }
});

/**
 * Get resource utilization
 */
router.get('/resources/utilization', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      hospitalId: req.query.hospitalId,
      stateCode: req.query.stateCode,
      resourceType: req.query.resourceType,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    
    const utilization = await getResourceUtilization(filters);
    res.json({ data: utilization });
  } catch (error) {
    next(error);
  }
});

/**
 * Record resource utilization
 */
router.post('/resources/utilization', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const utilization = await recordResourceUtilization(req.body);
    res.status(201).json({ data: utilization });
  } catch (error) {
    next(error);
  }
});

/**
 * Get analytics reports
 */
router.get('/reports', authMiddleware, async (req, res, next) => {
  try {
    const filters = {
      reportType: req.query.reportType,
      scope: req.query.scope,
      scopeId: req.query.scopeId,
    };
    
    const reports = await getAnalyticsReports(filters);
    res.json({ data: reports });
  } catch (error) {
    next(error);
  }
});

/**
 * Generate analytics report
 */
router.post('/reports', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const report = await generateAnalyticsReport({
      ...req.body,
      generatedBy: req.user.id,
    });
    res.status(201).json({ data: report });
  } catch (error) {
    next(error);
  }
});

export { router as analyticsRouter };

