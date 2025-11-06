import express from 'express';
import multer from 'multer';
import bodyScanService from '../services/bodyScanService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

/**
 * POST /api/v1/body-scans
 * Create a new body scan
 */
router.post('/', upload.single('meshFile'), async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const {
      scanType,
      meshDataUrl,
      referencePoints,
      measurements,
      comparisonData,
      aiAnalysis,
    } = req.body;

    if (!scanType) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'scanType is required' },
      });
    }

    const scanData = {
      scanType,
      meshDataUrl: meshDataUrl || (req.file ? `/uploads/${req.file.filename}` : null),
      referencePoints: referencePoints ? JSON.parse(referencePoints) : null,
      measurements: measurements ? JSON.parse(measurements) : null,
      comparisonData: comparisonData ? JSON.parse(comparisonData) : null,
      aiAnalysis: aiAnalysis ? JSON.parse(aiAnalysis) : null,
    };

    const scan = await bodyScanService.createBodyScan(patientId, scanData);

    res.status(201).json({ data: scan });
  } catch (error) {
    logger.error('Error creating body scan', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/body-scans
 * Get all body scans for the authenticated patient
 */
router.get('/', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { scanType } = req.query;

    const scans = await bodyScanService.getBodyScans(patientId, scanType || null);

    res.json({ data: scans });
  } catch (error) {
    logger.error('Error fetching body scans', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/body-scans/:scanId
 * Get a specific body scan
 */
router.get('/:scanId', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { scanId } = req.params;

    const scan = await bodyScanService.getBodyScanById(scanId, patientId);

    res.json({ data: scan });
  } catch (error) {
    logger.error('Error fetching body scan', { error: error.message });
    if (error.message === 'Body scan not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * POST /api/v1/body-scans/:scanId/compare
 * Compare scan with previous scans
 */
router.post('/:scanId/compare', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { scanId } = req.params;
    const { scanType } = req.body;

    const comparison = await bodyScanService.compareScans(patientId, scanId, scanType);

    res.json({ data: comparison });
  } catch (error) {
    logger.error('Error comparing scans', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/body-scans/:scanId/analyze-posture
 * Analyze posture from scan data
 */
router.post('/:scanId/analyze-posture', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { scanId } = req.params;

    const analysis = await bodyScanService.analyzePosture(patientId, scanId);

    res.json({ data: analysis });
  } catch (error) {
    logger.error('Error analyzing posture', { error: error.message });
    if (error.message.includes('not a posture scan')) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: error.message },
      });
    }
    next(error);
  }
});

export { router as bodyScanRouter };

