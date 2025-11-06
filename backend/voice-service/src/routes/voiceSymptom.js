import express from 'express';
import multer from 'multer';
import { query } from '../utils/db.js';
import { SpeechToTextService } from '../services/speechToTextService.js';
import { SymptomExtractionService } from '../services/symptomExtractionService.js';

const router = express.Router();

// Configure multer for audio upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/ogg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  },
});

// Upload voice symptom log
router.post('/upload', upload.single('audio'), async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const { userId } = req.user;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Convert audio to text
    const transcript = await SpeechToTextService.transcribe(req.file.buffer, req.file.mimetype);
    
    // Extract symptom data from transcript
    const symptomData = await SymptomExtractionService.extractSymptoms(transcript);
    
    // Store audio file (in production, upload to cloud storage)
    const audioUrl = `audio/${Date.now()}_${req.file.originalname}`; // Mock URL
    
    // Save to database
    const result = await query(
      `INSERT INTO voice_symptom_logs (patient_id, audio_url, transcript, symptom_data, timestamp)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [patientId, audioUrl, transcript, JSON.stringify(symptomData)]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        symptom_data: symptomData,
        transcript
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get voice symptom history
router.get('/history/:patientId', async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { userId } = req.user;
    const { limit = 50, offset = 0 } = req.query;
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    const result = await query(
      `SELECT id, audio_url, transcript, symptom_data, timestamp, created_at
       FROM voice_symptom_logs
       WHERE patient_id = $1
       ORDER BY timestamp DESC
       LIMIT $2 OFFSET $3`,
      [patientId, parseInt(limit), parseInt(offset)]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        symptom_data: typeof row.symptom_data === 'string' 
          ? JSON.parse(row.symptom_data) 
          : row.symptom_data
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Transcribe text directly (for text input)
router.post('/transcribe-text', async (req, res, next) => {
  try {
    const { patientId, text } = req.body;
    const { userId } = req.user;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Extract symptom data from text
    const symptomData = await SymptomExtractionService.extractSymptoms(text);
    
    // Save to database
    const result = await query(
      `INSERT INTO voice_symptom_logs (patient_id, transcript, symptom_data, timestamp)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [patientId, text, JSON.stringify(symptomData)]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        symptom_data: symptomData
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as voiceSymptomRouter };

