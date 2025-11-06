import { pool } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Get state admin by user ID
 */
export async function getStateAdminByUserId(userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM state_admins WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error fetching state admin', { error: error.message });
    throw error;
  }
}

/**
 * Create state admin
 */
export async function createStateAdmin(userId, stateCode, stateName, permissions = {}) {
  try {
    const result = await pool.query(
      `INSERT INTO state_admins (user_id, state_code, state_name, permissions)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, stateCode, stateName, JSON.stringify(permissions)]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating state admin', { error: error.message });
    throw error;
  }
}

/**
 * Get all hospitals in a state
 */
export async function getStateHospitals(stateCode) {
  try {
    // This would join with hospital registry service
    // For now, return mock structure
    const result = await pool.query(
      `SELECT h.* FROM hospitals h
       WHERE h.state_code = $1
       ORDER BY h.name`,
      [stateCode]
    );
    return result.rows;
  } catch (error) {
    logger.error('Error fetching state hospitals', { error: error.message });
    throw error;
  }
}

/**
 * Log hospital control action
 */
export async function logHospitalControlAction(adminId, hospitalId, action, details = {}) {
  try {
    const result = await pool.query(
      `INSERT INTO hospital_control_logs (admin_id, hospital_id, action, details)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [adminId, hospitalId, action, JSON.stringify(details)]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error logging hospital control action', { error: error.message });
    throw error;
  }
}

/**
 * Get state settings
 */
export async function getStateSettings(stateCode) {
  try {
    const result = await pool.query(
      'SELECT * FROM state_settings WHERE state_code = $1',
      [stateCode]
    );
    return result.rows[0] || { state_code: stateCode, settings: {} };
  } catch (error) {
    logger.error('Error fetching state settings', { error: error.message });
    throw error;
  }
}

/**
 * Update state settings
 */
export async function updateStateSettings(stateCode, settings) {
  try {
    const result = await pool.query(
      `INSERT INTO state_settings (state_code, settings)
       VALUES ($1, $2)
       ON CONFLICT (state_code) 
       DO UPDATE SET settings = $2, updated_at = NOW()
       RETURNING *`,
      [stateCode, JSON.stringify(settings)]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error updating state settings', { error: error.message });
    throw error;
  }
}

/**
 * Get hospital control logs
 */
export async function getHospitalControlLogs(adminId, limit = 100) {
  try {
    const result = await pool.query(
      `SELECT * FROM hospital_control_logs
       WHERE admin_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [adminId, limit]
    );
    return result.rows;
  } catch (error) {
    logger.error('Error fetching hospital control logs', { error: error.message });
    throw error;
  }
}

