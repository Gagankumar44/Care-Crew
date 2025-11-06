import express from 'express';
import multer from 'multer';
import skinLesionService from '../services/skinLesionService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Configure multer for image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * POST /api/v1/skin-lesions
 * Create a new skin lesion record
 */
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const {
      bodyPart,
      location,
      imageUrl,
      measurements,
      characteristics,
      aiAnalysis,
      riskLevel,
    } = req.body;

    if (!bodyPart) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'bodyPart is required' },
      });
    }

    const lesionData = {
      bodyPart,
      location: location ? JSON.parse(location) : null,
      imageUrl: imageUrl || (req.file ? `/uploads/skin/${req.file.filename}` : null),
      measurements: measurements ? JSON.parse(measurements) : null,
      characteristics: characteristics ? JSON.parse(characteristics) : null,
      aiAnalysis: aiAnalysis ? JSON.parse(aiAnalysis) : null,
      riskLevel,
    };

    const lesion = await skinLesionService.createSkinLesion(patientId, lesionData);

    res.status(201).json({ data: lesion });
  } catch (error) {
    logger.error('Error creating skin lesion', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/skin-lesions
 * Get all skin lesions for the authenticated patient
 */
router.get('/', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const lesions = await skinLesionService.getSkinLesions(patientId);

    res.json({ data: lesions });
  } catch (error) {
    logger.error('Error fetching skin lesions', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/skin-lesions/:lesionId
 * Get a specific skin lesion
 */
router.get('/:lesionId', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { lesionId } = req.params;

    const lesion = await skinLesionService.getSkinLesionById(lesionId, patientId);

    res.json({ data: lesion });
  } catch (error) {
    logger.error('Error fetching skin lesion', { error: error.message });
    if (error.message === 'Skin lesion not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * PUT /api/v1/skin-lesions/:lesionId
 * Update a skin lesion record
 */
router.put('/:lesionId', upload.single('image'), async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { lesionId } = req.params;
    const {
      imageUrl,
      measurements,
      characteristics,
      aiAnalysis,
      riskLevel,
    } = req.body;

    const updateData = {};

    if (imageUrl) updateData.imageUrl = imageUrl;
    if (req.file) updateData.imageUrl = `/uploads/skin/${req.file.filename}`;
    if (measurements) updateData.measurements = JSON.parse(measurements);
    if (characteristics) updateData.characteristics = JSON.parse(characteristics);
    if (aiAnalysis) updateData.aiAnalysis = JSON.parse(aiAnalysis);
    if (riskLevel) updateData.riskLevel = riskLevel;

    const lesion = await skinLesionService.updateSkinLesion(lesionId, patientId, updateData);

    res.json({ data: lesion });
  } catch (error) {
    logger.error('Error updating skin lesion', { error: error.message });
    if (error.message === 'Skin lesion not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * GET /api/v1/skin-lesions/:lesionId/track
 * Track changes in a skin lesion over time
 */
router.get('/:lesionId/track', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { lesionId } = req.params;

    const tracking = await skinLesionService.trackLesionChanges(lesionId, patientId);

    res.json({ data: tracking });
  } catch (error) {
    logger.error('Error tracking skin lesion', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/skin-lesions/:lesionId/analyze-risk
 * Analyze lesion for risk assessment
 */
router.post('/:lesionId/analyze-risk', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { lesionId } = req.params;

    const analysis = await skinLesionService.analyzeLesionRisk(lesionId, patientId);

    res.json({ data: analysis });
  } catch (error) {
    logger.error('Error analyzing skin lesion risk', { error: error.message });
    next(error);
  }
});

export { router as skinLesionRouter };

