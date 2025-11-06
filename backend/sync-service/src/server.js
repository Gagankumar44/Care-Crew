import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { syncRouter } from './routes/sync.js';
import syncService from './services/syncService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3023;

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
  res.json({ status: 'healthy', service: 'sync-service' });
});

// Routes
app.use('/api/v1/sync', authMiddleware, syncRouter);

// Scheduled sync job (runs every 15 minutes)
cron.schedule('*/15 * * * *', async () => {
  logger.info('Running scheduled sync job');
  try {
    // Get all patients with pending sync items
    const { query } = await import('./utils/db.js');
    const patients = await query(
      `SELECT DISTINCT patient_id 
       FROM sync_queue 
       WHERE sync_status = 'pending'
       LIMIT 100`
    );

    for (const row of patients.rows) {
      try {
        await syncService.batchSync(row.patient_id, 20);
      } catch (error) {
        logger.error('Error syncing for patient', {
          patientId: row.patient_id,
          error: error.message,
        });
      }
    }
  } catch (error) {
    logger.error('Scheduled sync job error', { error: error.message });
  }
});

// Cleanup job (runs daily at 2 AM)
cron.schedule('0 2 * * *', async () => {
  logger.info('Running sync cleanup job');
  try {
    const { query } = await import('./utils/db.js');
    const patients = await query('SELECT DISTINCT patient_id FROM sync_queue');

    for (const row of patients.rows) {
      try {
        await syncService.clearSyncedItems(row.patient_id, 7);
      } catch (error) {
        logger.error('Error cleaning up for patient', {
          patientId: row.patient_id,
          error: error.message,
        });
      }
    }
  } catch (error) {
    logger.error('Cleanup job error', { error: error.message });
  }
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Sync Service running on port ${PORT}`);
});

export default app;

