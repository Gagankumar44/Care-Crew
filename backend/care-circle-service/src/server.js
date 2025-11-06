import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { membersRouter } from './routes/members.js';
import { sharedReportsRouter } from './routes/sharedReports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3014;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

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
  res.json({ status: 'healthy', service: 'care-circle-service' });
});

// Routes
app.use('/api/v1/care-circle/members', authMiddleware, membersRouter);
app.use('/api/v1/care-circle/shared-reports', authMiddleware, sharedReportsRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Care Circle Service running on port ${PORT}`);
});

export default app;

