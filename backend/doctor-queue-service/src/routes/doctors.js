import express from 'express';
import { query } from '../utils/db.js';

const router = express.Router();

// Get doctors near a location
router.get('/nearby', async (req, res, next) => {
  try {
    const { lat, lng, radius = 10, specialty } = req.query; // radius in km
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Calculate distance using Haversine formula
    let queryText;
    let params;
    
    if (specialty) {
      queryText = `
        SELECT 
          id, name, specialty, qualification, clinic_name,
          location_lat, location_lng, address, phone, email,
          is_available, available_slots,
          (
            6371 * acos(
              cos(radians($1)) * 
              cos(radians(location_lat)) * 
              cos(radians(location_lng) - radians($2)) + 
              sin(radians($1)) * 
              sin(radians(location_lat))
            )
          ) AS distance_km
        FROM doctors
        WHERE is_available = TRUE AND specialty = $3
          AND (
            6371 * acos(
              cos(radians($1)) * 
              cos(radians(location_lat)) * 
              cos(radians(location_lng) - radians($2)) + 
              sin(radians($1)) * 
              sin(radians(location_lat))
            )
          ) <= $4
        ORDER BY distance_km ASC
        LIMIT 50
      `;
      params = [parseFloat(lat), parseFloat(lng), specialty, parseFloat(radius)];
    } else {
      queryText = `
        SELECT 
          id, name, specialty, qualification, clinic_name,
          location_lat, location_lng, address, phone, email,
          is_available, available_slots,
          (
            6371 * acos(
              cos(radians($1)) * 
              cos(radians(location_lat)) * 
              cos(radians(location_lng) - radians($2)) + 
              sin(radians($1)) * 
              sin(radians(location_lat))
            )
          ) AS distance_km
        FROM doctors
        WHERE is_available = TRUE
          AND (
            6371 * acos(
              cos(radians($1)) * 
              cos(radians(location_lat)) * 
              cos(radians(location_lng) - radians($2)) + 
              sin(radians($1)) * 
              sin(radians(location_lat))
            )
          ) <= $3
        ORDER BY distance_km ASC
        LIMIT 50
      `;
      params = [parseFloat(lat), parseFloat(lng), parseFloat(radius)];
    }
    
    const result = await query(queryText, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Get doctor details
router.get('/:doctorId', async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    
    const result = await query(
      `SELECT id, name, specialty, qualification, clinic_name,
              location_lat, location_lng, address, phone, email,
              is_available, available_slots, created_at
       FROM doctors
       WHERE id = $1`,
      [doctorId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    
    // Get current queue info
    const queueResult = await query(
      `SELECT COUNT(*) as waiting_count,
              MIN(queue_number) as next_queue_number
       FROM walk_in_queue
       WHERE doctor_id = $1 AND status = 'waiting'`,
      [doctorId]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        queue_info: {
          waiting_count: parseInt(queueResult.rows[0].waiting_count),
          next_queue_number: queueResult.rows[0].next_queue_number ? parseInt(queueResult.rows[0].next_queue_number) : null
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Search doctors
router.get('/search', async (req, res, next) => {
  try {
    const { q, specialty } = req.query;
    
    let queryText = `
      SELECT id, name, specialty, clinic_name, location_lat, location_lng,
             address, phone, is_available
      FROM doctors
      WHERE is_available = TRUE
    `;
    const params = [];
    let paramIndex = 1;
    
    if (q) {
      queryText += ` AND (name ILIKE $${paramIndex} OR clinic_name ILIKE $${paramIndex})`;
      params.push(`%${q}%`);
      paramIndex++;
    }
    
    if (specialty) {
      queryText += ` AND specialty = $${paramIndex}`;
      params.push(specialty);
      paramIndex++;
    }
    
    queryText += ' ORDER BY name ASC LIMIT 50';
    
    const result = await query(queryText, params);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

export { router as doctorsRouter };

