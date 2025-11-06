import { pool } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Get all hospitals
 */
export async function getAllHospitals(filters = {}) {
  try {
    let query = 'SELECT * FROM hospitals WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.stateCode) {
      query += ` AND state_code = $${paramIndex++}`;
      params.push(filters.stateCode);
    }

    if (filters.city) {
      query += ` AND city = $${paramIndex++}`;
      params.push(filters.city);
    }

    if (filters.status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }

    if (filters.type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(filters.type);
    }

    query += ' ORDER BY name';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching hospitals', { error: error.message });
    throw error;
  }
}

/**
 * Get hospital by ID
 */
export async function getHospitalById(id) {
  try {
    const result = await pool.query('SELECT * FROM hospitals WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error fetching hospital', { error: error.message });
    throw error;
  }
}

/**
 * Create hospital
 */
export async function createHospital(hospitalData) {
  try {
    const {
      name,
      stateCode,
      stateName,
      city,
      address,
      phone,
      email,
      type,
      accreditation,
      bedsTotal,
      bedsAvailable,
      icuBeds,
      specialties,
      coordinates,
      registrationNumber,
      registrationDate,
      metadata = {},
    } = hospitalData;

    const result = await pool.query(
      `INSERT INTO hospitals (
        name, state_code, state_name, city, address, phone, email,
        type, accreditation, beds_total, beds_available, icu_beds,
        specialties, coordinates, registration_number, registration_date, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        name,
        stateCode,
        stateName,
        city,
        address,
        phone,
        email,
        type,
        accreditation,
        bedsTotal || 0,
        bedsAvailable || 0,
        icuBeds || 0,
        specialties || [],
        coordinates ? JSON.stringify(coordinates) : null,
        registrationNumber,
        registrationDate,
        JSON.stringify(metadata),
      ]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating hospital', { error: error.message });
    throw error;
  }
}

/**
 * Update hospital
 */
export async function updateHospital(id, updates) {
  try {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      'name',
      'city',
      'address',
      'phone',
      'email',
      'type',
      'accreditation',
      'beds_total',
      'beds_available',
      'icu_beds',
      'specialties',
      'coordinates',
      'status',
      'last_inspection_date',
      'metadata',
    ];

    for (const [key, value] of Object.entries(updates)) {
      const dbKey = key === 'bedsTotal' ? 'beds_total' :
                   key === 'bedsAvailable' ? 'beds_available' :
                   key === 'icuBeds' ? 'icu_beds' :
                   key === 'lastInspectionDate' ? 'last_inspection_date' :
                   key;
      
      if (allowedFields.includes(dbKey)) {
        fields.push(`${dbKey} = $${paramIndex++}`);
        if (key === 'coordinates' || key === 'metadata') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE hospitals SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error('Error updating hospital', { error: error.message });
    throw error;
  }
}

/**
 * Delete hospital
 */
export async function deleteHospital(id) {
  try {
    const result = await pool.query('DELETE FROM hospitals WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    logger.error('Error deleting hospital', { error: error.message });
    throw error;
  }
}

/**
 * Log registry action
 */
export async function logRegistryAction(hospitalId, adminId, action, details = {}) {
  try {
    const result = await pool.query(
      `INSERT INTO hospital_registry_logs (hospital_id, admin_id, action, details)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [hospitalId, adminId, action, JSON.stringify(details)]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error logging registry action', { error: error.message });
    throw error;
  }
}

/**
 * Create inspection record
 */
export async function createInspection(inspectionData) {
  try {
    const {
      hospitalId,
      inspectorId,
      inspectionDate,
      inspectionType,
      findings,
      status,
      reportUrl,
    } = inspectionData;

    const result = await pool.query(
      `INSERT INTO hospital_inspections (
        hospital_id, inspector_id, inspection_date, inspection_type,
        findings, status, report_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        hospitalId,
        inspectorId,
        inspectionDate,
        inspectionType,
        JSON.stringify(findings || {}),
        status || 'pending',
        reportUrl,
      ]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating inspection', { error: error.message });
    throw error;
  }
}

/**
 * Get hospital statistics
 */
export async function getHospitalStatistics(filters = {}) {
  try {
    let query = `
      SELECT 
        COUNT(*) as total_hospitals,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_hospitals,
        COUNT(CASE WHEN type = 'public' THEN 1 END) as public_hospitals,
        COUNT(CASE WHEN type = 'private' THEN 1 END) as private_hospitals,
        SUM(beds_total) as total_beds,
        SUM(beds_available) as available_beds,
        SUM(icu_beds) as total_icu_beds
      FROM hospitals
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.stateCode) {
      query += ` AND state_code = $${paramIndex++}`;
      params.push(filters.stateCode);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  } catch (error) {
    logger.error('Error fetching statistics', { error: error.message });
    throw error;
  }
}

