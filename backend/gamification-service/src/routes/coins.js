import express from 'express';
import gamificationService from '../services/gamificationService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * POST /api/v1/gamification/earn
 * Earn health coins
 */
router.post('/earn', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { source, amount, metadata } = req.body;

    if (!source) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'source is required' },
      });
    }

    const transaction = await gamificationService.earnCoins(
      patientId,
      source,
      amount,
      metadata
    );

    const balance = await gamificationService.getBalance(patientId);

    res.status(201).json({
      data: {
        transaction,
        newBalance: balance,
      },
    });
  } catch (error) {
    logger.error('Error earning coins', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/gamification/redeem
 * Redeem health coins
 */
router.post('/redeem', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { redemptionType, amount, redemptionValue } = req.body;

    if (!redemptionType || !amount) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'redemptionType and amount are required',
        },
      });
    }

    const transaction = await gamificationService.redeemCoins(
      patientId,
      redemptionType,
      amount,
      redemptionValue
    );

    const balance = await gamificationService.getBalance(patientId);

    res.status(201).json({
      data: {
        transaction,
        newBalance: balance,
      },
    });
  } catch (error) {
    logger.error('Error redeeming coins', { error: error.message });
    if (error.message === 'Insufficient coins balance') {
      return res.status(400).json({
        error: { code: 'INSUFFICIENT_BALANCE', message: error.message },
      });
    }
    next(error);
  }
});

/**
 * GET /api/v1/gamification/balance
 * Get current coin balance
 */
router.get('/balance', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const balance = await gamificationService.getBalance(patientId);

    res.json({ data: { balance } });
  } catch (error) {
    logger.error('Error fetching balance', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/gamification/transactions
 * Get transaction history
 */
router.get('/transactions', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;

    const transactions = await gamificationService.getTransactions(
      patientId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({ data: transactions });
  } catch (error) {
    logger.error('Error fetching transactions', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/gamification/statistics
 * Get gamification statistics
 */
router.get('/statistics', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { days = 30 } = req.query;

    const statistics = await gamificationService.getStatistics(
      patientId,
      parseInt(days)
    );

    res.json({ data: statistics });
  } catch (error) {
    logger.error('Error fetching statistics', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/gamification/redemption-options
 * Get available redemption options
 */
router.get('/redemption-options', async (req, res, next) => {
  try {
    const options = gamificationService.getRedemptionOptions();

    res.json({ data: options });
  } catch (error) {
    logger.error('Error fetching redemption options', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/gamification/achievements
 * Get achievements summary
 */
router.get('/achievements', async (req, res, next) => {
  try {
    const patientId = req.user.userId;

    const achievements = await gamificationService.getAchievements(patientId);

    res.json({ data: achievements });
  } catch (error) {
    logger.error('Error fetching achievements', { error: error.message });
    next(error);
  }
});

/**
 * POST /api/v1/gamification/streak-bonus
 * Award streak bonus
 */
router.post('/streak-bonus', async (req, res, next) => {
  try {
    const patientId = req.user.userId;
    const { streakType, streakDays } = req.body;

    if (!streakType || !streakDays) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'streakType and streakDays are required',
        },
      });
    }

    const transaction = await gamificationService.awardStreakBonus(
      patientId,
      streakType,
      streakDays
    );

    const balance = await gamificationService.getBalance(patientId);

    res.status(201).json({
      data: {
        transaction,
        newBalance: balance,
      },
    });
  } catch (error) {
    logger.error('Error awarding streak bonus', { error: error.message });
    next(error);
  }
});

/**
 * GET /api/v1/gamification/leaderboard
 * Get leaderboard (admin only - optional)
 */
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const leaderboard = await gamificationService.getLeaderboard(parseInt(limit));

    res.json({ data: leaderboard });
  } catch (error) {
    logger.error('Error fetching leaderboard', { error: error.message });
    next(error);
  }
});

export { router as gamificationRouter };

