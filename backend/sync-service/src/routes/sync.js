import express from 'express';
import syncService from '../services/syncService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/v1/sync/queue
 * Add item to sync queue
 */
router.post('/queue', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { recordType, recordId, operation, data } = req.body;

    if (!recordType || !recordId || !operation || !data) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'recordType, recordId, operation, and data are required',
        },
      });
    }

    const queueItem = await syncService.addToSyncQueue(
      patientId,
      recordType,
      recordId,
      operation,
      data
    );

    res.status(201).json({ data: queueItem });
  } catch (error) {
    logger.error('Error adding to sync queue', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/sync/pending
 * Get pending sync items
 */
router.get('/pending', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const items = await syncService.getPendingSyncItems(
      patientId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({ data: items });
  } catch (error) {
    logger.error('Error fetching pending sync items', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/sync/status
 * Get sync status
 */
router.get('/status', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const status = await syncService.getSyncStatus(patientId);

    res.json({ data: status });
  } catch (error) {
    logger.error('Error fetching sync status', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/sync/batch
 * Batch sync pending items
 */
router.post('/batch', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { batchSize = 20 } = req.body;

    const results = await syncService.batchSync(patientId, batchSize);

    res.json({ data: results });
  } catch (error) {
    logger.error('Error batch syncing', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/sync/retry
 * Retry failed sync items
 */
router.post('/retry', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { limit = 10 } = req.body;

    const items = await syncService.retryFailedItems(patientId, limit);

    res.json({ data: items });
  } catch (error) {
    logger.error('Error retrying failed items', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/sync/conflicts
 * Get sync conflicts
 */
router.get('/conflicts', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const conflicts = await syncService.getConflicts(patientId);

    res.json({ data: conflicts });
  } catch (error) {
    logger.error('Error fetching conflicts', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/sync/conflicts/resolve
 * Resolve conflict
 */
router.post('/conflicts/resolve', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { recordType, recordId } = req.body;

    if (!recordType || !recordId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'recordType and recordId are required',
        },
      });
    }

    const result = await syncService.resolveConflict(recordType, recordId, patientId);

    res.json({ data: result });
  } catch (error) {
    logger.error('Error resolving conflict', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/sync/history
 * Get sync history
 */
router.get('/history', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const history = await syncService.getSyncHistory(
      patientId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({ data: history });
  } catch (error) {
    logger.error('Error fetching sync history', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/sync/statistics
 * Get sync statistics
 */
router.get('/statistics', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { days = 30 } = req.query;

    const statistics = await syncService.getSyncStatistics(patientId, parseInt(days));

    res.json({ data: statistics });
  } catch (error) {
    logger.error('Error fetching sync statistics', { error: error.message });
    next(error);
  }
});

/**
 * DELETE /api/v1/sync/cleanup
 * Clear synced items (cleanup)
 */
router.delete('/cleanup', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { olderThanDays = 7 } = req.body;

    const result = await syncService.clearSyncedItems(patientId, olderThanDays);

    res.json({ data: result });
  } catch (error) {
    logger.error('Error cleaning up synced items', { error: error.message });
    next(error);
  }
});

export { router as syncRouter };

