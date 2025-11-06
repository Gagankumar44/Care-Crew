import express from 'express';
import { logger } from '../utils/logger.js';
import { auditLog } from '../utils/audit.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory call storage (in production, use Redis or database)
const activeCalls = new Map();

const router = express.Router();

/**
 * POST /api/v1/calls/initiate
 * Initiate a WebRTC call
 */
router.post('/initiate', async (req, res, next) => {
  try {
    const { patientId, providerId, callType } = req.body;
    const userId = req.user.id;

    // Validate request
    if (!patientId || !providerId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Patient ID and Provider ID are required',
        },
      });
    }

    // Verify user has permission to initiate call
    if (userId !== patientId && userId !== providerId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to initiate this call',
        },
      });
    }

    // Create call session
    const callId = uuidv4();
    const callSession = {
      callId,
      patientId,
      providerId,
      callType: callType || 'consultation',
      status: 'initiating',
      createdAt: new Date(),
      startedAt: null,
      endedAt: null,
    };

    activeCalls.set(callId, callSession);

    // Audit log
    await auditLog({
      userId,
      action: 'initiate_call',
      resourceType: 'webrtc_call',
      resourceId: callId,
      ipAddress: req.ip,
    });

    // Generate signaling URL and ICE servers
    const signalingUrl = `wss://${req.get('host')}/socket.io/?callId=${callId}`;
    const iceServers = [
      {
        urls: process.env.STUN_SERVER || 'stun:stun.l.google.com:19302',
      },
      // TODO: Add TURN servers for production
    ];

    res.json({
      callId,
      signalingUrl,
      iceServers,
      session: callSession,
    });
  } catch (error) {
    logger.error('Initiate call error', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/calls/:callId
 * Get call session details
 */
router.get('/:callId', async (req, res, next) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    const callSession = activeCalls.get(callId);

    if (!callSession) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Call session not found',
        },
      });
    }

    // Verify user has permission
    if (userId !== callSession.patientId && userId !== callSession.providerId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to view this call',
        },
      });
    }

    res.json(callSession);
  } catch (error) {
    logger.error('Get call error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/calls/:callId/end
 * End a call session
 */
router.post('/:callId/end', async (req, res, next) => {
  try {
    const { callId } = req.params;
    const userId = req.user.id;

    const callSession = activeCalls.get(callId);

    if (!callSession) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Call session not found',
        },
      });
    }

    // Verify user has permission
    if (userId !== callSession.patientId && userId !== callSession.providerId) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to end this call',
        },
      });
    }

    // Update call session
    callSession.status = 'ended';
    callSession.endedAt = new Date();

    // Audit log
    await auditLog({
      userId,
      action: 'end_call',
      resourceType: 'webrtc_call',
      resourceId: callId,
      ipAddress: req.ip,
    });

    res.json({
      message: 'Call ended successfully',
      callSession,
    });
  } catch (error) {
    logger.error('End call error', { error: error.message });
    next(error);
  }
});

export { router as callRouter };

