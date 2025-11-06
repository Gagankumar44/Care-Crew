import express from 'express';
import { query } from '../utils/db.js';

const router = express.Router();

// Join walk-in queue
router.post('/walk-in', async (req, res, next) => {
  try {
    const { doctorId, patientId } = req.body;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Get current max queue number for this doctor
    const maxQueueResult = await query(
      `SELECT COALESCE(MAX(queue_number), 0) as max_queue
       FROM walk_in_queue
       WHERE doctor_id = $1 AND DATE(checked_in_at) = CURRENT_DATE`,
      [doctorId]
    );
    
    const nextQueueNumber = parseInt(maxQueueResult.rows[0].max_queue) + 1;
    
    // Estimate wait time (assume 15 minutes per patient)
    const waitingCountResult = await query(
      `SELECT COUNT(*) as waiting_count
       FROM walk_in_queue
       WHERE doctor_id = $1 AND status = 'waiting'`,
      [doctorId]
    );
    
    const waitingCount = parseInt(waitingCountResult.rows[0].waiting_count);
    const estimatedWaitTime = waitingCount * 15; // minutes
    
    // Insert into queue
    const insertResult = await query(
      `INSERT INTO walk_in_queue (doctor_id, patient_id, queue_number, estimated_wait_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [doctorId, patientId, nextQueueNumber, estimatedWaitTime]
    );
    
    // Emit real-time update via WebSocket
    const io = req.app.get('io');
    if (io) {
      io.to(`doctor:${doctorId}`).emit('queue-updated', {
        queueId: insertResult.rows[0].id,
        queueNumber: nextQueueNumber,
        waitingCount: waitingCount + 1
      });
    }
    
    res.json({
      success: true,
      data: {
        ...insertResult.rows[0],
        estimated_wait_time_minutes: estimatedWaitTime
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get queue status
router.get('/status/:queueId', async (req, res, next) => {
  try {
    const { queueId } = req.params;
    const { userId } = req.user;
    
    const result = await query(
      `SELECT wiq.*, d.name as doctor_name, d.clinic_name
       FROM walk_in_queue wiq
       JOIN doctors d ON wiq.doctor_id = d.id
       JOIN patient_profiles pp ON wiq.patient_id = pp.id
       WHERE wiq.id = $1 AND pp.user_id = $2`,
      [queueId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Queue entry not found' });
    }
    
    // Get position in queue
    const positionResult = await query(
      `SELECT COUNT(*) as position
       FROM walk_in_queue
       WHERE doctor_id = $1 AND status = 'waiting' AND queue_number < $2`,
      [result.rows[0].doctor_id, result.rows[0].queue_number]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        position_in_queue: parseInt(positionResult.rows[0].position) + 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get queue for a doctor (doctor view)
router.get('/doctor/:doctorId', async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { userId } = req.user;
    
    // Verify doctor belongs to user
    const doctorCheck = await query(
      'SELECT id FROM doctors WHERE id = $1 AND user_id = $2',
      [doctorId, userId]
    );
    
    if (doctorCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const result = await query(
      `SELECT wiq.*, pp.id as patient_id, u.first_name, u.last_name
       FROM walk_in_queue wiq
       JOIN patient_profiles pp ON wiq.patient_id = pp.id
       JOIN users u ON pp.user_id = u.id
       WHERE wiq.doctor_id = $1 AND wiq.status = 'waiting'
       ORDER BY wiq.queue_number ASC`,
      [doctorId]
    );
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
});

// Update queue status (doctor calls next patient)
router.patch('/:queueId/status', async (req, res, next) => {
  try {
    const { queueId } = req.params;
    const { status } = req.body; // 'in_progress', 'completed', 'cancelled'
    const { userId } = req.user;
    
    // Verify queue belongs to doctor's queue
    const queueCheck = await query(
      `SELECT wiq.* FROM walk_in_queue wiq
       JOIN doctors d ON wiq.doctor_id = d.id
       WHERE wiq.id = $1 AND d.user_id = $2`,
      [queueId, userId]
    );
    
    if (queueCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updateData = { status };
    if (status === 'in_progress') {
      updateData.called_at = new Date();
    } else if (status === 'completed') {
      updateData.completed_at = new Date();
    }
    
    const updateFields = Object.keys(updateData).map((key, index) => 
      `${key} = $${index + 2}`
    ).join(', ');
    
    const result = await query(
      `UPDATE walk_in_queue SET ${updateFields}
       WHERE id = $1
       RETURNING *`,
      [queueId, ...Object.values(updateData)]
    );
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`doctor:${queueCheck.rows[0].doctor_id}`).emit('queue-updated', {
        queueId,
        status
      });
      io.to(`queue:${queueId}`).emit('status-updated', {
        queueId,
        status
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

export { router as queueRouter };

