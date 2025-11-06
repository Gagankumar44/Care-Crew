import express from 'express';
import nurseAvatarService from '../services/nurseAvatarService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/v1/nurse-avatar/sessions
 * Create a new nurse avatar session
 */
router.post('/sessions', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { sessionType, sessionData } = req.body;

    if (!sessionType) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'sessionType is required' },
      });
    }

    // Generate session template based on type
    let template = {};
    
    if (sessionType === 'medicine_reminder') {
      const { medicineName, dosage, timing } = req.body;
      template = await nurseAvatarService.getMedicineReminderTemplate(
        medicineName || 'medicine',
        dosage || 'as prescribed',
        timing
      );
    } else if (sessionType === 'exercise_coaching') {
      const { exerciseType, duration, difficulty } = req.body;
      template = await nurseAvatarService.getExerciseCoachingTemplate(
        exerciseType || 'general',
        duration || 10,
        difficulty
      );
    } else if (sessionType === 'breathing') {
      const { breathingType, duration } = req.body;
      template = await nurseAvatarService.getBreathingSessionTemplate(
        breathingType,
        duration
      );
    } else if (sessionType === 'recovery_program') {
      const { programType, dayNumber } = req.body;
      template = await nurseAvatarService.getRecoveryProgramTemplate(
        programType || 'injury_rehab',
        dayNumber || 1
      );
    }

    const session = await nurseAvatarService.createSession(patientId, {
      sessionType,
      sessionData: sessionData || template,
    });

    res.status(201).json({ data: session });
  } catch (error) {
    logger.error('Error creating nurse avatar session', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/nurse-avatar/sessions
 * Get all sessions for the authenticated patient
 */
router.get('/sessions', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { sessionType, completed } = req.query;

    const sessions = await nurseAvatarService.getSessions(
      patientId,
      sessionType || null,
      completed !== undefined ? completed === 'true' : null
    );

    res.json({ data: sessions });
  } catch (error) {
    logger.error('Error fetching sessions', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/nurse-avatar/sessions/:sessionId
 * Get a specific session
 */
router.get('/sessions/:sessionId', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { sessionId } = req.params;

    const session = await nurseAvatarService.getSessionById(sessionId, patientId);

    res.json({ data: session });
  } catch (error) {
    logger.error('Error fetching session', { error: error.message });
    if (error.message === 'Session not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * PUT /api/v1/nurse-avatar/sessions/:sessionId
 * Update session progress
 */
router.put('/sessions/:sessionId', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { sessionId } = req.params;
    const { sessionData, completed } = req.body;

    const updateData = {};
    if (sessionData) updateData.sessionData = sessionData;
    if (completed !== undefined) updateData.completed = completed;

    const session = await nurseAvatarService.updateSession(
      sessionId,
      patientId,
      updateData
    );

    res.json({ data: session });
  } catch (error) {
    logger.error('Error updating session', { error: error.message });
    if (error.message === 'Session not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * POST /api/v1/nurse-avatar/sessions/:sessionId/complete
 * Complete a session
 */
router.post('/sessions/:sessionId/complete', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { sessionId } = req.params;

    const session = await nurseAvatarService.completeSession(sessionId, patientId);

    res.json({ data: session });
  } catch (error) {
    logger.error('Error completing session', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/nurse-avatar/sessions/:sessionId/summary
 * Get session summary
 */
router.get('/sessions/:sessionId/summary', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { sessionId } = req.params;

    const summary = await nurseAvatarService.generateSessionSummary(sessionId, patientId);

    res.json({ data: summary });
  } catch (error) {
    logger.error('Error generating session summary', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/nurse-avatar/statistics
 * Get session statistics for patient
 */
router.get('/statistics', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { days } = req.query;

    const statistics = await nurseAvatarService.getSessionStatistics(
      patientId,
      days ? parseInt(days) : 30
    );

    res.json({ data: statistics });
  } catch (error) {
    logger.error('Error fetching statistics', { error: error.message });
    next(error);
  }
});

export { router as nurseAvatarRouter };

