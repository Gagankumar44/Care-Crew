import { Pool } from 'pg';
import { logger } from '../utils/logger.js';
import { encryptPHI, decryptPHI } from '../utils/encryption.js';

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
 * Get patient profile
 */
export async function getPatientProfile(patientId, userId) {
  try {
    const result = await pool.query(
      'SELECT * FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const profile = result.rows[0];
    // Decrypt PHI
    profile.data = decryptPHI(profile.data);
    return profile;
  } catch (error) {
    logger.error('Error getting patient profile', { error: error.message });
    throw error;
  }
}

/**
 * Create or update patient profile
 */
export async function upsertPatientProfile(patientId, userId, profileData) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Encrypt PHI before storage
    const encryptedData = encryptPHI(JSON.stringify(profileData));

    const now = new Date();
    const result = await client.query(
      `INSERT INTO patient_profiles (id, user_id, created_at, updated_at, data, sync_status)
       VALUES ($1, $2, $3, $4, $5, 'synced')
       ON CONFLICT (id) DO UPDATE SET
         updated_at = $4,
         data = $5,
         sync_status = 'synced'
       RETURNING *`,
      [patientId, userId, now, now, encryptedData],
    );

    await client.query('COMMIT');

    const profile = result.rows[0];
    profile.data = decryptPHI(profile.data);
    return profile;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error upserting patient profile', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Create skin check record
 */
export async function createSkinCheck(patientId, userId, skinCheckData) {
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

    const now = new Date();
    const result = await client.query(
      `INSERT INTO skin_checks (
        id, patient_id, created_at, updated_at, image_url, location_data, risk_assessment, sync_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'synced')
      RETURNING *`,
      [
        skinCheckData.id,
        patientId,
        now,
        now,
        skinCheckData.imageUrl,
        JSON.stringify(skinCheckData.locationData),
        JSON.stringify(skinCheckData.riskAssessment),
      ],
    );

    await client.query('COMMIT');

    const record = result.rows[0];
    if (record.location_data) record.location_data = JSON.parse(record.location_data);
    if (record.risk_assessment) record.risk_assessment = JSON.parse(record.risk_assessment);

    return record;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error creating skin check', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get skin checks for a patient
 */
export async function getSkinChecks(patientId, userId, options = {}) {
  try {
    // Verify patient belongs to user
    const patientCheck = await pool.query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId],
    );

    if (patientCheck.rows.length === 0) {
      throw new Error('Patient not found or access denied');
    }

    let query = 'SELECT * FROM skin_checks WHERE patient_id = $1';
    const params = [patientId];

    if (options.startDate) {
      query += ' AND created_at >= $2';
      params.push(options.startDate);
    }

    if (options.endDate) {
      query += ` AND created_at <= $${params.length + 1}`;
      params.push(options.endDate);
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    const result = await pool.query(query, params);

    return result.rows.map(row => {
      if (row.location_data) row.location_data = JSON.parse(row.location_data);
      if (row.risk_assessment) row.risk_assessment = JSON.parse(row.risk_assessment);
      return row;
    });
  } catch (error) {
    logger.error('Error getting skin checks', { error: error.message });
    throw error;
  }
}

/**
 * Create ROM record
 */
export async function createROMRecord(patientId, userId, romData) {
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

    const now = new Date();
    const result = await client.query(
      `INSERT INTO rom_records (
        id, patient_id, exercise_id, created_at, updated_at,
        angle_data, max_angle, min_angle, duration_seconds, sync_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'synced')
      RETURNING *`,
      [
        romData.id,
        patientId,
        romData.exerciseId,
        now,
        now,
        JSON.stringify(romData.angleData),
        romData.maxAngle,
        romData.minAngle,
        romData.durationSeconds,
      ],
    );

    await client.query('COMMIT');

    const record = result.rows[0];
    if (record.angle_data) record.angle_data = JSON.parse(record.angle_data);

    return record;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error creating ROM record', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get ROM records for a patient
 */
export async function getROMRecords(patientId, userId, options = {}) {
  try {
    // Verify patient belongs to user
    const patientCheck = await pool.query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId],
    );

    if (patientCheck.rows.length === 0) {
      throw new Error('Patient not found or access denied');
    }

    let query = 'SELECT * FROM rom_records WHERE patient_id = $1';
    const params = [patientId];

    if (options.exerciseId) {
      query += ` AND exercise_id = $${params.length + 1}`;
      params.push(options.exerciseId);
    }

    if (options.startDate) {
      query += ` AND created_at >= $${params.length + 1}`;
      params.push(options.startDate);
    }

    if (options.endDate) {
      query += ` AND created_at <= $${params.length + 1}`;
      params.push(options.endDate);
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    const result = await pool.query(query, params);

    return result.rows.map(row => {
      if (row.angle_data) row.angle_data = JSON.parse(row.angle_data);
      return row;
    });
  } catch (error) {
    logger.error('Error getting ROM records', { error: error.message });
    throw error;
  }
}

/**
 * Sync pending records (Rule-Based Field-Level Merge)
 */
export async function syncRecords(userId, records) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const mergedRecords = [];
    const conflicts = [];

    for (const record of records) {
      const { table, recordId, operation, data, origin, timestamp } = record;

      try {
        // Get existing record from database
        const existingResult = await client.query(
          `SELECT * FROM ${table} WHERE id = $1`,
          [recordId],
        );

        if (existingResult.rows.length === 0) {
          // New record - insert
          if (operation === 'insert') {
            await client.query(
              `INSERT INTO ${table} (id, data, created_at, updated_at, sync_status)
               VALUES ($1, $2, $3, $4, 'synced')`,
              [recordId, JSON.stringify(data), new Date(timestamp), new Date(), 'synced'],
            );
            mergedRecords.push({ recordId, data });
          }
        } else {
          // Existing record - merge
          const existing = existingResult.rows[0];
          const existingData = typeof existing.data === 'string' 
            ? JSON.parse(existing.data) 
            : existing.data;

          // Provider data always wins
          if (origin === 'provider' || existing.origin === 'provider') {
            // Provider data takes precedence
            const finalData = origin === 'provider' ? data : existingData;
            await client.query(
              `UPDATE ${table} SET data = $1, updated_at = $2, sync_status = 'synced' WHERE id = $3`,
              [JSON.stringify(finalData), new Date(), recordId],
            );
            mergedRecords.push({ recordId, data: finalData });
          } else {
            // Both patient data - field-level merge
            const merged = { ...existingData, ...data };
            await client.query(
              `UPDATE ${table} SET data = $1, updated_at = $2, sync_status = 'synced' WHERE id = $3`,
              [JSON.stringify(merged), new Date(), recordId],
            );
            mergedRecords.push({ recordId, data: merged });
          }
        }
      } catch (error) {
        conflicts.push({
          recordId,
          table,
          serverData: existingResult?.rows[0],
          localData: data,
          error: error.message,
        });
      }
    }

    await client.query('COMMIT');

    return { mergedRecords, conflicts };
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error syncing records', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
}

