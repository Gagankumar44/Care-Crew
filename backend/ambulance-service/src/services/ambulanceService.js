import { pool } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Get all air ambulances
 */
export async function getAllAirAmbulances(filters = {}) {
  try {
    let query = 'SELECT * FROM air_ambulances WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(filters.status);
    }

    query += ' ORDER BY registration_number';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching air ambulances', { error: error.message });
    throw error;
  }
}

/**
 * Get air ambulance by ID
 */
export async function getAirAmbulanceById(id) {
  try {
    const result = await pool.query('SELECT * FROM air_ambulances WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error fetching air ambulance', { error: error.message });
    throw error;
  }
}

/**
 * Create mission
 */
export async function createMission(missionData) {
  try {
    const {
      ambulanceId,
      missionType,
      priority,
      originLocation,
      destinationLocation,
      patientInfo,
      estimatedDistanceKm,
      estimatedDurationMinutes,
      assignedCrew,
      flightPlan,
      createdBy,
    } = missionData;

    const result = await pool.query(
      `INSERT INTO ambulance_missions (
        ambulance_id, mission_type, priority, origin_location, destination_location,
        patient_info, estimated_distance_km, estimated_duration_minutes,
        assigned_crew, flight_plan, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        ambulanceId,
        missionType,
        priority || 'medium',
        JSON.stringify(originLocation),
        JSON.stringify(destinationLocation),
        patientInfo ? JSON.stringify(patientInfo) : null,
        estimatedDistanceKm,
        estimatedDurationMinutes,
        assignedCrew ? JSON.stringify(assignedCrew) : null,
        flightPlan ? JSON.stringify(flightPlan) : null,
        createdBy,
      ]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error creating mission', { error: error.message });
    throw error;
  }
}

/**
 * Get all missions
 */
export async function getAllMissions(filters = {}) {
  try {
    let query = `
      SELECT m.*, a.registration_number, a.aircraft_type
      FROM ambulance_missions m
      LEFT JOIN air_ambulances a ON m.ambulance_id = a.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND m.status = $${paramIndex++}`;
      params.push(filters.status);
    }

    if (filters.priority) {
      query += ` AND m.priority = $${paramIndex++}`;
      params.push(filters.priority);
    }

    if (filters.ambulanceId) {
      query += ` AND m.ambulance_id = $${paramIndex++}`;
      params.push(filters.ambulanceId);
    }

    query += ' ORDER BY m.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching missions', { error: error.message });
    throw error;
  }
}

/**
 * Get mission by ID
 */
export async function getMissionById(id) {
  try {
    const result = await pool.query(
      `SELECT m.*, a.registration_number, a.aircraft_type
       FROM ambulance_missions m
       LEFT JOIN air_ambulances a ON m.ambulance_id = a.id
       WHERE m.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    logger.error('Error fetching mission', { error: error.message });
    throw error;
  }
}

/**
 * Update mission status
 */
export async function updateMissionStatus(id, status, updates = {}) {
  try {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    fields.push(`status = $${paramIndex++}`);
    values.push(status);

    if (status === 'dispatched' && !updates.dispatchedAt) {
      fields.push(`dispatched_at = NOW()`);
    }

    if (status === 'completed' && !updates.completedAt) {
      fields.push(`completed_at = NOW()`);
    }

    if (updates.actualDurationMinutes) {
      fields.push(`actual_duration_minutes = $${paramIndex++}`);
      values.push(updates.actualDurationMinutes);
    }

    if (updates.dispatchedAt) {
      fields.push(`dispatched_at = $${paramIndex++}`);
      values.push(updates.dispatchedAt);
    }

    if (updates.completedAt) {
      fields.push(`completed_at = $${paramIndex++}`);
      values.push(updates.completedAt);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE ambulance_missions SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    logger.error('Error updating mission status', { error: error.message });
    throw error;
  }
}

/**
 * Add tracking update
 */
export async function addTrackingUpdate(missionId, trackingData) {
  try {
    const {
      location,
      status,
      speedKnots,
      headingDegrees,
      fuelPercentage,
      metadata = {},
    } = trackingData;

    const result = await pool.query(
      `INSERT INTO mission_tracking (
        mission_id, location, status, speed_knots, heading_degrees,
        fuel_percentage, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        missionId,
        JSON.stringify(location),
        status,
        speedKnots,
        headingDegrees,
        fuelPercentage,
        JSON.stringify(metadata),
      ]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error adding tracking update', { error: error.message });
    throw error;
  }
}

/**
 * Get mission tracking history
 */
export async function getMissionTracking(missionId) {
  try {
    const result = await pool.query(
      'SELECT * FROM mission_tracking WHERE mission_id = $1 ORDER BY timestamp ASC',
      [missionId]
    );
    return result.rows;
  } catch (error) {
    logger.error('Error fetching mission tracking', { error: error.message });
    throw error;
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStatistics() {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM air_ambulances WHERE status = 'available') as available_ambulances,
        (SELECT COUNT(*) FROM air_ambulances WHERE status = 'on_mission') as ambulances_on_mission,
        (SELECT COUNT(*) FROM ambulance_missions WHERE status = 'pending') as pending_missions,
        (SELECT COUNT(*) FROM ambulance_missions WHERE status = 'in_transit') as missions_in_transit,
        (SELECT COUNT(*) FROM ambulance_missions WHERE DATE(created_at) = CURRENT_DATE) as missions_today,
        (SELECT COUNT(*) FROM ambulance_missions WHERE status = 'completed' AND DATE(completed_at) = CURRENT_DATE) as completed_today
    `);
    return stats.rows[0];
  } catch (error) {
    logger.error('Error fetching dashboard statistics', { error: error.message });
    throw error;
  }
}

