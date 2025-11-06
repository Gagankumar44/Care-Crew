import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import {
  getIndiaAnalytics,
  getStateAnalytics,
  getSurgeryCostComparison,
  getTopAffordableHospitals,
  getTopRatedHospitals,
  getMonthlyStatewiseReport,
} from '../services/indiaAnalyticsService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * Get India-level analytics overview
 */
router.get('/india', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const analytics = await getIndiaAnalytics();
    res.json({ data: analytics });
  } catch (error) {
    next(error);
  }
});

/**
 * Get state-wise analytics
 */
router.get('/state/:stateCode', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const { stateCode } = req.params;
    const analytics = await getStateAnalytics(stateCode);
    res.json({ data: analytics });
  } catch (error) {
    next(error);
  }
});

/**
 * Get surgery cost comparison across states
 */
router.get('/surgery/:surgeryId/comparison', authMiddleware, async (req, res, next) => {
  try {
    const { surgeryId } = req.params;
    const comparison = await getSurgeryCostComparison(surgeryId);
    res.json({ data: comparison });
  } catch (error) {
    next(error);
  }
});

/**
 * Get top affordable hospitals for a surgery
 */
router.get('/surgery/:surgeryId/affordable', authMiddleware, async (req, res, next) => {
  try {
    const { surgeryId } = req.params;
    const limit = parseInt(req.query.limit) || 10;
    const hospitals = await getTopAffordableHospitals(surgeryId, limit);
    res.json({ data: hospitals });
  } catch (error) {
    next(error);
  }
});

/**
 * Get top rated hospitals
 */
router.get('/hospitals/top-rated', authMiddleware, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const hospitals = await getTopRatedHospitals(limit);
    res.json({ data: hospitals });
  } catch (error) {
    next(error);
  }
});

/**
 * Get monthly statewise report
 */
router.get('/reports/monthly', authMiddleware, requireRole('admin', 'state_admin'), async (req, res, next) => {
  try {
    const { stateCode, month, year } = req.query;
    const report = await getMonthlyStatewiseReport(
      stateCode || null,
      parseInt(month) || new Date().getMonth() + 1,
      parseInt(year) || new Date().getFullYear()
    );
    res.json({ data: report });
  } catch (error) {
    next(error);
  }
});

export const analyticsRouter = router;

