import express from 'express';
import multer from 'multer';
import { query } from '../utils/db.js';
import { ClaimOCRService } from '../services/claimOCRService.js';
import { ClaimAnalysisService } from '../services/claimAnalysisService.js';

const router = express.Router();

// Configure multer for document upload
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

// Upload and analyze insurance claim
router.post('/analyze', upload.single('claim'), async (req, res, next) => {
  try {
    const { patientId, claimType } = req.body;
    const { userId } = req.user;
    
    if (!req.file) {
      return res.status(400).json({ error: 'No claim document provided' });
    }
    
    // Verify patient belongs to user
    const patientCheck = await query(
      'SELECT id FROM patient_profiles WHERE id = $1 AND user_id = $2',
      [patientId, userId]
    );
    
    if (patientCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Perform OCR on claim document
    const ocrResult = await ClaimOCRService.extractText(req.file.buffer, req.file.mimetype);
    
    // Analyze claim
    const analysis = await ClaimAnalysisService.analyzeClaim(ocrResult.text, ocrResult.structured);
    
    // Store claim document URL (in production, upload to cloud storage)
    const claimDocUrl = `claims/${Date.now()}_${req.file.originalname}`; // Mock URL
    
    // Save to database
    const result = await query(
      `INSERT INTO insurance_claims (
        patient_id, claim_document_url, ocr_data, claim_type, status,
        ai_analysis, missing_documents
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        patientId,
        claimDocUrl,
        JSON.stringify(ocrResult),
        claimType || 'general',
        analysis.status,
        JSON.stringify(analysis),
        JSON.stringify(analysis.missing_documents || [])
      ]
    );
    
    res.json({
      success: true,
      data: {
        ...result.rows[0],
        ocr_data: ocrResult,
        ai_analysis: analysis,
        missing_documents: analysis.missing_documents || []
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get claims for a patient
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
      `SELECT id, claim_document_url, claim_type, status, ai_analysis,
              missing_documents, created_at, updated_at
       FROM insurance_claims
       WHERE patient_id = $1
       ORDER BY created_at DESC`,
      [patientId]
    );
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        ai_analysis: typeof row.ai_analysis === 'string' 
          ? JSON.parse(row.ai_analysis) 
          : row.ai_analysis,
        missing_documents: typeof row.missing_documents === 'string' 
          ? JSON.parse(row.missing_documents) 
          : row.missing_documents
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Get claim details
router.get('/:claimId', async (req, res, next) => {
  try {
    const { claimId } = req.params;
    const { userId } = req.user;
    
    const result = await query(
      `SELECT ic.*, pp.user_id
       FROM insurance_claims ic
       JOIN patient_profiles pp ON ic.patient_id = pp.id
       WHERE ic.id = $1 AND pp.user_id = $2`,
      [claimId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    
    const row = result.rows[0];
    res.json({
      success: true,
      data: {
        ...row,
        ocr_data: typeof row.ocr_data === 'string' 
          ? JSON.parse(row.ocr_data) 
          : row.ocr_data,
        ai_analysis: typeof row.ai_analysis === 'string' 
          ? JSON.parse(row.ai_analysis) 
          : row.ai_analysis,
        missing_documents: typeof row.missing_documents === 'string' 
          ? JSON.parse(row.missing_documents) 
          : row.missing_documents
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as claimsRouter };

