import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { voiceSymptomRouter } from './routes/voiceSymptom.js';
import { voiceNotesRouter } from './routes/voiceNotes.js';
import { emergencyRouter } from './routes/emergency.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3011;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'voice-service' });
});

// Routes
app.use('/api/v1/voice/symptoms', authMiddleware, voiceSymptomRouter);
app.use('/api/v1/voice/notes', authMiddleware, voiceNotesRouter);
app.use('/api/v1/voice/emergency', authMiddleware, emergencyRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Voice Service running on port ${PORT}`);
});

export default app;

