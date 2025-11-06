import express from 'express';
import medicalLockerService from '../services/medicalLockerService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/v1/locker/records
 * Store encrypted medical record
 */
router.post('/records', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { recordType, data, encryptionKey, metadata } = req.body;

    if (!recordType || !data || !encryptionKey) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'recordType, data, and encryptionKey are required',
        },
      });
    }

    const record = await medicalLockerService.storeRecord(
      patientId,
      recordType,
      data,
      encryptionKey,
      metadata
    );

    res.status(201).json({ data: record });
  } catch (error) {
    logger.error('Error storing record', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/locker/records
 * Get all records for patient (metadata only)
 */
router.get('/records', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const records = await medicalLockerService.getPatientRecords(patientId);

    res.json({ data: records });
  } catch (error) {
    logger.error('Error fetching records', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/locker/records/:recordId
 * Retrieve and decrypt record
 */
router.get('/records/:recordId', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { recordId } = req.params;
    const { encryptionKey } = req.query;

    if (!encryptionKey) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'encryptionKey is required',
        },
      });
    }

    const record = await medicalLockerService.retrieveRecord(
      recordId,
      patientId,
      encryptionKey
    );

    res.json({ data: record });
  } catch (error) {
    logger.error('Error retrieving record', { error: error.message });
    if (error.message === 'Record not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    if (error.message === 'Invalid encryption key') {
      return res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * DELETE /api/v1/locker/records/:recordId
 * Delete encrypted record
 */
router.delete('/records/:recordId', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { recordId } = req.params;
    const { encryptionKey } = req.body;

    if (!encryptionKey) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'encryptionKey is required',
        },
      });
    }

    await medicalLockerService.deleteRecord(recordId, patientId, encryptionKey);

    res.json({ data: { success: true } });
  } catch (error) {
    logger.error('Error deleting record', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/locker/records/:recordId/share
 * Create share link
 */
router.post('/records/:recordId/share', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { recordId } = req.params;
    const { expiresInHours = 24, maxAccessCount = null } = req.body;

    const shareLink = await medicalLockerService.createShareLink(
      recordId,
      patientId,
      expiresInHours,
      maxAccessCount
    );

    res.status(201).json({ data: shareLink });
  } catch (error) {
    logger.error('Error creating share link', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/locker/share/:shareToken
 * Access record via share link
 */
router.post('/share/:shareToken', async (req, res, next) => {
  try {
    const { shareToken } = req.params;
    const { encryptionKey } = req.body;

    if (!encryptionKey) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'encryptionKey is required',
        },
      });
    }

    const record = await medicalLockerService.accessViaShareLink(shareToken, encryptionKey);

    res.json({ data: record });
  } catch (error) {
    logger.error('Error accessing via share link', { error: error.message });
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      return res.status(400).json({
        error: { code: 'INVALID_LINK', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * GET /api/v1/locker/share-links
 * Get all share links for patient
 */
router.get('/share-links', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const shareLinks = await medicalLockerService.getShareLinks(patientId);

    res.json({ data: shareLinks });
  } catch (error) {
    logger.error('Error fetching share links', { error: error.message });
    next(error);
  }
});

/**
 * DELETE /api/v1/locker/share-links/:shareToken
 * Revoke share link
 */
router.delete('/share-links/:shareToken', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { shareToken } = req.params;

    await medicalLockerService.revokeShareLink(shareToken, patientId);

    res.json({ data: { success: true } });
  } catch (error) {
    logger.error('Error revoking share link', { error: error.message });
    next(error);
  }
});

export { router as medicalLockerRouter };

