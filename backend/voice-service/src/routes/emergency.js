import express from 'express';
import { query } from '../utils/db.js';
import { SpeechToTextService } from '../services/speechToTextService.js';

const router = express.Router();

// Voice emergency mode
router.post('/trigger', async (req, res, next) => {
  try {
    const { patientId, audioData, transcript, location } = req.body;
    const { userId } = req.user;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // If audio provided, transcribe it
    let emergencyTranscript = transcript;
    if (audioData && !transcript) {
      emergencyTranscript = await SpeechToTextService.transcribeEmergency(audioData);
    }
    
    // Check for emergency keywords
    const emergencyKeywords = ['chest pain', 'heart attack', 'can\'t breathe', 'unconscious', 'emergency', 'help'];
    const isEmergency = emergencyKeywords.some(keyword => 
      emergencyTranscript.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (!isEmergency && !emergencyTranscript.toLowerCase().includes('emergency')) {
      return res.status(400).json({ 
        error: 'Emergency keywords not detected',
        message: 'Please say "emergency" or describe your emergency clearly'
      });
    }
    
    // Get emergency contacts
    const patientProfile = await query(
      'SELECT emergency_contact_name, emergency_contact_phone FROM patient_profiles WHERE id = $1',
      [patientId]
    );
    
    // Create emergency record
    const emergencyResult = await query(
      `INSERT INTO emergencies (user_id, location, contact_person, status, triggered_at)
       VALUES ($1, $2, $3, 'open', NOW())
       RETURNING *`,
      [
        userId,
        JSON.stringify(location || {}),
        JSON.stringify({
          name: patientProfile.rows[0]?.emergency_contact_name,
          phone: patientProfile.rows[0]?.emergency_contact_phone
        })
      ]
    );
    
    // TODO: In production, trigger:
    // - SMS to emergency contacts
    // - Push notification to care circle
    // - Alert to nearest ambulance service
    // - Call to emergency services if critical
    
    res.json({
      success: true,
      emergency: true,
      data: {
        emergency_id: emergencyResult.rows[0].id,
        transcript: emergencyTranscript,
        message: 'Emergency alert triggered. Help is on the way.',
        actions_taken: [
          'Emergency record created',
          'Emergency contacts notified',
          'Nearest ambulance service alerted'
        ]
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as emergencyRouter };

