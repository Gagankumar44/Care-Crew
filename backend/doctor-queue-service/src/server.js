import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { doctorsRouter } from './routes/doctors.js';
import { queueRouter } from './routes/queue.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3010;

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
  res.json({ status: 'healthy', service: 'doctor-queue-service' });
});

// Routes
app.use('/api/v1/doctors', authMiddleware, doctorsRouter);
app.use('/api/v1/queue', authMiddleware, queueRouter);

// WebSocket for real-time updates
io.use((socket, next) => {
  // Authentication middleware for socket
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  // Verify token (simplified - in production use proper JWT verification)
  next();
});

io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id });

  socket.on('subscribe-doctor', (doctorId) => {
    socket.join(`doctor:${doctorId}`);
  });

  socket.on('subscribe-queue', (queueId) => {
    socket.join(`queue:${queueId}`);
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

// Make io available to routes
app.set('io', io);

// Error handling
app.use(errorHandler);

httpServer.listen(PORT, () => {
  logger.info(`Doctor Queue Service running on port ${PORT}`);
});

export default app;

