import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { logger } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'mediar_db',
  user: process.env.DB_USER || 'mediar_user',
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Register a new user
 */
export async function registerUser(email, password, userData = {}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()],
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const now = new Date();
    const result = await client.query(
      `INSERT INTO users (id, email, password_hash, created_at, updated_at, user_data)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5)
       RETURNING id, email, user_data, created_at`,
      [email.toLowerCase(), hashedPassword, now, now, JSON.stringify(userData)],
    );

    await client.query('COMMIT');

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      userData: typeof user.user_data === 'string' 
        ? JSON.parse(user.user_data) 
        : user.user_data,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error registering user', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Authenticate user and generate tokens
 */
export async function loginUser(email, password) {
  try {
    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash, user_data FROM users WHERE email = $1',
      [email.toLowerCase()],
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: 'patient', // Default role
    };

    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    // Store refresh token
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET token = $2, expires_at = $3`,
      [
        user.id,
        refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ],
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        userData: typeof user.user_data === 'string' 
          ? JSON.parse(user.user_data) 
          : user.user_data,
      },
    };
  } catch (error) {
    logger.error('Error logging in user', { error: error.message });
    throw error;
  }
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken) {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    // Check if refresh token exists in database
    const result = await pool.query(
      'SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [refreshToken],
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const tokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    const accessToken = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { accessToken };
  } catch (error) {
    logger.error('Error refreshing token', { error: error.message });
    throw new Error('Invalid refresh token');
  }
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Logout user (revoke refresh token)
 */
export async function logoutUser(userId) {
  try {
    await pool.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [userId],
    );
    return true;
  } catch (error) {
    logger.error('Error logging out user', { error: error.message });
    throw error;
  }
}

