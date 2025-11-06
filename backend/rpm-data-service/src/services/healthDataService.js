import { Pool } from 'pg';
import { randomUUID } from 'crypto';
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
 * Ingest health data from wearables/RPM devices
 */
export async function ingestHealthData({
  patientId,
  source,
  dataType,
  value,
  unit,
  timestamp,
}) {
  try {
    const id = randomUUID();
    const now = new Date();

    const result = await pool.query(
      `INSERT INTO health_data (
        id, patient_id, source, data_type, value, unit, timestamp, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [id, patientId, source, dataType, value, unit, timestamp, now],
    );

    return result.rows[0];
  } catch (error) {
    logger.error('Error ingesting health data', { error: error.message });
    throw error;
  }
}

/**
 * Get health data for a patient
 */
export async function getHealthData(patientId, options = {}) {
  try {
    let query = 'SELECT * FROM health_data WHERE patient_id = $1';
    const params = [patientId];

    if (options.startDate) {
      query += ` AND timestamp >= $${params.length + 1}`;
      params.push(options.startDate);
    }

    if (options.endDate) {
      query += ` AND timestamp <= $${params.length + 1}`;
      params.push(options.endDate);
    }

    if (options.dataType) {
      query += ` AND data_type = $${params.length + 1}`;
      params.push(options.dataType);
    }

    if (options.source) {
      query += ` AND source = $${params.length + 1}`;
      params.push(options.source);
    }

    query += ' ORDER BY timestamp DESC';

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error getting health data', { error: error.message });
    throw error;
  }
}

/**
 * Get aggregated health data summary
 */
export async function getHealthDataSummary(patientId, options = {}) {
  try {
    let query = `
      SELECT 
        data_type,
        source,
        COUNT(*) as count,
        AVG(value) as avg_value,
        MIN(value) as min_value,
        MAX(value) as max_value,
        MIN(timestamp) as first_record,
        MAX(timestamp) as last_record
      FROM health_data
      WHERE patient_id = $1
    `;
    const params = [patientId];

    if (options.startDate) {
      query += ` AND timestamp >= $${params.length + 1}`;
      params.push(options.startDate);
    }

    if (options.endDate) {
      query += ` AND timestamp <= $${params.length + 1}`;
      params.push(options.endDate);
    }

    query += ' GROUP BY data_type, source ORDER BY data_type, source';

    const result = await pool.query(query, params);

    // Transform to more readable format
    return result.rows.map(row => ({
      dataType: row.data_type,
      source: row.source,
      count: parseInt(row.count),
      average: parseFloat(row.avg_value),
      min: parseFloat(row.min_value),
      max: parseFloat(row.max_value),
      firstRecord: row.first_record,
      lastRecord: row.last_record,
    }));
  } catch (error) {
    logger.error('Error getting health data summary', { error: error.message });
    throw error;
  }
}

