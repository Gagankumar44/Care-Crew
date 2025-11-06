import { logger } from '../utils/logger.js';

/**
 * Audit Log for PHI Access
 */
export async function auditLog({
  userId,
  action,
  resourceType,
  resourceId,
  ipAddress,
  userAgent,
  success = true,
}) {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    resourceType,
    resourceId,
    ipAddress,
    userAgent,
    success,
  };
  
  // Log to Cloud Logging (GCP)
  logger.info('PHI Access Audit', auditEntry);
  
  // TODO: Also write to immutable audit log table in database
  // await db.auditLogs.insert(auditEntry);
}

/**
 * Error Handler Middleware
 */
export function errorHandler(err, req, res, next) {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;
  
  res.status(statusCode).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message,
    },
  });
}

