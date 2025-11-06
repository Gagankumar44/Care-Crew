import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Digital Twin Service
 * Handles genomic data, lifestyle tracking, and health predictions
 */

export class DigitalTwinService {
  /**
   * Create or update digital twin profile
   */
  async upsertProfile(patientId, profileData) {
    const {
      genomicData,
      lifestyleData,
      healthPredictions,
      metabolicScore,
      sleepBurnoutScore,
      stressStrainScore,
      nutritionRecommendations,
    } = profileData;

    // Check if profile exists
    const existing = await query(
      'SELECT id FROM digital_twin_profiles WHERE patient_id = $1',
      [patientId]
    );

    if (existing.rows.length > 0) {
      // Update existing profile
      const updateFields = [];
      const values = [];
      let paramIndex = 1;

      if (genomicData !== undefined) {
        updateFields.push(`genomic_data = $${paramIndex++}`);
        values.push(JSON.stringify(genomicData));
      }

      if (lifestyleData !== undefined) {
        updateFields.push(`lifestyle_data = $${paramIndex++}`);
        values.push(JSON.stringify(lifestyleData));
      }

      if (healthPredictions !== undefined) {
        updateFields.push(`health_predictions = $${paramIndex++}`);
        values.push(JSON.stringify(healthPredictions));
      }

      if (metabolicScore !== undefined) {
        updateFields.push(`metabolic_score = $${paramIndex++}`);
        values.push(metabolicScore);
      }

      if (sleepBurnoutScore !== undefined) {
        updateFields.push(`sleep_burnout_score = $${paramIndex++}`);
        values.push(sleepBurnoutScore);
      }

      if (stressStrainScore !== undefined) {
        updateFields.push(`stress_strain_score = $${paramIndex++}`);
        values.push(stressStrainScore);
      }

      if (nutritionRecommendations !== undefined) {
        updateFields.push(`nutrition_recommendations = $${paramIndex++}`);
        values.push(JSON.stringify(nutritionRecommendations));
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(patientId);

      const result = await query(
        `UPDATE digital_twin_profiles 
         SET ${updateFields.join(', ')} 
         WHERE patient_id = $${paramIndex++}
         RETURNING *`,
        values
      );

      return result.rows[0];
    } else {
      // Create new profile
      const result = await query(
        `INSERT INTO digital_twin_profiles (
          patient_id, genomic_data, lifestyle_data, health_predictions,
          metabolic_score, sleep_burnout_score, stress_strain_score,
          nutrition_recommendations
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          patientId,
          genomicData ? JSON.stringify(genomicData) : null,
          lifestyleData ? JSON.stringify(lifestyleData) : null,
          healthPredictions ? JSON.stringify(healthPredictions) : null,
          metabolicScore || null,
          sleepBurnoutScore || null,
          stressStrainScore || null,
          nutritionRecommendations ? JSON.stringify(nutritionRecommendations) : null,
        ]
      );

      return result.rows[0];
    }
  }

  /**
   * Get digital twin profile for patient
   */
  async getProfile(patientId) {
    const result = await query(
      'SELECT * FROM digital_twin_profiles WHERE patient_id = $1',
      [patientId]
    );

    if (result.rows.length === 0) {
      throw new Error('Digital twin profile not found');
    }

    return result.rows[0];
  }

  /**
   * Update genomic data
   */
  async updateGenomicData(patientId, genomicData) {
    const profile = await this.getProfile(patientId);

    const result = await query(
      `UPDATE digital_twin_profiles 
       SET genomic_data = $1, updated_at = NOW()
       WHERE patient_id = $2
       RETURNING *`,
      [JSON.stringify(genomicData), patientId]
    );

    // Recalculate scores after genomic update
    await this.recalculateScores(patientId);

    return result.rows[0];
  }

  /**
   * Update lifestyle data
   */
  async updateLifestyleData(patientId, lifestyleData) {
    const profile = await this.getProfile(patientId);

    const result = await query(
      `UPDATE digital_twin_profiles 
       SET lifestyle_data = $1, updated_at = NOW()
       WHERE patient_id = $2
       RETURNING *`,
      [JSON.stringify(lifestyleData), patientId]
    );

    // Recalculate scores after lifestyle update
    await this.recalculateScores(patientId);

    return result.rows[0];
  }

  /**
   * Generate health predictions based on genomic and lifestyle data
   */
  async generatePredictions(patientId) {
    const profile = await this.getProfile(patientId);

    const genomicData = typeof profile.genomic_data === 'string'
      ? JSON.parse(profile.genomic_data)
      : profile.genomic_data;
    const lifestyleData = typeof profile.lifestyle_data === 'string'
      ? JSON.parse(profile.lifestyle_data)
      : profile.lifestyle_data;

    const predictions = {
      diseaseRisks: this.calculateDiseaseRisks(genomicData, lifestyleData),
      healthTrajectories: this.calculateHealthTrajectories(lifestyleData),
      recommendedActions: this.generateRecommendedActions(genomicData, lifestyleData),
      riskFactors: this.identifyRiskFactors(genomicData, lifestyleData),
      predictedOutcomes: this.predictOutcomes(genomicData, lifestyleData),
      timestamp: new Date(),
    };

    // Update profile with predictions
    await query(
      `UPDATE digital_twin_profiles 
       SET health_predictions = $1, updated_at = NOW()
       WHERE patient_id = $2`,
      [JSON.stringify(predictions), patientId]
    );

    return predictions;
  }

  /**
   * Calculate disease risks based on genomic and lifestyle
   */
  calculateDiseaseRisks(genomicData, lifestyleData) {
    const risks = {};

    if (!genomicData && !lifestyleData) {
      return { message: 'Insufficient data for risk assessment' };
    }

    // Example risk calculations (simplified)
    risks.type2Diabetes = this.calculateDiabetesRisk(genomicData, lifestyleData);
    risks.cardiovascularDisease = this.calculateCardiovascularRisk(genomicData, lifestyleData);
    risks.hypertension = this.calculateHypertensionRisk(genomicData, lifestyleData);
    risks.obesity = this.calculateObesityRisk(genomicData, lifestyleData);

    return risks;
  }

  /**
   * Calculate diabetes risk
   */
  calculateDiabetesRisk(genomicData, lifestyleData) {
    let riskScore = 0;

    // Genomic factors
    if (genomicData?.diabetesMarkers) {
      riskScore += genomicData.diabetesMarkers * 20;
    }

    // Lifestyle factors
    if (lifestyleData?.bmi && lifestyleData.bmi > 30) riskScore += 30;
    if (lifestyleData?.exerciseHours && lifestyleData.exerciseHours < 2.5) riskScore += 20;
    if (lifestyleData?.dietQuality && lifestyleData.dietQuality < 50) riskScore += 15;
    if (lifestyleData?.familyHistory?.diabetes) riskScore += 15;

    return {
      score: Math.min(100, riskScore),
      level: riskScore < 30 ? 'low' : riskScore < 60 ? 'moderate' : 'high',
    };
  }

  /**
   * Calculate cardiovascular risk
   */
  calculateCardiovascularRisk(genomicData, lifestyleData) {
    let riskScore = 0;

    if (genomicData?.cardiovascularMarkers) {
      riskScore += genomicData.cardiovascularMarkers * 15;
    }

    if (lifestyleData?.bloodPressure?.systolic > 140) riskScore += 25;
    if (lifestyleData?.cholesterol?.ldl > 160) riskScore += 20;
    if (lifestyleData?.smoking) riskScore += 30;
    if (lifestyleData?.exerciseHours && lifestyleData.exerciseHours < 2.5) riskScore += 15;

    return {
      score: Math.min(100, riskScore),
      level: riskScore < 30 ? 'low' : riskScore < 60 ? 'moderate' : 'high',
    };
  }

  /**
   * Calculate hypertension risk
   */
  calculateHypertensionRisk(genomicData, lifestyleData) {
    let riskScore = 0;

    if (genomicData?.hypertensionMarkers) {
      riskScore += genomicData.hypertensionMarkers * 15;
    }

    if (lifestyleData?.saltIntake && lifestyleData.saltIntake > 5) riskScore += 25;
    if (lifestyleData?.stressLevel && lifestyleData.stressLevel > 7) riskScore += 20;
    if (lifestyleData?.exerciseHours && lifestyleData.exerciseHours < 2.5) riskScore += 15;

    return {
      score: Math.min(100, riskScore),
      level: riskScore < 30 ? 'low' : riskScore < 60 ? 'moderate' : 'high',
    };
  }

  /**
   * Calculate obesity risk
   */
  calculateObesityRisk(genomicData, lifestyleData) {
    let riskScore = 0;

    if (genomicData?.obesityMarkers) {
      riskScore += genomicData.obesityMarkers * 20;
    }

    if (lifestyleData?.bmi && lifestyleData.bmi > 25) riskScore += 30;
    if (lifestyleData?.dietQuality && lifestyleData.dietQuality < 50) riskScore += 25;
    if (lifestyleData?.exerciseHours && lifestyleData.exerciseHours < 2.5) riskScore += 20;
    if (lifestyleData?.sleepHours && lifestyleData.sleepHours < 7) riskScore += 15;

    return {
      score: Math.min(100, riskScore),
      level: riskScore < 30 ? 'low' : riskScore < 60 ? 'moderate' : 'high',
    };
  }

  /**
   * Calculate health trajectories
   */
  calculateHealthTrajectories(lifestyleData) {
    const trajectories = {
      shortTerm: this.predictShortTerm(lifestyleData),
      mediumTerm: this.predictMediumTerm(lifestyleData),
      longTerm: this.predictLongTerm(lifestyleData),
    };

    return trajectories;
  }

  /**
   * Predict short-term health trajectory (3-6 months)
   */
  predictShortTerm(lifestyleData) {
    const factors = [];
    let trend = 'stable';

    if (lifestyleData?.recentChanges?.exercise) {
      factors.push('Increased exercise activity');
      trend = 'improving';
    }

    if (lifestyleData?.recentChanges?.diet) {
      factors.push('Diet improvements');
      trend = 'improving';
    }

    return { trend, factors, timeframe: '3-6 months' };
  }

  /**
   * Predict medium-term health trajectory (1-2 years)
   */
  predictMediumTerm(lifestyleData) {
    const factors = [];
    let trend = 'stable';

    if (lifestyleData?.exerciseHours && lifestyleData.exerciseHours >= 2.5) {
      factors.push('Regular exercise routine');
      trend = 'improving';
    }

    if (lifestyleData?.dietQuality && lifestyleData.dietQuality < 50) {
      factors.push('Diet quality needs improvement');
      trend = 'declining';
    }

    return { trend, factors, timeframe: '1-2 years' };
  }

  /**
   * Predict long-term health trajectory (5+ years)
   */
  predictLongTerm(lifestyleData) {
    const factors = [];
    let trend = 'stable';

    if (lifestyleData?.chronicConditions) {
      factors.push('Existing chronic conditions');
      trend = 'monitoring';
    }

    return { trend, factors, timeframe: '5+ years' };
  }

  /**
   * Generate recommended actions
   */
  generateRecommendedActions(genomicData, lifestyleData) {
    const actions = [];

    if (lifestyleData?.exerciseHours && lifestyleData.exerciseHours < 2.5) {
      actions.push({
        priority: 'high',
        category: 'exercise',
        action: 'Increase weekly exercise to at least 2.5 hours',
        reason: 'Low exercise levels increase health risks',
      });
    }

    if (lifestyleData?.dietQuality && lifestyleData.dietQuality < 50) {
      actions.push({
        priority: 'high',
        category: 'nutrition',
        action: 'Improve diet quality - focus on whole foods',
        reason: 'Diet quality impacts multiple health outcomes',
      });
    }

    if (lifestyleData?.sleepHours && lifestyleData.sleepHours < 7) {
      actions.push({
        priority: 'medium',
        category: 'sleep',
        action: 'Aim for 7-9 hours of sleep per night',
        reason: 'Adequate sleep supports metabolic health',
      });
    }

    if (genomicData?.diabetesMarkers && genomicData.diabetesMarkers > 0.5) {
      actions.push({
        priority: 'high',
        category: 'monitoring',
        action: 'Regular blood glucose monitoring recommended',
        reason: 'Elevated genetic risk for diabetes',
      });
    }

    return actions;
  }

  /**
   * Identify risk factors
   */
  identifyRiskFactors(genomicData, lifestyleData) {
    const factors = [];

    if (genomicData?.familyHistory) {
      factors.push('Family history of chronic conditions');
    }

    if (lifestyleData?.smoking) {
      factors.push('Smoking');
    }

    if (lifestyleData?.bmi && lifestyleData.bmi > 30) {
      factors.push('Obesity (BMI > 30)');
    }

    if (lifestyleData?.stressLevel && lifestyleData.stressLevel > 7) {
      factors.push('High stress levels');
    }

    return factors;
  }

  /**
   * Predict health outcomes
   */
  predictOutcomes(genomicData, lifestyleData) {
    return {
      bestCase: 'Optimal health with lifestyle modifications',
      mostLikely: 'Stable health with continued monitoring',
      worstCase: 'Development of chronic conditions if lifestyle unchanged',
      timeframe: '5-10 years',
    };
  }

  /**
   * Recalculate all scores
   */
  async recalculateScores(patientId) {
    const profile = await this.getProfile(patientId);

    const genomicData = typeof profile.genomic_data === 'string'
      ? JSON.parse(profile.genomic_data)
      : profile.genomic_data;
    const lifestyleData = typeof profile.lifestyle_data === 'string'
      ? JSON.parse(profile.lifestyle_data)
      : profile.lifestyle_data;

    const metabolicScore = this.calculateMetabolicScore(genomicData, lifestyleData);
    const sleepBurnoutScore = this.calculateSleepBurnoutScore(lifestyleData);
    const stressStrainScore = this.calculateStressStrainScore(lifestyleData);
    const nutritionRecommendations = this.generateNutritionRecommendations(
      genomicData,
      lifestyleData
    );

    await query(
      `UPDATE digital_twin_profiles 
       SET metabolic_score = $1,
           sleep_burnout_score = $2,
           stress_strain_score = $3,
           nutrition_recommendations = $4,
           updated_at = NOW()
       WHERE patient_id = $5`,
      [
        metabolicScore,
        sleepBurnoutScore,
        stressStrainScore,
        JSON.stringify(nutritionRecommendations),
        patientId,
      ]
    );

    return {
      metabolicScore,
      sleepBurnoutScore,
      stressStrainScore,
      nutritionRecommendations,
    };
  }

  /**
   * Calculate metabolic score (0-100, higher is better)
   */
  calculateMetabolicScore(genomicData, lifestyleData) {
    let score = 100;

    if (lifestyleData?.bmi && lifestyleData.bmi > 30) score -= 30;
    else if (lifestyleData?.bmi && lifestyleData.bmi > 25) score -= 15;

    if (lifestyleData?.exerciseHours && lifestyleData.exerciseHours < 2.5) score -= 20;
    if (lifestyleData?.dietQuality && lifestyleData.dietQuality < 50) score -= 25;
    if (lifestyleData?.sleepHours && lifestyleData.sleepHours < 7) score -= 15;

    if (genomicData?.metabolicMarkers) {
      score -= genomicData.metabolicMarkers * 10;
    }

    return Math.max(0, score);
  }

  /**
   * Calculate sleep burnout score (0-100, lower is better)
   */
  calculateSleepBurnoutScore(lifestyleData) {
    let score = 0;

    if (lifestyleData?.sleepHours && lifestyleData.sleepHours < 6) score += 40;
    else if (lifestyleData?.sleepHours && lifestyleData.sleepHours < 7) score += 20;

    if (lifestyleData?.sleepQuality && lifestyleData.sleepQuality < 50) score += 30;
    if (lifestyleData?.workHours && lifestyleData.workHours > 50) score += 30;

    return Math.min(100, score);
  }

  /**
   * Calculate stress strain score (0-100, lower is better)
   */
  calculateStressStrainScore(lifestyleData) {
    let score = 0;

    if (lifestyleData?.stressLevel) {
      score += lifestyleData.stressLevel * 10;
    }

    if (lifestyleData?.workLifeBalance && lifestyleData.workLifeBalance < 3) score += 30;
    if (lifestyleData?.socialSupport && lifestyleData.socialSupport < 3) score += 20;

    return Math.min(100, score);
  }

  /**
   * Generate nutrition recommendations
   */
  generateNutritionRecommendations(genomicData, lifestyleData) {
    const recommendations = [];

    if (lifestyleData?.dietQuality && lifestyleData.dietQuality < 50) {
      recommendations.push({
        priority: 'high',
        recommendation: 'Increase intake of fruits and vegetables',
        target: '5+ servings per day',
      });
    }

    if (lifestyleData?.proteinIntake && lifestyleData.proteinIntake < 0.8) {
      recommendations.push({
        priority: 'medium',
        recommendation: 'Ensure adequate protein intake',
        target: '0.8g per kg body weight',
      });
    }

    if (genomicData?.nutrientMetabolism?.vitaminD) {
      recommendations.push({
        priority: 'medium',
        recommendation: 'Consider vitamin D supplementation',
        reason: 'Genetic factors affecting vitamin D metabolism',
      });
    }

    if (lifestyleData?.saltIntake && lifestyleData.saltIntake > 5) {
      recommendations.push({
        priority: 'high',
        recommendation: 'Reduce sodium intake',
        target: '< 2.3g per day',
      });
    }

    return recommendations;
  }
}

export default new DigitalTwinService();

