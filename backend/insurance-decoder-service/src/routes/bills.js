import express from 'express';
import multer from 'multer';
import { query } from '../utils/db.js';
import { BillOCRService } from '../services/billOCRService.js';
import { BillAnalysisService } from '../services/billAnalysisService.js';

const router = express.Router();

// Configure multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/pdf'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  },
});

// Upload and decode hospital bill
router.post('/decode', upload.single('bill'), async (req, res, next) => {
  try {
    const { patientId, hospitalId } = req.body;
    const { userId } = req.user;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No bill file provided' });
    }
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Perform OCR on bill
    const ocrResult = await BillOCRService.extractText(req.file.buffer, req.file.mimetype);
    
    // Analyze bill contents
    const analysis = await BillAnalysisService.analyzeBill(ocrResult.text, ocrResult.structured);
    
    // Store bill image URL (in production, upload to cloud storage)
    const billImageUrl = `bills/${Date.now()}_${req.file.originalname}`; // Mock URL
    
    // Save to database
    const result = await query(
      `INSERT INTO hospital_bills (
        patient_id, hospital_id, bill_image_url, ocr_data, line_items,
        total_amount, ai_explanation, medical_codes, cheaper_alternatives
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        patientId,
        hospitalId || null,
        billImageUrl,
        JSON.stringify(ocrResult),
        JSON.stringify(analysis.line_items),
        analysis.total_amount,
        JSON.stringify(analysis.explanation),
        JSON.stringify(analysis.medical_codes),
        JSON.stringify(analysis.cheaper_alternatives)
      ]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        ocr_data: ocrResult,
        line_items: analysis.line_items,
        ai_explanation: analysis.explanation,
        medical_codes: analysis.medical_codes,
        cheaper_alternatives: analysis.cheaper_alternatives
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get bills for a patient
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
      `SELECT id, hospital_id, bill_image_url, total_amount, ai_explanation,
              medical_codes, cheaper_alternatives, created_at
       FROM hospital_bills
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [patientId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        ai_explanation: typeof row.ai_explanation === 'string' 
          ? JSON.parse(row.ai_explanation) 
          : row.ai_explanation,
        medical_codes: typeof row.medical_codes === 'string' 
          ? JSON.parse(row.medical_codes) 
          : row.medical_codes,
        cheaper_alternatives: typeof row.cheaper_alternatives === 'string' 
          ? JSON.parse(row.cheaper_alternatives) 
          : row.cheaper_alternatives
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Get bill details
router.get('/:billId', async (req, res, next) => {
  try {
    const { billId } = req.params;
    const { userId } = req.user;
    
    const result = await query(
      `SELECT hb.*, pp.user_id
       FROM hospital_bills hb
       JOIN patient_profiles pp ON hb.patient_id = pp.id
       WHERE hb.id = $1 AND pp.user_id = $2`,
      [billId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        ...row,
        ocr_data: typeof row.ocr_data === 'string' 
          ? JSON.parse(row.ocr_data) 
          : row.ocr_data,
        line_items: typeof row.line_items === 'string' 
          ? JSON.parse(row.line_items) 
          : row.line_items,
        ai_explanation: typeof row.ai_explanation === 'string' 
          ? JSON.parse(row.ai_explanation) 
          : row.ai_explanation,
        medical_codes: typeof row.medical_codes === 'string' 
          ? JSON.parse(row.medical_codes) 
          : row.medical_codes,
        cheaper_alternatives: typeof row.cheaper_alternatives === 'string' 
          ? JSON.parse(row.cheaper_alternatives) 
          : row.cheaper_alternatives
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as billsRouter };

