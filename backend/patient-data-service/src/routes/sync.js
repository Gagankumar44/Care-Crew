import express from 'express';
import { logger } from '../utils/logger.js';
import { syncRecords } from '../services/patientService.js';

const router = express.Router();

/**
 * POST /api/v1/sync
 * Sync pending records from client
 * Implements Rule-Based Field-Level Merge strategy
 */
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Records must be an array',
        },
      });
    }

    // Sync records
    const result = await syncRecords(userId, records);

    res.json({
      mergedRecords: result.mergedRecords,
      conflicts: result.conflicts,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Sync error', { error: error.message });
    next(error);
  }
});

export { router as syncRouter };

