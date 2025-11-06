import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware, doctorMiddleware } from './middleware/auth.js';
import { doctorCoPilotRouter } from './routes/notes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3021;

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
  res.json({ status: 'healthy', service: 'doctor-copilot-service' });
});

// Routes (require doctor role)
app.use('/api/v1/doctor-copilot', authMiddleware, doctorMiddleware, doctorCoPilotRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Doctor Co-Pilot Service running on port ${PORT}`);
});

export default app;

