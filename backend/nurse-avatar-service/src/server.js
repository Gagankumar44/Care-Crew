import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { nurseAvatarRouter } from './routes/sessions.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3018;

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
  res.json({ status: 'healthy', service: 'nurse-avatar-service' });
});

// Routes
app.use('/api/v1/nurse-avatar', authMiddleware, nurseAvatarRouter);

// WebSocket for real-time avatar interactions
io.use((socket, next) => {
  // In production, verify JWT token here
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  // Verify token and attach user info
  next();
});

io.on('connection', (socket) => {
  logger.info('Client connected to nurse avatar service', {
    socketId: socket.id,
  });

  socket.on('join-session', (sessionId) => {
    socket.join(`session:${sessionId}`);
    logger.info('Client joined session', { sessionId, socketId: socket.id });
  });

  socket.on('avatar-interaction', (data) => {
    const { sessionId, interaction } = data;
    // Broadcast avatar interactions to all clients in the session
    io.to(`session:${sessionId}`).emit('avatar-update', {
      interaction,
      timestamp: new Date(),
    });
  });

  socket.on('session-progress', (data) => {
    const { sessionId, progress } = data;
    // Broadcast progress updates
    io.to(`session:${sessionId}`).emit('progress-update', {
      progress,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id });
  });
});

// Error handling
app.use(errorHandler);

httpServer.listen(PORT, () => {
  logger.info(`Nurse Avatar Service running on port ${PORT}`);
});

export default app;

