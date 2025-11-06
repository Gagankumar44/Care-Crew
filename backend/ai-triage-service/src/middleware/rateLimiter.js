import { logger } from '../utils/logger.js';

/**
 * Rate Limiter Middleware
 * Limits requests per time window
 */
export function rateLimiter(maxRequests, windowSeconds) {
  const requests = new Map();
  
  return (req, res, next) => {
    const key = req.user?.id || req.ip;
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, { count: 1, resetTime: now + windowSeconds * 1000 });
      return next();
    }
    
    const userRequests = requests.get(key);
    
    if (now > userRequests.resetTime) {
      // Reset window
      userRequests.count = 1;
      userRequests.resetTime = now + windowSeconds * 1000;
      return next();
    }
    
    if (userRequests.count >= maxRequests) {
      logger.warn('Rate limit exceeded', { key, count: userRequests.count });
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Limit: ${maxRequests} per ${windowSeconds} seconds`,
        },
      });
    }
    
    userRequests.count++;
    next();
  };
}

