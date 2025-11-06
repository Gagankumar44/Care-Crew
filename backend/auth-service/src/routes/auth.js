import express from 'express';
import { logger } from '../utils/logger.js';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from '../services/authService.js';

const router = express.Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, userData } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 8 characters',
        },
      });
    }

    const user = await registerUser(email, password, userData);

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({
        error: {
          code: 'USER_EXISTS',
          message: error.message,
        },
      });
    }
    logger.error('Register error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email and password are required',
        },
      });
    }

    const result = await loginUser(email, password);

    res.json({
      token: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: 3600, // 1 hour
      user: result.user,
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        error: {
          code: 'INVALID_CREDENTIALS',
          message: error.message,
        },
      });
    }
    logger.error('Login error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token is required',
        },
      });
    }

    const result = await refreshAccessToken(refreshToken);

    res.json({
      token: result.accessToken,
      expiresIn: 3600,
    });
  } catch (error) {
    if (error.message === 'Invalid refresh token') {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: error.message,
        },
      });
    }
    logger.error('Refresh token error', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/auth/logout
 * Logout user
 */
router.post('/logout', async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
    }

    await logoutUser(userId);

    res.json({
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.error('Logout error', { error: error.message });
    next(error);
  }
});

export { router as authRouter };

