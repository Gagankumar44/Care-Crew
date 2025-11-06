import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { scannerRouter } from './routes/scanner.js';
import { remindersRouter } from './routes/reminders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
  res.json({ status: 'healthy', service: 'medicine-scanner-service' });
});

// Routes
app.use('/api/v1/medicines', authMiddleware, scannerRouter);
app.use('/api/v1/reminders', authMiddleware, remindersRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Medicine Scanner Service running on port ${PORT}`);
});

export default app;

