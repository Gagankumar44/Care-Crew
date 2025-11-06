import express from 'express';
import { logger } from '../utils/logger.js';
import { auditLog } from '../utils/audit.js';
import { ingestHealthData, getHealthData, getHealthDataSummary } from '../services/healthDataService.js';

const router = express.Router();

/**
 * POST /api/v1/health-data/ingest
 * Ingest health data from wearables/RPM devices
 */
router.post('/ingest', async (req, res, next) => {
  try {
    const { patientId, source, dataType, value, unit, timestamp } = req.body;
    const userId = req.user.id;

    // Validate request
    if (!patientId || !source || !dataType || value === undefined) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Patient ID, source, data type, and value are required',
        },
      });
    }

    // Verify user has permission
    if (userId !== patientId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You can only submit health data for yourself',
        },
      });
    }

    // Ingest data
    const healthData = await ingestHealthData({
      patientId,
      source,
      dataType,
      value,
      unit,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    // Audit log
    await auditLog({
      userId,
      action: 'ingest_health_data',
      resourceType: 'health_data',
      resourceId: healthData.id,
      ipAddress: req.ip,
    });

    res.status(201).json(healthData);
  } catch (error) {
    logger.error('Ingest health data error', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/health-data/:patientId
 * Get health data for a patient
 */
router.get('/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate, dataType, source, limit } = req.query;

    // Verify user has permission
    if (userId !== patientId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You can only view your own health data',
        },
      });
    }

    const healthData = await getHealthData(patientId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      dataType,
      source,
      limit: limit ? parseInt(limit) : 100,
    });

    res.json({
      records: healthData,
      total: healthData.length,
    });
  } catch (error) {
    logger.error('Get health data error', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/health-data/:patientId/summary
 * Get health data summary (aggregated)
 */
router.get('/:patientId/summary', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate } = req.query;

    // Verify user has permission
    if (userId !== patientId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You can only view your own health data',
        },
      });
    }

    const summary = await getHealthDataSummary(patientId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.json(summary);
  } catch (error) {
    logger.error('Get health data summary error', { error: error.message });
    next(error);
  }
});

export { router as healthDataRouter };

