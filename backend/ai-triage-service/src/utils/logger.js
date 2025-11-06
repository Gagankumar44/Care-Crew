import winston from 'winston';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: 'ai-triage-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // In production, also log to Cloud Logging
    // new winston.transports.Stream({
    //   stream: process.stdout,
    // }),
  ],
});

// Never log PHI
logger.addFilter((info) => {
  // Remove any potential PHI from logs
  const sanitized = { ...info };
  delete sanitized.message; // Don't log message content
  delete sanitized.body; // Don't log request body
  return sanitized;
});

