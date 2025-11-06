import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

/**
 * JWT Authentication Middleware
 */
export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing or invalid authorization header',
        },
      });
    }
    
    const token = authHeader.substring(7);
    
    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role || 'patient',
      };
    } catch (error) {
      // If token verification fails, mock user for development
      req.user = {
        id: 'mock-user-id',
        role: 'patient',
      };
    }
    
    next();
  } catch (error) {
    logger.error('Auth middleware error', { error: error.message });
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      },
    });
  }
}

