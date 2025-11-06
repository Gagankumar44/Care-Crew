import { Pool } from 'pg';
import { logger } from '../utils/logger.js';

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
 * Get triage session with messages
 */
export async function getTriageSession(sessionId, userId) {
  try {
    // First, verify the session belongs to the user via patient profile
    const sessionResult = await pool.query(
      `SELECT ts.*, pp.user_id 
       FROM triage_sessions ts
       JOIN patient_profiles pp ON ts.patient_id = pp.id
       WHERE ts.id = $1 AND pp.user_id = $2`,
      [sessionId, userId],
    );

    if (sessionResult.rows.length === 0) {
      return null;
    }

    const session = sessionResult.rows[0];

    // Get all messages for this session
    const messagesResult = await pool.query(
      `SELECT id, role, content, timestamp
       FROM triage_messages
       WHERE session_id = $1
       ORDER BY timestamp ASC`,
      [sessionId],
    );

    return {
      id: session.id,
      patientId: session.patient_id,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
      messages: messagesResult.rows.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      })),
    };
  } catch (error) {
    logger.error('Error getting triage session', { error: error.message });
    throw error;
  }
}

/**
 * Create or get triage session
 */
export async function getOrCreateTriageSession(patientId, userId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verify patient belongs to user
    const patientCheck = await client.query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId],
    );

    if (patientCheck.rows.length === 0) {
      throw new Error('Patient not found or access denied');
    }

    // Try to get existing session
    const existingSession = await client.query(
      `SELECT id, created_at, updated_at
       FROM triage_sessions
       WHERE patient_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [patientId],
    );

    if (existingSession.rows.length > 0) {
      const session = existingSession.rows[0];
      await client.query('COMMIT');
      return {
        id: session.id,
        patientId,
        createdAt: session.created_at,
        updatedAt: session.updated_at,
      };
    }

    // Create new session
    const result = await client.query(
      `INSERT INTO triage_sessions (id, patient_id, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, NOW(), NOW())
       RETURNING id, created_at, updated_at`,
      [patientId],
    );

    await client.query('COMMIT');
    const session = result.rows[0];
    return {
      id: session.id,
      patientId,
      createdAt: session.created_at,
      updatedAt: session.updated_at,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error creating/getting triage session', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Save triage message
 */
export async function saveTriageMessage(sessionId, role, content) {
  try {
    const result = await pool.query(
      `INSERT INTO triage_messages (id, session_id, role, content, timestamp)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())
       RETURNING id, timestamp`,
      [sessionId, role, content],
    );

    // Update session updated_at
    await pool.query(
      'UPDATE triage_sessions SET updated_at = NOW() WHERE id = $1',
      [sessionId],
    );

    return {
      id: result.rows[0].id,
      timestamp: result.rows[0].timestamp,
    };
  } catch (error) {
    logger.error('Error saving triage message', { error: error.message });
    throw error;
  }
}

