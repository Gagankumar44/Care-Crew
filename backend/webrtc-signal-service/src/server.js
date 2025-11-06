import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware, socketAuthMiddleware } from './middleware/auth.js';
import { callRouter } from './routes/calls.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3003;

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
  res.json({ status: 'healthy', service: 'webrtc-signal-service' });
});

// Routes
app.use('/api/v1/calls', authMiddleware, callRouter);

// Socket.IO connection handling with authentication
io.use(socketAuthMiddleware);

io.on('connection', (socket) => {
  logger.info('Client connected', { socketId: socket.id, userId: socket.user.id });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    logger.info('Client joined room', { socketId: socket.id, roomId, userId: socket.user.id });
    
    // Notify others in room
    socket.to(roomId).emit('user-joined', { socketId: socket.id, userId: socket.user.id });
  });

  socket.on('offer', (data) => {
    const { roomId, offer } = data;
    socket.to(roomId).emit('offer', { offer, from: socket.id, userId: socket.user.id });
  });

  socket.on('answer', (data) => {
    const { roomId, answer } = data;
    socket.to(roomId).emit('answer', { answer, from: socket.id, userId: socket.user.id });
  });

  socket.on('ice-candidate', (data) => {
    const { roomId, candidate } = data;
    socket.to(roomId).emit('ice-candidate', { candidate, from: socket.id, userId: socket.user.id });
  });

  socket.on('annotation', (data) => {
    const { roomId, annotation } = data;
    socket.to(roomId).emit('annotation', { annotation, from: socket.id, userId: socket.user.id });
  });

  socket.on('disconnect', () => {
    logger.info('Client disconnected', { socketId: socket.id, userId: socket.user?.id });
  });
});

// Error handling
app.use(errorHandler);

httpServer.listen(PORT, () => {
  logger.info(`WebRTC Signaling Service running on port ${PORT}`);
});

export default app;
