import express from 'express';
import { query } from '../utils/db.js';

const router = express.Router();

// Add member to care circle
router.post('/', async (req, res, next) => {
  try {
    const { patientId, memberUserId, memberType, relationship, permissions } = req.body;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Verify member user exists
    const memberCheck = await query(
      'SELECT id, email FROM users WHERE id = $1',
      [memberUserId]
    );
    
    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Member user not found' });
    }
    
    // Check if already a member
    const existingCheck = await query(
      'SELECT id FROM care_circle_members WHERE patient_id = $1 AND member_user_id = $2',
      [patientId, memberUserId]
    );
    
    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Member already in care circle' });
    }
    
    // Insert member
    const result = await query(
      `INSERT INTO care_circle_members (
        patient_id, member_user_id, member_type, relationship, permissions
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        patientId,
        memberUserId,
        memberType || 'family',
        relationship,
        JSON.stringify(permissions || { view_reports: true, receive_alerts: true })
      ]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        permissions: typeof result.rows[0].permissions === 'string' 
          ? JSON.parse(result.rows[0].permissions) 
          : result.rows[0].permissions,
        member_email: memberCheck.rows[0].email
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get care circle members
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
      `SELECT ccm.*, u.email, u.first_name, u.last_name
       FROM care_circle_members ccm
       JOIN users u ON ccm.member_user_id = u.id
       WHERE ccm.patient_id = $1
       ORDER BY ccm.is_primary DESC, ccm.created_at ASC`,
      [patientId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        permissions: typeof row.permissions === 'string' 
          ? JSON.parse(row.permissions) 
          : row.permissions
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Get patients I'm caring for
router.get('/my-patients', async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    const result = await query(
      `SELECT ccm.*, pp.id as patient_id, u.email, u.first_name, u.last_name
       FROM care_circle_members ccm
       JOIN patient_profiles pp ON ccm.patient_id = pp.id
       JOIN users u ON pp.user_id = u.id
       WHERE ccm.member_user_id = $1
       ORDER BY ccm.created_at DESC`,
      [userId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        permissions: typeof row.permissions === 'string' 
          ? JSON.parse(row.permissions) 
          : row.permissions
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Update member permissions
router.patch('/:memberId', async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { permissions, is_primary } = req.body;
    const { userId } = req.user;
    
    // Verify member belongs to user's patient
    const memberCheck = await query(
      `SELECT ccm.* FROM care_circle_members ccm
       JOIN patient_profiles pp ON ccm.patient_id = pp.id
       WHERE ccm.id = $1 AND pp.user_id = $2`,
      [memberId, userId]
    );
    
    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    const updateFields = [];
    const values = [];
    let paramIndex = 1;
    
    if (permissions !== undefined) {
      updateFields.push(`permissions = $${paramIndex++}`);
      values.push(JSON.stringify(permissions));
    }
    
    if (is_primary !== undefined) {
      // If setting as primary, unset other primary members
      if (is_primary) {
        await query(
          'UPDATE care_circle_members SET is_primary = FALSE WHERE patient_id = $1',
          [memberCheck.rows[0].patient_id]
        );
      }
      updateFields.push(`is_primary = $${paramIndex++}`);
      values.push(is_primary);
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    values.push(memberId);
    
    const result = await query(
      `UPDATE care_circle_members SET ${updateFields.join(', ')}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        permissions: typeof result.rows[0].permissions === 'string' 
          ? JSON.parse(result.rows[0].permissions) 
          : result.rows[0].permissions
      }
    });
  } catch (error) {
    next(error);
  }
});

// Remove member from care circle
router.delete('/:memberId', async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const { userId } = req.user;
    
    // Verify member belongs to user's patient
    const memberCheck = await query(
      `SELECT ccm.* FROM care_circle_members ccm
       JOIN patient_profiles pp ON ccm.patient_id = pp.id
       WHERE ccm.id = $1 AND pp.user_id = $2`,
      [memberId, userId]
    );
    
    if (memberCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    await query('DELETE FROM care_circle_members WHERE id = $1', [memberId]);
    
    res.json({ success: true, message: 'Member removed from care circle' });
  } catch (error) {
    next(error);
  }
});

export { router as membersRouter };

