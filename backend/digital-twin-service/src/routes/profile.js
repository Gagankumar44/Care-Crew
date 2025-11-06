import express from 'express';
import digitalTwinService from '../services/digitalTwinService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * GET /api/v1/digital-twin/profile
 * Get digital twin profile
 */
router.get('/profile', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const profile = await digitalTwinService.getProfile(patientId);

    res.json({ data: profile });
  } catch (error) {
    logger.error('Error fetching digital twin profile', { error: error.message });
    if (error.message === 'Digital twin profile not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * POST /api/v1/digital-twin/profile
 * Create or update digital twin profile
 */
router.post('/profile', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const {
      genomicData,
      lifestyleData,
      healthPredictions,
      metabolicScore,
      sleepBurnoutScore,
      stressStrainScore,
      nutritionRecommendations,
    } = req.body;

    const profile = await digitalTwinService.upsertProfile(patientId, {
      genomicData,
      lifestyleData,
      healthPredictions,
      metabolicScore,
      sleepBurnoutScore,
      stressStrainScore,
      nutritionRecommendations,
    });

    res.json({ data: profile });
  } catch (error) {
    logger.error('Error creating/updating profile', { error: error.message });
    next(error);
  }
});

/**
 * PUT /api/v1/digital-twin/genomic-data
 * Update genomic data
 */
router.put('/genomic-data', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { genomicData } = req.body;

    if (!genomicData) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'genomicData is required' },
      });
    }

    const profile = await digitalTwinService.updateGenomicData(patientId, genomicData);

    res.json({ data: profile });
  } catch (error) {
    logger.error('Error updating genomic data', { error: error.message });
    next(error);
  }
});

/**
 * PUT /api/v1/digital-twin/lifestyle-data
 * Update lifestyle data
 */
router.put('/lifestyle-data', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { lifestyleData } = req.body;

    if (!lifestyleData) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'lifestyleData is required' },
      });
    }

    const profile = await digitalTwinService.updateLifestyleData(patientId, lifestyleData);

    res.json({ data: profile });
  } catch (error) {
    logger.error('Error updating lifestyle data', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/digital-twin/predictions
 * Generate health predictions
 */
router.post('/predictions', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const predictions = await digitalTwinService.generatePredictions(patientId);

    res.json({ data: predictions });
  } catch (error) {
    logger.error('Error generating predictions', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/digital-twin/recalculate-scores
 * Recalculate all scores
 */
router.post('/recalculate-scores', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const scores = await digitalTwinService.recalculateScores(patientId);

    res.json({ data: scores });
  } catch (error) {
    logger.error('Error recalculating scores', { error: error.message });
    next(error);
  }
});

export { router as digitalTwinRouter };

