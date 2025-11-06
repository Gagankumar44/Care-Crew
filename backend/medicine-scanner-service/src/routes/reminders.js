import express from 'express';
import { query } from '../utils/db.js';

const router = express.Router();

// Create medicine reminder
router.post('/', async (req, res, next) => {
  try {
    const { patientId, medicineId, medicineName, dosage, frequency, schedule } = req.body;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const result = await query(
      `INSERT INTO medicine_reminders (
        patient_id, medicine_id, medicine_name, dosage, frequency, schedule, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING *`,
      [
        patientId,
        medicineId || null,
        medicineName,
        dosage,
        frequency,
        JSON.stringify(schedule || {})
      ]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        schedule: typeof result.rows[0].schedule === 'string' 
          ? JSON.parse(result.rows[0].schedule) 
          : result.rows[0].schedule
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get reminders for a patient
router.get('/patient/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const result = await query(
      `SELECT id, medicine_id, medicine_name, dosage, frequency, schedule, is_active, created_at
       FROM medicine_reminders
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [patientId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        schedule: typeof row.schedule === 'string' 
          ? JSON.parse(row.schedule) 
          : row.schedule
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Update reminder
router.patch('/:reminderId', async (req, res, next) => {
  try {
    const { reminderId } = req.params;
    const { dosage, frequency, schedule, is_active } = req.body;
    const { userId } = req.user;
    
    // Verify reminder belongs to user's patient
    const reminderCheck = await query(
      `SELECT mr.* FROM medicine_reminders mr
       JOIN patient_profiles pp ON mr.patient_id = pp.id
       WHERE mr.id = $1 AND pp.user_id = $2`,
      [reminderId, userId]
    );
    
    if (reminderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (dosage !== undefined) {
      updateFields.push(`dosage = $${paramIndex++}`);
      values.push(dosage);
    }
    if (frequency !== undefined) {
      updateFields.push(`frequency = $${paramIndex++}`);
      values.push(frequency);
    }
    if (schedule !== undefined) {
      updateFields.push(`schedule = $${paramIndex++}`);
      values.push(JSON.stringify(schedule));
    }
    if (is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      values.push(is_active);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(reminderId);
    
    const result = await query(
      `UPDATE medicine_reminders SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        schedule: typeof result.rows[0].schedule === 'string' 
          ? JSON.parse(result.rows[0].schedule) 
          : result.rows[0].schedule
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete reminder
router.delete('/:reminderId', async (req, res, next) => {
  try {
    const { reminderId } = req.params;
    const { userId } = req.user;
    
    // Verify reminder belongs to user's patient
    const reminderCheck = await query(
      `SELECT mr.* FROM medicine_reminders mr
       JOIN patient_profiles pp ON mr.patient_id = pp.id
       WHERE mr.id = $1 AND pp.user_id = $2`,
      [reminderId, userId]
    );
    
    if (reminderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    
    await query('DELETE FROM medicine_reminders WHERE id = $1', [reminderId]);
    
    res.json({ success: true, message: 'Reminder deleted' });
  } catch (error) {
    next(error);
  }
});

export { router as remindersRouter };

