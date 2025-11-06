import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Health Score Calculator Service
 * Calculates personal health performance score (like credit score for health)
 */
export class HealthScoreCalculator {
  /**
   * Calculate overall health score for a patient
   */
  static async calculateScore(patientId) {
    try {
      // Get all health data components
      const [
        activityScore,
        sleepScore,
        stressScore,
        labsScore,
        lifestyleScore,
        preventiveScansScore
      ] = await Promise.all([
        this._calculateActivityScore(patientId),
        this._calculateSleepScore(patientId),
        this._calculateStressScore(patientId),
        this._calculateLabsScore(patientId),
        this._calculateLifestyleScore(patientId),
        this._calculatePreventiveScansScore(patientId)
      ]);

      // Calculate overall score (weighted average)
      const weights = {
        activity: 0.20,
        sleep: 0.20,
        stress: 0.15,
        labs: 0.20,
        lifestyle: 0.15,
        preventive_scans: 0.10
      };

      const overallScore = Math.round(
        activityScore * weights.activity +
        sleepScore * weights.sleep +
        stressScore * weights.stress +
        labsScore * weights.labs +
        lifestyleScore * weights.lifestyle +
        preventiveScansScore * weights.preventive_scans
      );

      // Calculate badges
      const badges = this._calculateBadges({
        activityScore,
        sleepScore,
        stressScore,
        labsScore,
        lifestyleScore,
        preventiveScansScore,
        overallScore
      });

      return {
        overall_score: Math.min(1000, Math.max(0, overallScore)),
        activity_score: activityScore,
        sleep_score: sleepScore,
        stress_score: stressScore,
        labs_score: labsScore,
        lifestyle_score: lifestyleScore,
        preventive_scans_score: preventiveScansScore,
        breakdown: {
          activity: {
            score: activityScore,
            weight: weights.activity,
            contribution: Math.round(activityScore * weights.activity)
          },
          sleep: {
            score: sleepScore,
            weight: weights.sleep,
            contribution: Math.round(sleepScore * weights.sleep)
          },
          stress: {
            score: stressScore,
            weight: weights.stress,
            contribution: Math.round(stressScore * weights.stress)
          },
          labs: {
            score: labsScore,
            weight: weights.labs,
            contribution: Math.round(labsScore * weights.labs)
          },
          lifestyle: {
            score: lifestyleScore,
            weight: weights.lifestyle,
            contribution: Math.round(lifestyleScore * weights.lifestyle)
          },
          preventive_scans: {
            score: preventiveScansScore,
            weight: weights.preventive_scans,
            contribution: Math.round(preventiveScansScore * weights.preventive_scans)
          }
        },
        badges,
        calculated_at: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Health score calculation error', { error: error.message });
      throw error;
    }
  }

  /**
   * Calculate activity score (0-1000)
   */
  static async _calculateActivityScore(patientId) {
    try {
      // Get steps data from last 30 days
      const stepsResult = await query(
        `SELECT AVG(value) as avg_steps, COUNT(*) as days_count
         FROM health_data
         WHERE patient_id = $1
           AND data_type = 'steps'
           AND timestamp >= NOW() - INTERVAL '30 days'`,
        [patientId]
      );

      if (stepsResult.rows.length === 0 || !stepsResult.rows[0].avg_steps) {
        return 500; // Default score if no data
      }

      const avgSteps = parseFloat(stepsResult.rows[0].avg_steps);
      const daysCount = parseInt(stepsResult.rows[0].days_count);

      // Score based on steps (target: 10,000 steps/day)
      let score = Math.min(1000, (avgSteps / 10000) * 1000);
      
      // Bonus for consistency (if tracked daily)
      const consistencyBonus = daysCount >= 25 ? 50 : daysCount >= 15 ? 25 : 0;
      score = Math.min(1000, score + consistencyBonus);

      return Math.round(score);
    } catch (error) {
      logger.error('Activity score calculation error', { error: error.message });
      return 500;
    }
  }

  /**
   * Calculate sleep score (0-1000)
   */
  static async _calculateSleepScore(patientId) {
    try {
      // Get sleep data from last 30 days
      const sleepResult = await query(
        `SELECT AVG(value) as avg_sleep_hours, COUNT(*) as days_count
         FROM health_data
         WHERE patient_id = $1
           AND data_type = 'sleep_duration'
           AND timestamp >= NOW() - INTERVAL '30 days'`,
        [patientId]
      );

      if (sleepResult.rows.length === 0 || !sleepResult.rows[0].avg_sleep_hours) {
        return 500;
      }

      const avgSleepHours = parseFloat(sleepResult.rows[0].avg_sleep_hours) / 60; // Convert minutes to hours
      const daysCount = parseInt(sleepResult.rows[0].days_count);

      // Optimal sleep: 7-9 hours
      let score;
      if (avgSleepHours >= 7 && avgSleepHours <= 9) {
        score = 1000;
      } else if (avgSleepHours >= 6 && avgSleepHours < 7) {
        score = 750;
      } else if (avgSleepHours > 9 && avgSleepHours <= 10) {
        score = 850;
      } else if (avgSleepHours < 6) {
        score = Math.max(300, (avgSleepHours / 6) * 600);
      } else {
        score = Math.max(500, 1000 - ((avgSleepHours - 9) * 100));
      }

      // Consistency bonus
      const consistencyBonus = daysCount >= 25 ? 50 : daysCount >= 15 ? 25 : 0;
      score = Math.min(1000, score + consistencyBonus);

      return Math.round(score);
    } catch (error) {
      logger.error('Sleep score calculation error', { error: error.message });
      return 500;
    }
  }

  /**
   * Calculate stress score (0-1000)
   */
  static async _calculateStressScore(patientId) {
    try {
      // Get heart rate variability or stress indicators
      const stressResult = await query(
        `SELECT AVG(value) as avg_hr
         FROM health_data
         WHERE patient_id = $1
           AND data_type = 'heart_rate'
           AND timestamp >= NOW() - INTERVAL '30 days'`,
        [patientId]
      );

      if (stressResult.rows.length === 0 || !stressResult.rows[0].avg_hr) {
        return 750; // Default if no data
      }

      const avgHR = parseFloat(stressResult.rows[0].avg_hr);

      // Normal resting HR: 60-100 bpm
      let score;
      if (avgHR >= 60 && avgHR <= 80) {
        score = 1000;
      } else if (avgHR > 80 && avgHR <= 100) {
        score = 800;
      } else if (avgHR > 100) {
        score = Math.max(400, 1000 - ((avgHR - 100) * 10));
      } else {
        score = Math.max(600, (avgHR / 60) * 1000);
      }

      return Math.round(score);
    } catch (error) {
      logger.error('Stress score calculation error', { error: error.message });
      return 750;
    }
  }

  /**
   * Calculate labs score (0-1000)
   */
  static async _calculateLabsScore(patientId) {
    try {
      // Check for recent lab results (would need lab_results table)
      // For now, check if patient has recent health data entries
      const labsResult = await query(
        `SELECT COUNT(*) as recent_labs_count
         FROM health_data
         WHERE patient_id = $1
           AND data_type IN ('blood_glucose', 'oxygen_saturation', 'blood_pressure_systolic')
           AND timestamp >= NOW() - INTERVAL '90 days'`,
        [patientId]
      );

      const recentLabsCount = parseInt(labsResult.rows[0].recent_labs_count);

      // Score based on having recent lab data
      let score = Math.min(1000, (recentLabsCount / 10) * 1000);
      
      // Bonus for having multiple types of labs
      if (recentLabsCount >= 5) {
        score = Math.min(1000, score + 100);
      }

      return Math.round(Math.max(300, score));
    } catch (error) {
      logger.error('Labs score calculation error', { error: error.message });
      return 500;
    }
  }

  /**
   * Calculate lifestyle score (0-1000)
   */
  static async _calculateLifestyleScore(patientId) {
    try {
      // Check for gamification progress, adherence, etc.
      const gamificationResult = await query(
        `SELECT total_points, current_streak, badges
         FROM gamification_progress
         WHERE patient_id = $1`,
        [patientId]
      );

      if (gamificationResult.rows.length === 0) {
        return 500;
      }

      const gp = gamificationResult.rows[0];
      const totalPoints = parseInt(gp.total_points) || 0;
      const streak = parseInt(gp.current_streak) || 0;
      const badges = typeof gp.badges === 'string' ? JSON.parse(gp.badges) : (gp.badges || []);

      // Score based on engagement
      let score = Math.min(1000, (totalPoints / 10000) * 1000);
      
      // Streak bonus
      if (streak >= 30) score = Math.min(1000, score + 100);
      else if (streak >= 7) score = Math.min(1000, score + 50);

      // Badge bonus
      score = Math.min(1000, score + (badges.length * 20));

      return Math.round(Math.max(300, score));
    } catch (error) {
      logger.error('Lifestyle score calculation error', { error: error.message });
      return 500;
    }
  }

  /**
   * Calculate preventive scans score (0-1000)
   */
  static async _calculatePreventiveScansScore(patientId) {
    try {
      // Check for skin checks, ROM records, etc.
      const scansResult = await query(
        `SELECT 
          (SELECT COUNT(*) FROM skin_check_records WHERE patient_id = $1 AND created_at >= NOW() - INTERVAL '365 days') as skin_checks,
          (SELECT COUNT(*) FROM rom_records WHERE patient_id = $1 AND created_at >= NOW() - INTERVAL '365 days') as rom_records`,
        [patientId]
      );

      const skinChecks = parseInt(scansResult.rows[0].skin_checks) || 0;
      const romRecords = parseInt(scansResult.rows[0].rom_records) || 0;

      // Score based on preventive scans
      let score = 0;
      if (skinChecks >= 4) score += 500; // Quarterly skin checks
      else if (skinChecks >= 2) score += 300;
      else if (skinChecks >= 1) score += 150;

      if (romRecords >= 10) score += 500; // Regular ROM exercises
      else if (romRecords >= 5) score += 300;
      else if (romRecords >= 1) score += 150;

      return Math.round(Math.min(1000, Math.max(300, score)));
    } catch (error) {
      logger.error('Preventive scans score calculation error', { error: error.message });
      return 500;
    }
  }

  /**
   * Calculate badges based on scores
   */
  static _calculateBadges(scores) {
    const badges = [];

    if (scores.overallScore >= 900) badges.push('health_champion');
    if (scores.overallScore >= 800) badges.push('health_excellent');
    if (scores.overallScore >= 700) badges.push('health_good');
    
    if (scores.activityScore >= 900) badges.push('active_warrior');
    if (scores.sleepScore >= 900) badges.push('sleep_master');
    if (scores.stressScore >= 900) badges.push('zen_master');
    
    if (scores.lifestyleScore >= 800) badges.push('health_enthusiast');
    if (scores.preventiveScansScore >= 800) badges.push('prevention_pro');

    return badges;
  }
}

