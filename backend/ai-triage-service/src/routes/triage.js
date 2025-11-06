import express from 'express';
import { callMedGemini, validateTriageRequest } from '../services/triageService.js';
import { getTriageSession, getOrCreateTriageSession, saveTriageMessage } from '../services/triageSessionService.js';
import { logger } from '../utils/logger.js';
import { rateLimiter } from '../middleware/rateLimiter.js';
import { auditLog } from '../utils/audit.js';

const router = express.Router();

/**
 * POST /api/v1/triage/chat
 * Send message to AI triage engine
 */
router.post('/chat', rateLimiter(10, 60), async (req, res, next) => {
  try {
    // Validate request
    validateTriageRequest(req);
    
    const { message, patientId, sessionId: providedSessionId, context } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Get or create session
    let session;
    if (providedSessionId) {
      session = await getTriageSession(providedSessionId, userId);
      if (!session) {
        return res.status(404).json({
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Triage session not found',
          },
        });
      }
    } else {
      session = await getOrCreateTriageSession(patientId, userId);
    }
    
    // Save user message
    await saveTriageMessage(session.id, 'user', message);
    
    // Build context from existing messages if not provided
    let conversationContext = context || [];
    if (!context && session.messages) {
      conversationContext = session.messages.map(msg => ({
        role: msg.role,
        message: msg.role === 'user' ? msg.content : undefined,
        response: msg.role === 'assistant' ? msg.content : undefined,
      }));
    }
    
    // Audit log: PHI access
    await auditLog({
      userId,
      action: 'triage_chat',
      resourceType: 'triage_session',
      resourceId: session.id,
      ipAddress: req.ip,
    });
    
    // Call Med-Gemini
    const triageResponse = await callMedGemini(message, conversationContext);
    
    // Save assistant response
    await saveTriageMessage(session.id, 'assistant', triageResponse.response);
    
    // Return response
    res.json({
      sessionId: session.id,
      response: triageResponse.response,
      triageResult: triageResponse.triageResult,
      followUpQuestions: triageResponse.followUpQuestions || [],
    });
  } catch (error) {
    logger.error('Triage chat error', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/triage/session/:sessionId
 * Get triage session history
 */
router.get('/session/:sessionId', async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;
    
    // Fetch session from database
    const session = await getTriageSession(sessionId, userId);
    
    if (!session) {
      return res.status(404).json({
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Triage session not found',
        },
      });
    }
    
    res.json({
      sessionId: session.id,
      patientId: session.patientId,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      messages: session.messages,
      triageResult: null, // Could be stored separately if needed
    });
  } catch (error) {
    logger.error('Get session error', { error: error.message });
    next(error);
  }
});

export { router as triageRouter };

