import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Gamification Service
 * Handles health coins, rewards, and gamification features
 */

export class GamificationService {
  /**
   * Earn health coins
   */
  async earnCoins(patientId, source, amount, metadata = {}) {
    const validSources = [
      'steps',
      'scan',
      'checkup',
      'report_upload',
      'breathing_exercise',
      'medicine_adherence',
      'exercise_completion',
      'health_goal',
      'daily_checkin',
    ];

    if (!validSources.includes(source)) {
      throw new Error(`Invalid source. Must be one of: ${validSources.join(', ')}`);
    }

    const coinsToEarn = amount || this.getCoinAmountForSource(source);

    const result = await query(
      `INSERT INTO health_coin_transactions (
        patient_id, transaction_type, amount, source, redemption_value
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        patientId,
        'earned',
        coinsToEarn,
        source,
        JSON.stringify(metadata),
      ]
    );

    return result.rows[0];
  }

  /**
   * Get coin amount for source
   */
  getCoinAmountForSource(source) {
    const coinMap = {
      steps: 1, // 1 coin per 1000 steps
      scan: 10,
      checkup: 25,
      report_upload: 15,
      breathing_exercise: 5,
      medicine_adherence: 20,
      exercise_completion: 15,
      health_goal: 50,
      daily_checkin: 5,
    };

    return coinMap[source] || 5;
  }

  /**
   * Redeem health coins
   */
  async redeemCoins(patientId, redemptionType, amount, redemptionValue = {}) {
    const validRedemptionTypes = [
      'consultation_discount',
      'lab_coupon',
      'pharmacy_cashback',
      'premium_feature',
      'health_product',
    ];

    if (!validRedemptionTypes.includes(redemptionType)) {
      throw new Error(`Invalid redemption type. Must be one of: ${validRedemptionTypes.join(', ')}`);
    }

    // Check balance
    const balance = await this.getBalance(patientId);
    if (balance < amount) {
      throw new Error('Insufficient coins balance');
    }

    const result = await query(
      `INSERT INTO health_coin_transactions (
        patient_id, transaction_type, amount, redemption_type, redemption_value
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        patientId,
        'redeemed',
        -amount, // Negative for redemption
        redemptionType,
        JSON.stringify(redemptionValue),
      ]
    );

    return result.rows[0];
  }

  /**
   * Get current coin balance
   */
  async getBalance(patientId) {
    const result = await query(
      `SELECT COALESCE(SUM(amount), 0) as balance
       FROM health_coin_transactions
       WHERE patient_id = $1`,
      [patientId]
    );

    return parseInt(result.rows[0].balance) || 0;
  }

  /**
   * Get transaction history
   */
  async getTransactions(patientId, limit = 50, offset = 0) {
    const result = await query(
      `SELECT * FROM health_coin_transactions
       WHERE patient_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [patientId, limit, offset]
    );

    return result.rows;
  }

  /**
   * Get statistics
   */
  async getStatistics(patientId, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const stats = await query(
      `SELECT 
        transaction_type,
        source,
        COUNT(*) as count,
        SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_earned,
        SUM(CASE WHEN amount < 0 THEN ABS(amount) ELSE 0 END) as total_redeemed
      FROM health_coin_transactions
      WHERE patient_id = $1 AND created_at >= $2
      GROUP BY transaction_type, source
      ORDER BY transaction_type, count DESC`,
      [patientId, cutoffDate]
    );

    const balance = await this.getBalance(patientId);

    const summary = {
      currentBalance: balance,
      totalEarned: stats.rows
        .filter(row => row.transaction_type === 'earned')
        .reduce((sum, row) => sum + parseInt(row.total_earned), 0),
      totalRedeemed: stats.rows
        .filter(row => row.transaction_type === 'redeemed')
        .reduce((sum, row) => sum + parseInt(row.total_redeemed), 0),
      bySource: {},
      byRedemptionType: {},
    };

    stats.rows.forEach((row) => {
      if (row.transaction_type === 'earned' && row.source) {
        if (!summary.bySource[row.source]) {
          summary.bySource[row.source] = { count: 0, coins: 0 };
        }
        summary.bySource[row.source].count += parseInt(row.count);
        summary.bySource[row.source].coins += parseInt(row.total_earned);
      }

      if (row.transaction_type === 'redeemed' && row.redemption_type) {
        if (!summary.byRedemptionType[row.redemption_type]) {
          summary.byRedemptionType[row.redemption_type] = { count: 0, coins: 0 };
        }
        summary.byRedemptionType[row.redemption_type].count += parseInt(row.count);
        summary.byRedemptionType[row.redemption_type].coins += parseInt(row.total_redeemed);
      }
    });

    return summary;
  }

  /**
   * Get available redemption options
   */
  getRedemptionOptions() {
    return [
      {
        type: 'consultation_discount',
        name: 'Consultation Discount',
        description: 'Get 10% off your next consultation',
        cost: 100,
        discount: '10%',
      },
      {
        type: 'lab_coupon',
        name: 'Lab Test Coupon',
        description: 'Get $20 off lab tests',
        cost: 150,
        value: '$20',
      },
      {
        type: 'pharmacy_cashback',
        name: 'Pharmacy Cashback',
        description: 'Get 5% cashback on pharmacy purchases',
        cost: 200,
        cashback: '5%',
      },
      {
        type: 'premium_feature',
        name: 'Premium Feature Access',
        description: 'Unlock premium features for 1 month',
        cost: 300,
        duration: '1 month',
      },
      {
        type: 'health_product',
        name: 'Health Product Voucher',
        description: 'Get $50 voucher for health products',
        cost: 500,
        value: '$50',
      },
    ];
  }

  /**
   * Get leaderboard (top earners)
   */
  async getLeaderboard(limit = 10) {
    const result = await query(
      `SELECT 
        patient_id,
        COALESCE(SUM(amount), 0) as total_coins,
        COUNT(*) as transaction_count
      FROM health_coin_transactions
      WHERE transaction_type = 'earned'
      GROUP BY patient_id
      ORDER BY total_coins DESC
      LIMIT $1`,
      [limit]
    );

    return result.rows.map((row, index) => ({
      rank: index + 1,
      patientId: row.patient_id,
      totalCoins: parseInt(row.total_coins),
      transactionCount: parseInt(row.transaction_count),
    }));
  }

  /**
   * Get achievements summary
   */
  async getAchievements(patientId) {
    const balance = await this.getBalance(patientId);
    const stats = await this.getStatistics(patientId, 365);

    const achievements = [];

    // Balance milestones
    if (balance >= 1000) {
      achievements.push({
        id: 'coin_master',
        name: 'Coin Master',
        description: 'Accumulated 1000+ coins',
        unlocked: true,
        unlockedAt: new Date(),
      });
    } else if (balance >= 500) {
      achievements.push({
        id: 'coin_collector',
        name: 'Coin Collector',
        description: 'Accumulated 500+ coins',
        unlocked: true,
        unlockedAt: new Date(),
      });
    }

    // Activity achievements
    if (stats.totalEarned >= 1000) {
      achievements.push({
        id: 'health_champion',
        name: 'Health Champion',
        description: 'Earned 1000+ coins in total',
        unlocked: true,
        unlockedAt: new Date(),
      });
    }

    // Source-specific achievements
    if (stats.bySource.health_goal && stats.bySource.health_goal.count >= 10) {
      achievements.push({
        id: 'goal_achiever',
        name: 'Goal Achiever',
        description: 'Completed 10 health goals',
        unlocked: true,
        unlockedAt: new Date(),
      });
    }

    return {
      achievements,
      totalUnlocked: achievements.filter(a => a.unlocked).length,
      nextMilestones: this.getNextMilestones(balance, stats),
    };
  }

  /**
   * Get next milestones
   */
  getNextMilestones(balance, stats) {
    const milestones = [];

    if (balance < 100) {
      milestones.push({
        target: 100,
        coinsNeeded: 100 - balance,
        achievement: 'First Hundred',
      });
    } else if (balance < 500) {
      milestones.push({
        target: 500,
        coinsNeeded: 500 - balance,
        achievement: 'Coin Collector',
      });
    } else if (balance < 1000) {
      milestones.push({
        target: 1000,
        coinsNeeded: 1000 - balance,
        achievement: 'Coin Master',
      });
    }

    return milestones;
  }

  /**
   * Award bonus coins for streaks
   */
  async awardStreakBonus(patientId, streakType, streakDays) {
    const bonusMultiplier = Math.min(5, Math.floor(streakDays / 7)); // 1x per week, max 5x
    const baseBonus = 50;
    const bonusAmount = baseBonus * bonusMultiplier;

    return await this.earnCoins(patientId, 'daily_checkin', bonusAmount, {
      streakType,
      streakDays,
      bonus: true,
    });
  }
}

export default new GamificationService();

