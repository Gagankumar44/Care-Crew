import { pool } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Get India-level analytics overview
 */
export async function getIndiaAnalytics() {
  try {
    // Get hospital count per state
    const hospitalCounts = await pool.query(`
      SELECT 
        s.name as state_name,
        s.code as state_code,
        COUNT(h.id) as hospital_count,
        COUNT(DISTINCT h.city) as city_count
      FROM states s
      LEFT JOIN hospitals h ON h.state_id = s.id OR h.state = s.name
      GROUP BY s.id, s.name, s.code
      ORDER BY hospital_count DESC
    `);

    // Get total surgeries performed
    const surgeriesPerformed = await pool.query(`
      SELECT 
        s.code as state_code,
        COUNT(a.id) as total_surgeries
      FROM states s
      LEFT JOIN hospitals h ON h.state_id = s.id OR h.state = s.name
      LEFT JOIN appointments a ON a.hospital_id = h.id 
        AND a.status = 'completed'
        AND a.type = 'in_person'
      GROUP BY s.id, s.code
    `);

    // Get average surgery cost per state
    const avgSurgeryCosts = await pool.query(`
      SELECT 
        s.code as state_code,
        AVG(hsp.avg_cost) as avg_surgery_cost,
        COUNT(DISTINCT hsp.hospital_id) as hospitals_with_pricing
      FROM states s
      LEFT JOIN hospitals h ON h.state_id = s.id OR h.state = s.name
      LEFT JOIN hospital_surgery_prices hsp ON hsp.hospital_id = h.id
      GROUP BY s.id, s.code
      HAVING AVG(hsp.avg_cost) IS NOT NULL
    `);

    // Get emergency/air ambulance stats
    const emergencyStats = await pool.query(`
      SELECT 
        s.code as state_code,
        COUNT(DISTINCT m.id) as air_ambulance_missions,
        COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.id END) as completed_missions,
        COUNT(DISTINCT CASE WHEN m.source_state = s.name THEN m.id END) as missions_from_state
      FROM states s
      LEFT JOIN missions m ON m.source_state = s.name OR m.destination_state = s.name
      GROUP BY s.id, s.code
    `);

    // Combine all stats
    const stateStats = hospitalCounts.rows.map(hc => {
      const surgeries = surgeriesPerformed.rows.find(s => s.state_code === hc.state_code) || { total_surgeries: 0 };
      const costs = avgSurgeryCosts.rows.find(c => c.state_code === hc.state_code) || { avg_surgery_cost: null, hospitals_with_pricing: 0 };
      const emergencies = emergencyStats.rows.find(e => e.state_code === hc.state_code) || { 
        air_ambulance_missions: 0, 
        completed_missions: 0,
        missions_from_state: 0
      };

      return {
        state_code: hc.state_code,
        state_name: hc.state_name,
        hospital_count: parseInt(hc.hospital_count) || 0,
        city_count: parseInt(hc.city_count) || 0,
        total_surgeries: parseInt(surgeries.total_surgeries) || 0,
        avg_surgery_cost: costs.avg_surgery_cost ? parseFloat(costs.avg_surgery_cost) : null,
        hospitals_with_pricing: parseInt(costs.hospitals_with_pricing) || 0,
        air_ambulance_missions: parseInt(emergencies.air_ambulance_missions) || 0,
        completed_missions: parseInt(emergencies.completed_missions) || 0,
      };
    });

    // Calculate India totals
    const totals = {
      total_hospitals: stateStats.reduce((sum, s) => sum + s.hospital_count, 0),
      total_surgeries: stateStats.reduce((sum, s) => sum + s.total_surgeries, 0),
      total_air_ambulance_missions: stateStats.reduce((sum, s) => sum + s.air_ambulance_missions, 0),
      states_count: stateStats.length,
    };

    return {
      state_stats: stateStats,
      totals,
    };
  } catch (error) {
    logger.error('Error fetching India analytics', { error: error.message });
    throw error;
  }
}

/**
 * Get state-wise analytics
 */
export async function getStateAnalytics(stateCode) {
  try {
    const state = await pool.query(
      'SELECT id, name, code FROM states WHERE code = $1',
      [stateCode]
    );

    if (state.rows.length === 0) {
      throw new Error('State not found');
    }

    const stateData = state.rows[0];

    // Get hospitals in state
    const hospitals = await pool.query(`
      SELECT 
        h.*,
        COUNT(DISTINCT d.id) as doctor_count,
        COUNT(DISTINCT a.id) as appointment_count,
        AVG(f.rating) as avg_rating
      FROM hospitals h
      LEFT JOIN doctors d ON d.hospital_id = h.id
      LEFT JOIN appointments a ON a.hospital_id = h.id
      LEFT JOIN feedbacks f ON f.hospital_id = h.id
      WHERE h.state_id = $1 OR h.state = $2
      GROUP BY h.id
    `, [stateData.id, stateData.name]);

    // Get average cost per surgery category
    const surgeryCosts = await pool.query(`
      SELECT 
        s.category,
        AVG(hsp.avg_cost) as avg_cost,
        MIN(hsp.min_cost) as min_cost,
        MAX(hsp.max_cost) as max_cost,
        COUNT(DISTINCT hsp.hospital_id) as hospital_count
      FROM hospital_surgery_prices hsp
      JOIN surgeries s ON s.id = hsp.surgery_id
      JOIN hospitals h ON h.id = hsp.hospital_id
      WHERE h.state_id = $1 OR h.state = $2
      GROUP BY s.category
    `, [stateData.id, stateData.name]);

    // Get top hospitals by rating
    const topHospitals = await pool.query(`
      SELECT 
        h.id,
        h.name,
        h.city,
        AVG(f.rating) as rating,
        COUNT(f.id) as review_count
      FROM hospitals h
      LEFT JOIN feedbacks f ON f.hospital_id = h.id
      WHERE h.state_id = $1 OR h.state = $2
      GROUP BY h.id, h.name, h.city
      HAVING COUNT(f.id) > 0
      ORDER BY AVG(f.rating) DESC
      LIMIT 10
    `, [stateData.id, stateData.name]);

    return {
      state: stateData,
      hospital_count: hospitals.rows.length,
      doctor_count: hospitals.rows.reduce((sum, h) => sum + parseInt(h.doctor_count || 0), 0),
      surgery_costs: surgeryCosts.rows,
      top_hospitals: topHospitals.rows,
      hospitals: hospitals.rows,
    };
  } catch (error) {
    logger.error('Error fetching state analytics', { error: error.message });
    throw error;
  }
}

/**
 * Get surgery cost comparison across states
 */
export async function getSurgeryCostComparison(surgeryId) {
  try {
    const comparison = await pool.query(`
      SELECT 
        s.code as state_code,
        s.name as state_name,
        AVG(hsp.avg_cost) as avg_cost,
        MIN(hsp.min_cost) as min_cost,
        MAX(hsp.max_cost) as max_cost,
        COUNT(DISTINCT hsp.hospital_id) as hospital_count
      FROM hospital_surgery_prices hsp
      JOIN surgeries sur ON sur.id = hsp.surgery_id
      JOIN hospitals h ON h.id = hsp.hospital_id
      JOIN states s ON s.id = h.state_id OR s.name = h.state
      WHERE hsp.surgery_id = $1
      GROUP BY s.id, s.code, s.name
      ORDER BY avg_cost ASC
    `, [surgeryId]);

    return comparison.rows;
  } catch (error) {
    logger.error('Error fetching surgery cost comparison', { error: error.message });
    throw error;
  }
}

/**
 * Get top hospitals by affordability
 */
export async function getTopAffordableHospitals(surgeryId, limit = 10) {
  try {
    const hospitals = await pool.query(`
      SELECT 
        h.id,
        h.name,
        h.city,
        s.name as state_name,
        s.code as state_code,
        hsp.avg_cost,
        hsp.min_cost,
        hsp.max_cost,
        AVG(f.rating) as rating,
        COUNT(f.id) as review_count
      FROM hospitals h
      JOIN hospital_surgery_prices hsp ON hsp.hospital_id = h.id
      JOIN states s ON s.id = h.state_id OR s.name = h.state
      LEFT JOIN feedbacks f ON f.hospital_id = h.id
      WHERE hsp.surgery_id = $1
      GROUP BY h.id, h.name, h.city, s.name, s.code, hsp.avg_cost, hsp.min_cost, hsp.max_cost
      ORDER BY hsp.avg_cost ASC
      LIMIT $2
    `, [surgeryId, limit]);

    return hospitals.rows;
  } catch (error) {
    logger.error('Error fetching top affordable hospitals', { error: error.message });
    throw error;
  }
}

/**
 * Get top hospitals by rating
 */
export async function getTopRatedHospitals(limit = 10) {
  try {
    const hospitals = await pool.query(`
      SELECT 
        h.id,
        h.name,
        h.city,
        s.name as state_name,
        s.code as state_code,
        AVG(f.rating) as rating,
        COUNT(f.id) as review_count
      FROM hospitals h
      JOIN states s ON s.id = h.state_id OR s.name = h.state
      LEFT JOIN feedbacks f ON f.hospital_id = h.id
      GROUP BY h.id, h.name, h.city, s.name, s.code
      HAVING COUNT(f.id) > 0
      ORDER BY AVG(f.rating) DESC, COUNT(f.id) DESC
      LIMIT $1
    `, [limit]);

    return hospitals.rows;
  } catch (error) {
    logger.error('Error fetching top rated hospitals', { error: error.message });
    throw error;
  }
}

/**
 * Get monthly statewise reports
 */
export async function getMonthlyStatewiseReport(stateCode, month, year) {
  try {
    const report = await pool.query(`
      SELECT 
        s.name as state_name,
        s.code as state_code,
        COUNT(DISTINCT h.id) as hospital_count,
        COUNT(DISTINCT a.id) as appointments_count,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
        COUNT(DISTINCT m.id) as air_ambulance_missions,
        SUM(CASE WHEN hsp.avg_cost IS NOT NULL THEN 1 ELSE 0 END) as hospitals_with_pricing
      FROM states s
      LEFT JOIN hospitals h ON h.state_id = s.id OR h.state = s.name
      LEFT JOIN appointments a ON a.hospital_id = h.id 
        AND EXTRACT(MONTH FROM a.scheduled_at) = $2
        AND EXTRACT(YEAR FROM a.scheduled_at) = $3
      LEFT JOIN missions m ON (m.source_state = s.name OR m.destination_state = s.name)
        AND EXTRACT(MONTH FROM m.requested_at) = $2
        AND EXTRACT(YEAR FROM m.requested_at) = $3
      LEFT JOIN hospital_surgery_prices hsp ON hsp.hospital_id = h.id
      WHERE s.code = $1 OR $1 IS NULL
      GROUP BY s.id, s.name, s.code
      ORDER BY s.name
    `, [stateCode, month, year]);

    return report.rows;
  } catch (error) {
    logger.error('Error generating monthly report', { error: error.message });
    throw error;
  }
}

