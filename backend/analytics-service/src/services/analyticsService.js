import { pool } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Record surgery demand
 */
export async function recordSurgeryDemand(demandData) {
  try {
    const {
      hospitalId,
      stateCode,
      surgeryType,
      specialty,
      demandCount,
      date,
      metadata = {},
    } = demandData;

    const result = await pool.query(
      `INSERT INTO surgery_demand_history (
        hospital_id, state_code, surgery_type, specialty,
        demand_count, date, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        hospitalId,
        stateCode,
        surgeryType,
        specialty,
        demandCount || 0,
        date || new Date().toISOString().split('T')[0],
        JSON.stringify(metadata),
      ]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error recording surgery demand', { error: error.message });
    throw error;
  }
}

/**
 * Get historical surgery demand
 */
export async function getHistoricalDemand(filters = {}) {
  try {
    let query = 'SELECT * FROM surgery_demand_history WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.hospitalId) {
      query += ` AND hospital_id = $${paramIndex++}`;
      params.push(filters.hospitalId);
    }

    if (filters.stateCode) {
      query += ` AND state_code = $${paramIndex++}`;
      params.push(filters.stateCode);
    }

    if (filters.surgeryType) {
      query += ` AND surgery_type = $${paramIndex++}`;
      params.push(filters.surgeryType);
    }

    if (filters.specialty) {
      query += ` AND specialty = $${paramIndex++}`;
      params.push(filters.specialty);
    }

    if (filters.startDate) {
      query += ` AND date >= $${paramIndex++}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND date <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    query += ' ORDER BY date DESC';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching historical demand', { error: error.message });
    throw error;
  }
}

/**
 * Generate surgery demand prediction
 * Note: This is a simplified version. In production, this would use ML models
 */
export async function generatePrediction(predictionData) {
  try {
    const {
      hospitalId,
      stateCode,
      surgeryType,
      specialty,
      predictedDemand,
      confidenceLevel,
      predictionDate,
      forecastPeriodDays = 30,
      modelVersion = 'v1.0',
      factors = {},
    } = predictionData;

    const result = await pool.query(
      `INSERT INTO surgery_demand_predictions (
        hospital_id, state_code, surgery_type, specialty,
        predicted_demand, confidence_level, prediction_date,
        forecast_period_days, model_version, factors
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        hospitalId,
        stateCode,
        surgeryType,
        specialty,
        predictedDemand,
        confidenceLevel || 0.75,
        predictionDate || new Date().toISOString().split('T')[0],
        forecastPeriodDays,
        modelVersion,
        JSON.stringify(factors),
      ]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error generating prediction', { error: error.message });
    throw error;
  }
}

/**
 * Get predictions
 */
export async function getPredictions(filters = {}) {
  try {
    let query = 'SELECT * FROM surgery_demand_predictions WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.hospitalId) {
      query += ` AND hospital_id = $${paramIndex++}`;
      params.push(filters.hospitalId);
    }

    if (filters.stateCode) {
      query += ` AND state_code = $${paramIndex++}`;
      params.push(filters.stateCode);
    }

    if (filters.surgeryType) {
      query += ` AND surgery_type = $${paramIndex++}`;
      params.push(filters.surgeryType);
    }

    if (filters.specialty) {
      query += ` AND specialty = $${paramIndex++}`;
      params.push(filters.specialty);
    }

    query += ' ORDER BY prediction_date DESC, created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching predictions', { error: error.message });
    throw error;
  }
}

/**
 * Get aggregated demand statistics
 */
export async function getDemandStatistics(filters = {}) {
  try {
    let query = `
      SELECT 
        surgery_type,
        specialty,
        COUNT(*) as total_records,
        SUM(demand_count) as total_demand,
        AVG(demand_count) as avg_demand,
        MAX(demand_count) as max_demand,
        MIN(demand_count) as min_demand
      FROM surgery_demand_history
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (filters.hospitalId) {
      query += ` AND hospital_id = $${paramIndex++}`;
      params.push(filters.hospitalId);
    }

    if (filters.stateCode) {
      query += ` AND state_code = $${paramIndex++}`;
      params.push(filters.stateCode);
    }

    if (filters.startDate) {
      query += ` AND date >= $${paramIndex++}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND date <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    query += ' GROUP BY surgery_type, specialty ORDER BY total_demand DESC';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching demand statistics', { error: error.message });
    throw error;
  }
}

/**
 * Record resource utilization
 */
export async function recordResourceUtilization(utilizationData) {
  try {
    const {
      hospitalId,
      stateCode,
      resourceType,
      resourceName,
      utilizationPercentage,
      date,
      metadata = {},
    } = utilizationData;

    const result = await pool.query(
      `INSERT INTO resource_utilization (
        hospital_id, state_code, resource_type, resource_name,
        utilization_percentage, date, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        hospitalId,
        stateCode,
        resourceType,
        resourceName,
        utilizationPercentage,
        date || new Date().toISOString().split('T')[0],
        JSON.stringify(metadata),
      ]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error recording resource utilization', { error: error.message });
    throw error;
  }
}

/**
 * Get resource utilization
 */
export async function getResourceUtilization(filters = {}) {
  try {
    let query = 'SELECT * FROM resource_utilization WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.hospitalId) {
      query += ` AND hospital_id = $${paramIndex++}`;
      params.push(filters.hospitalId);
    }

    if (filters.stateCode) {
      query += ` AND state_code = $${paramIndex++}`;
      params.push(filters.stateCode);
    }

    if (filters.resourceType) {
      query += ` AND resource_type = $${paramIndex++}`;
      params.push(filters.resourceType);
    }

    if (filters.startDate) {
      query += ` AND date >= $${paramIndex++}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      query += ` AND date <= $${paramIndex++}`;
      params.push(filters.endDate);
    }

    query += ' ORDER BY date DESC';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching resource utilization', { error: error.message });
    throw error;
  }
}

/**
 * Generate analytics report
 */
export async function generateAnalyticsReport(reportData) {
  try {
    const {
      reportType,
      scope,
      scopeId,
      periodStart,
      periodEnd,
      reportData: reportDataJson,
      generatedBy,
    } = reportData;

    const result = await pool.query(
      `INSERT INTO analytics_reports (
        report_type, scope, scope_id, period_start, period_end,
        report_data, generated_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        reportType,
        scope,
        scopeId,
        periodStart,
        periodEnd,
        JSON.stringify(reportDataJson),
        generatedBy,
      ]
    );
    return result.rows[0];
  } catch (error) {
    logger.error('Error generating analytics report', { error: error.message });
    throw error;
  }
}

/**
 * Get analytics reports
 */
export async function getAnalyticsReports(filters = {}) {
  try {
    let query = 'SELECT * FROM analytics_reports WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (filters.reportType) {
      query += ` AND report_type = $${paramIndex++}`;
      params.push(filters.reportType);
    }

    if (filters.scope) {
      query += ` AND scope = $${paramIndex++}`;
      params.push(filters.scope);
    }

    if (filters.scopeId) {
      query += ` AND scope_id = $${paramIndex++}`;
      params.push(filters.scopeId);
    }

    query += ' ORDER BY generated_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  } catch (error) {
    logger.error('Error fetching analytics reports', { error: error.message });
    throw error;
  }
}

