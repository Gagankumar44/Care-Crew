import express from 'express';
import multer from 'multer';
import { query } from '../utils/db.js';
import { SpeechToTextService } from '../services/speechToTextService.js';
import { SOAPNotesService } from '../services/soapNotesService.js';

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

// Upload doctor notes audio
router.post('/upload', upload.single('audio'), async (req, res, next) => {
  try {
    const { consultationId, doctorId, patientId } = req.body;
    const { userId } = req.user;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    
    // Verify doctor (if provided)
    if (doctorId) {
      const doctorCheck = await query(
        'SELECT id FROM doctors WHERE id = $1 AND user_id = $2',
        [doctorId, userId]
      );
      
      if (doctorCheck.rows.length === 0 && req.user.role !== 'doctor') {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    
    // Convert audio to text
    const transcript = await SpeechToTextService.transcribe(req.file.buffer, req.file.mimetype);
    
    // Convert to structured SOAP notes
    const soapNotes = await SOAPNotesService.convertToSOAP(transcript);
    
    // Store audio file (in production, upload to cloud storage)
    const audioUrl = `audio/doctor_notes/${Date.now()}_${req.file.originalname}`; // Mock URL
    
    // Save to database
    const result = await query(
      `INSERT INTO voice_doctor_notes (consultation_id, doctor_id, audio_url, transcript, structured_notes, soap_notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        consultationId,
        doctorId,
        audioUrl,
        transcript,
        JSON.stringify({ raw: transcript, structured: soapNotes }),
        JSON.stringify(soapNotes)
      ]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        soap_notes: soapNotes,
        transcript
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get doctor notes
router.get('/consultation/:consultationId', async (req, res, next) => {
  try {
    const { consultationId } = req.params;
    const { userId } = req.user;
    
    const result = await query(
      `SELECT vdn.*, d.name as doctor_name
       FROM voice_doctor_notes vdn
       LEFT JOIN doctors d ON vdn.doctor_id = d.id
       WHERE vdn.consultation_id = $1
       ORDER BY vdn.created_at DESC`,
      [consultationId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        structured_notes: typeof row.structured_notes === 'string' 
          ? JSON.parse(row.structured_notes) 
          : row.structured_notes,
        soap_notes: typeof row.soap_notes === 'string' 
          ? JSON.parse(row.soap_notes) 
          : row.soap_notes
      }))
    });
  } catch (error) {
    next(error);
  }
});

export { router as voiceNotesRouter };

