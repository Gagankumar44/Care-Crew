import express from 'express';
import doctorCoPilotService from '../services/doctorCoPilotService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/v1/doctor-copilot/notes
 * Create AI-generated doctor notes from transcript
 */
router.post('/notes', async (req, res, next) => {
  try {
    const doctorId = req.user.userId;
    const { consultationId, patientId, audioTranscript } = req.body;

    if (!consultationId || !patientId || !audioTranscript) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'consultationId, patientId, and audioTranscript are required',
        },
      });
    }

    const notes = await doctorCoPilotService.createAIDoctorNotes(
      consultationId,
      doctorId,
      patientId,
      audioTranscript
    );

    res.status(201).json({ data: notes });
  } catch (error) {
    logger.error('Error creating AI doctor notes', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/doctor-copilot/notes/consultation/:consultationId
 * Get AI notes for a consultation
 */
router.get('/notes/consultation/:consultationId', async (req, res, next) => {
  try {
    const doctorId = req.user.userId;
    const { consultationId } = req.params;

    const notes = await doctorCoPilotService.getAIDoctorNotes(consultationId, doctorId);

    res.json({ data: notes });
  } catch (error) {
    logger.error('Error fetching AI doctor notes', { error: error.message });
    if (error.message === 'AI doctor notes not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * GET /api/v1/doctor-copilot/notes
 * Get all notes for the authenticated doctor
 */
router.get('/notes', async (req, res, next) => {
  try {
    const doctorId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const notes = await doctorCoPilotService.getDoctorNotes(
      doctorId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({ data: notes });
  } catch (error) {
    logger.error('Error fetching doctor notes', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/doctor-copilot/notes/patient/:patientId
 * Get all notes for a patient
 */
router.get('/notes/patient/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const notes = await doctorCoPilotService.getPatientNotes(
      patientId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({ data: notes });
  } catch (error) {
    logger.error('Error fetching patient notes', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/doctor-copilot/notes/:noteId/approve
 * Approve AI notes
 */
router.post('/notes/:noteId/approve', async (req, res, next) => {
  try {
    const doctorId = req.user.userId;
    const { noteId } = req.params;
    const { editedNotes } = req.body;

    const notes = await doctorCoPilotService.approveNotes(noteId, doctorId, editedNotes);

    res.json({ data: notes });
  } catch (error) {
    logger.error('Error approving notes', { error: error.message });
    if (error.message === 'AI doctor notes not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * PUT /api/v1/doctor-copilot/notes/:noteId
 * Update AI notes with doctor edits
 */
router.put('/notes/:noteId', async (req, res, next) => {
  try {
    const doctorId = req.user.userId;
    const { noteId } = req.params;
    const { autoSoapNotes, prescriptionSuggestions, riskAlerts, doctorEditedNotes } = req.body;

    const updates = {};
    if (autoSoapNotes) updates.autoSoapNotes = autoSoapNotes;
    if (prescriptionSuggestions) updates.prescriptionSuggestions = prescriptionSuggestions;
    if (riskAlerts) updates.riskAlerts = riskAlerts;
    if (doctorEditedNotes) updates.doctorEditedNotes = doctorEditedNotes;

    const notes = await doctorCoPilotService.updateNotes(noteId, doctorId, updates);

    res.json({ data: notes });
  } catch (error) {
    logger.error('Error updating notes', { error: error.message });
    if (error.message === 'AI doctor notes not found') {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: error.message },
      });
    }
    next(error);
  }
});

export { router as doctorCoPilotRouter };

