import express from 'express';
import multer from 'multer';
import { query } from '../utils/db.js';
import { MedicineRecognitionService } from '../services/medicineRecognitionService.js';
import { DrugInteractionService } from '../services/drugInteractionService.js';

const router = express.Router();

// Configure multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  },
});

// Scan medicine image
router.post('/scan', upload.single('image'), async (req, res, next) => {
  try {
    const { patientId } = req.body;
    const { userId } = req.user;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Recognize medicine from image
    const recognitionResult = await MedicineRecognitionService.recognize(req.file.buffer);
    
    if (!recognitionResult.success) {
      return res.status(400).json({ 
        error: 'Could not recognize medicine',
        details: recognitionResult.error 
      });
    }
    
    // Check for drug interactions with patient's medication history
    const interactions = await DrugInteractionService.checkInteractions(
      patientId,
      recognitionResult.medicine
    );
    
    // Check expiry date
    const expiryCheck = recognitionResult.medicine.expiry_date 
      ? MedicineRecognitionService.checkExpiry(recognitionResult.medicine.expiry_date)
      : { is_expired: false, is_counterfeit: false };
    
    // Store image URL (in production, upload to cloud storage)
    const imageUrl = `medicines/${Date.now()}_${req.file.originalname}`; // Mock URL
    
    // Save to database
    const result = await query(
      `INSERT INTO scanned_medicines (
        patient_id, image_url, medicine_name, generic_name, manufacturer,
        dosage_info, warnings, interactions, expiry_date, is_expired, is_counterfeit
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        patientId,
        imageUrl,
        recognitionResult.medicine.name,
        recognitionResult.medicine.generic_name,
        recognitionResult.medicine.manufacturer,
        JSON.stringify(recognitionResult.medicine.dosage),
        JSON.stringify(recognitionResult.medicine.warnings),
        JSON.stringify(interactions),
        recognitionResult.medicine.expiry_date,
        expiryCheck.is_expired,
        expiryCheck.is_counterfeit
      ]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        medicine: recognitionResult.medicine,
        interactions,
        expiry_check: expiryCheck,
        warnings: recognitionResult.medicine.warnings || []
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get scanned medicines for a patient
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
      `SELECT id, image_url, medicine_name, generic_name, manufacturer,
              dosage_info, warnings, interactions, expiry_date, is_expired,
              is_counterfeit, created_at
       FROM scanned_medicines
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [patientId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        dosage_info: typeof row.dosage_info === 'string' 
          ? JSON.parse(row.dosage_info) 
          : row.dosage_info,
        warnings: typeof row.warnings === 'string' 
          ? JSON.parse(row.warnings) 
          : row.warnings,
        interactions: typeof row.interactions === 'string' 
          ? JSON.parse(row.interactions) 
          : row.interactions
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Get medicine details by ID
router.get('/:medicineId', async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    const { userId } = req.user;
    
    const result = await query(
      `SELECT sm.*, pp.user_id
       FROM scanned_medicines sm
       JOIN patient_profiles pp ON sm.patient_id = pp.id
       WHERE sm.id = $1 AND pp.user_id = $2`,
      [medicineId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    const row = result.rows[0];
    
    res.json({
      success: true,
      data: {
        ...row,
        dosage_info: typeof row.dosage_info === 'string' 
          ? JSON.parse(row.dosage_info) 
          : row.dosage_info,
        warnings: typeof row.warnings === 'string' 
          ? JSON.parse(row.warnings) 
          : row.warnings,
        interactions: typeof row.interactions === 'string' 
          ? JSON.parse(row.interactions) 
          : row.interactions
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as scannerRouter };

