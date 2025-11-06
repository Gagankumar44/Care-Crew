import express from 'express';
import { logger } from '../utils/logger.js';
import { auditLog } from '../utils/audit.js';
import {
  getPatientProfile,
  upsertPatientProfile,
  createSkinCheck,
  getSkinChecks,
  createROMRecord,
  getROMRecords,
} from '../services/patientService.js';

const router = express.Router();

/**
 * GET /api/v1/patients/:id
 * Get patient profile
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Audit log
    await auditLog({
      userId,
      action: 'read',
      resourceType: 'patient_profile',
      resourceId: id,
      ipAddress: req.ip,
    });

    const profile = await getPatientProfile(id, userId);

    if (!profile) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Patient profile not found',
        },
      });
    }

    res.json(profile);
  } catch (error) {
    logger.error('Get patient error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/patients
 * Create patient profile
 */
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, profileData } = req.body;

    // Audit log
    await auditLog({
      userId,
      action: 'create',
      resourceType: 'patient_profile',
      resourceId: id,
      ipAddress: req.ip,
    });

    const profile = await upsertPatientProfile(id, userId, profileData);

    res.status(201).json(profile);
  } catch (error) {
    logger.error('Create patient error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/patients/:id/skin-checks
 * Create skin check record
 */
router.post('/:id/skin-checks', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { imageUrl, locationData, riskAssessment } = req.body;

    // Audit log
    await auditLog({
      userId,
      action: 'create',
      resourceType: 'skin_check',
      resourceId: id,
      ipAddress: req.ip,
    });

    const skinCheck = await createSkinCheck(id, userId, {
      id: `skin-${Date.now()}`,
      imageUrl,
      locationData,
      riskAssessment,
    });

    res.status(201).json(skinCheck);
  } catch (error) {
    logger.error('Create skin check error', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/patients/:id/skin-checks
 * Get skin checks for patient
 */
router.get('/:id/skin-checks', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { startDate, endDate, limit } = req.query;

    const skinChecks = await getSkinChecks(id, userId, {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });

    res.json({ records: skinChecks, total: skinChecks.length });
  } catch (error) {
    logger.error('Get skin checks error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/patients/:id/rom-records
 * Create ROM record
 */
router.post('/:id/rom-records', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { exerciseId, angleData, maxAngle, minAngle, durationSeconds } = req.body;

    // Audit log
    await auditLog({
      userId,
      action: 'create',
      resourceType: 'rom_record',
      resourceId: id,
      ipAddress: req.ip,
    });

    const romRecord = await createROMRecord(id, userId, {
      id: `rom-${Date.now()}`,
      exerciseId,
      angleData,
      maxAngle,
      minAngle,
      durationSeconds,
    });

    res.status(201).json(romRecord);
  } catch (error) {
    logger.error('Create ROM record error', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/patients/:id/rom-records
 * Get ROM records for patient
 */
router.get('/:id/rom-records', async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { exerciseId, startDate, endDate, limit } = req.query;

    const romRecords = await getROMRecords(id, userId, {
      exerciseId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      limit: limit ? parseInt(limit) : 50,
    });

    res.json({ records: romRecords, total: romRecords.length });
  } catch (error) {
    logger.error('Get ROM records error', { error: error.message });
    next(error);
  }
});

export { router as patientRouter };

