import { query } from '../utils/db.js';

/**
 * Pattern Detection Service
 * Detects health patterns across symptoms, vitals, sleep, stress, labs
 */
export class PatternDetectionService {
  /**
   * Detect symptom patterns
   */
  static async detectSymptomPatterns(patientId, days = 30) {
    try {
      // Get recent symptom data from triage sessions and voice logs
      const symptomQuery = `
        SELECT 
          ts.created_at,
          tm.content as symptom_text
        FROM triage_sessions ts
        JOIN triage_messages tm ON ts.id = tm.session_id
        WHERE ts.patient_id = $1
          AND tm.role = 'user'
          AND ts.created_at >= NOW() - INTERVAL '${days} days'
        ORDER BY ts.created_at DESC
      `;
      
      const symptoms = await query(symptomQuery, [patientId]);
      
      // Analyze patterns (simplified - in production, use ML models)
      const patterns = this._analyzeSymptomFrequency(symptoms.rows);
      
      // Store in health context memory
      if (patterns.length > 0) {
        await this._storePattern(patientId, 'symptom_pattern', patterns);
      }
      
      return patterns;
    } catch (error) {
      console.error('Error detecting symptom patterns:', error);
      throw error;
    }
  }

  /**
   * Detect vital trends
   */
  static async detectVitalTrends(patientId, days = 30) {
    try {
      const vitalQuery = `
        SELECT 
          data_type,
          value,
          timestamp
        FROM health_data
        WHERE patient_id = $1
          AND data_type IN ('heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'blood_glucose', 'oxygen_saturation')
          AND timestamp >= NOW() - INTERVAL '${days} days'
        ORDER BY timestamp DESC
      `;
      
      const vitals = await query(vitalQuery, [patientId]);
      
      const trends = this._analyzeVitalTrends(vitals.rows);
      
      if (trends.length > 0) {
        await this._storePattern(patientId, 'vital_trend', trends);
      }
      
      return trends;
    } catch (error) {
      console.error('Error detecting vital trends:', error);
      throw error;
    }
  }

  /**
   * Detect sleep patterns
   */
  static async detectSleepPatterns(patientId, days = 30) {
    try {
      const sleepQuery = `
        SELECT 
          value as sleep_hours,
          timestamp
        FROM health_data
        WHERE patient_id = $1
          AND data_type = 'sleep_duration'
          AND timestamp >= NOW() - INTERVAL '${days} days'
        ORDER BY timestamp DESC
      `;
      
      const sleepData = await query(sleepQuery, [patientId]);
      
      const patterns = this._analyzeSleepPatterns(sleepData.rows);
      
      if (patterns.length > 0) {
        await this._storePattern(patientId, 'sleep_pattern', patterns);
      }
      
      return patterns;
    } catch (error) {
      console.error('Error detecting sleep patterns:', error);
      throw error;
    }
  }

  /**
   * Detect stress patterns
   */
  static async detectStressPatterns(patientId, days = 30) {
    try {
      // Get stress-related data from health_data and symptoms
      const stressQuery = `
        SELECT 
          timestamp,
          value,
          data_type
        FROM health_data
        WHERE patient_id = $1
          AND (data_type LIKE '%stress%' OR data_type = 'heart_rate')
          AND timestamp >= NOW() - INTERVAL '${days} days'
        ORDER BY timestamp DESC
      `;
      
      const stressData = await query(stressQuery, [patientId]);
      
      const patterns = this._analyzeStressPatterns(stressData.rows);
      
      if (patterns.length > 0) {
        await this._storePattern(patientId, 'stress_pattern', patterns);
      }
      
      return patterns;
    } catch (error) {
      console.error('Error detecting stress patterns:', error);
      throw error;
    }
  }

  /**
   * Analyze symptom frequency
   */
  static _analyzeSymptomFrequency(symptoms) {
    const symptomCounts = {};
    const dates = [];
    
    symptoms.forEach(row => {
      dates.push(new Date(row.created_at));
      // Simple keyword extraction (in production, use NLP)
      const text = row.symptom_text.toLowerCase();
      if (text.includes('headache')) symptomCounts['headache'] = (symptomCounts['headache'] || 0) + 1;
      if (text.includes('pain')) symptomCounts['pain'] = (symptomCounts['pain'] || 0) + 1;
      if (text.includes('fever')) symptomCounts['fever'] = (symptomCounts['fever'] || 0) + 1;
      if (text.includes('fatigue')) symptomCounts['fatigue'] = (symptomCounts['fatigue'] || 0) + 1;
    });
    
    const patterns = [];
    Object.keys(symptomCounts).forEach(symptom => {
      if (symptomCounts[symptom] >= 3) {
        patterns.push({
          symptom,
          frequency: symptomCounts[symptom],
          timeframe: `${dates.length} days`,
          risk_level: symptomCounts[symptom] >= 5 ? 'high' : 'medium'
        });
      }
    });
    
    return patterns;
  }

  /**
   * Analyze vital trends
   */
  static _analyzeVitalTrends(vitals) {
    const byType = {};
    
    vitals.forEach(row => {
      if (!byType[row.data_type]) {
        byType[row.data_type] = [];
      }
      byType[row.data_type].push({
        value: row.value,
        timestamp: row.timestamp
      });
    });
    
    const trends = [];
    Object.keys(byType).forEach(type => {
      const values = byType[type];
      if (values.length < 2) return;
      
      const recent = values.slice(0, 5);
      const avg = recent.reduce((sum, v) => sum + v.value, 0) / recent.length;
      const older = values.slice(5, 10);
      const olderAvg = older.length > 0 ? older.reduce((sum, v) => sum + v.value, 0) / older.length : avg;
      
      const change = ((avg - olderAvg) / olderAvg) * 100;
      
      if (Math.abs(change) > 10) {
        trends.push({
          vital_type: type,
          trend: change > 0 ? 'increasing' : 'decreasing',
          change_percentage: Math.abs(change).toFixed(1),
          current_avg: avg.toFixed(1),
          risk_level: Math.abs(change) > 20 ? 'high' : 'medium'
        });
      }
    });
    
    return trends;
  }

  /**
   * Analyze sleep patterns
   */
  static _analyzeSleepPatterns(sleepData) {
    if (sleepData.length < 3) return [];
    
    const recentSleep = sleepData.slice(0, 7).map(r => r.sleep_hours / 60); // Convert minutes to hours
    const avgSleep = recentSleep.reduce((sum, h) => sum + h, 0) / recentSleep.length;
    
    const patterns = [];
    
    if (avgSleep < 6) {
      patterns.push({
        pattern: 'insufficient_sleep',
        avg_hours: avgSleep.toFixed(1),
        days_count: recentSleep.length,
        risk_level: 'high',
        recommendation: 'Consider improving sleep hygiene'
      });
    }
    
    // Check for sleep pattern correlation with symptoms
    return patterns;
  }

  /**
   * Analyze stress patterns
   */
  static _analyzeStressPatterns(stressData) {
    if (stressData.length < 3) return [];
    
    const heartRates = stressData
      .filter(r => r.data_type === 'heart_rate')
      .map(r => r.value);
    
    if (heartRates.length < 3) return [];
    
    const avgHR = heartRates.reduce((sum, hr) => sum + hr, 0) / heartRates.length;
    const maxHR = Math.max(...heartRates);
    
    const patterns = [];
    
    if (avgHR > 100 || maxHR > 120) {
      patterns.push({
        pattern: 'elevated_heart_rate',
        avg_hr: avgHR.toFixed(0),
        max_hr: maxHR.toFixed(0),
        risk_level: 'medium',
        recommendation: 'Consider stress management techniques'
      });
    }
    
    return patterns;
  }

  /**
   * Store pattern in health context memory
   */
  static async _storePattern(patientId, contextType, patternData) {
    const queryText = `
      INSERT INTO health_context_memory (patient_id, context_type, context_data, confidence_score)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `;
    
    // Calculate confidence score based on data quality
    const confidenceScore = Math.min(0.95, patternData.length * 0.1);
    
    await query(queryText, [
      patientId,
      contextType,
      JSON.stringify(patternData),
      confidenceScore
    ]);
  }

  /**
   * Generate proactive alerts based on patterns
   */
  static async generateProactiveAlerts(patientId) {
    try {
      // Get recent patterns
      const patternsQuery = `
        SELECT context_type, context_data, confidence_score
        FROM health_context_memory
        WHERE patient_id = $1
          AND updated_at >= NOW() - INTERVAL '7 days'
        ORDER BY updated_at DESC
      `;
      
      const patterns = await query(patternsQuery, [patientId]);
      
      const alerts = [];
      
      patterns.rows.forEach(row => {
        const contextData = typeof row.context_data === 'string' 
          ? JSON.parse(row.context_data) 
          : row.context_data;
        
        // Check symptom patterns
        if (row.context_type === 'symptom_pattern') {
          contextData.forEach(pattern => {
            if (pattern.risk_level === 'high' && pattern.frequency >= 3) {
              alerts.push({
                alert_type: 'pattern_detected',
                severity: 'high',
                title: `Frequent ${pattern.symptom} detected`,
                message: `You've had ${pattern.frequency} ${pattern.symptom} occurrences in the last ${pattern.timeframe}. Consider consulting a doctor.`,
                context_data: pattern
              });
            }
          });
        }
        
        // Check sleep patterns
        if (row.context_type === 'sleep_pattern') {
          contextData.forEach(pattern => {
            if (pattern.pattern === 'insufficient_sleep' && pattern.risk_level === 'high') {
              alerts.push({
                alert_type: 'risk_high',
                severity: 'high',
                title: 'Insufficient Sleep Detected',
                message: `You've been sleeping an average of ${pattern.avg_hours} hours. This may affect your health. ${pattern.recommendation}.`,
                context_data: pattern
              });
            }
          });
        }
        
        // Check vital trends
        if (row.context_type === 'vital_trend') {
          contextData.forEach(trend => {
            if (trend.risk_level === 'high') {
              alerts.push({
                alert_type: 'risk_high',
                severity: 'high',
                title: `${trend.vital_type} Trend Alert`,
                message: `Your ${trend.vital_type} has been ${trend.trend} by ${trend.change_percentage}%. Please monitor closely.`,
                context_data: trend
              });
            }
          });
        }
      });
      
      // Check for combined risk factors
      const symptomPatterns = patterns.rows.find(r => r.context_type === 'symptom_pattern');
      const sleepPatterns = patterns.rows.find(r => r.context_type === 'sleep_pattern');
      
      if (symptomPatterns && sleepPatterns) {
        const symptomData = typeof symptomPatterns.context_data === 'string'
          ? JSON.parse(symptomPatterns.context_data)
          : symptomPatterns.context_data;
        const sleepData = typeof sleepPatterns.context_data === 'string'
          ? JSON.parse(sleepPatterns.context_data)
          : sleepPatterns.context_data;
        
        const hasHeadaches = symptomData.some(p => p.symptom === 'headache' && p.frequency >= 3);
        const hasPoorSleep = sleepData.some(p => p.pattern === 'insufficient_sleep' && parseFloat(p.avg_hours) < 6);
        
        if (hasHeadaches && hasPoorSleep) {
          alerts.push({
            alert_type: 'pattern_detected',
            severity: 'high',
            title: 'Risk: Tension Migraine Spike',
            message: "You've had 3+ headaches in 5 days & slept <6 hrs. Risk: tension migraine spike. Consider rest and hydration.",
            context_data: {
              symptom_pattern: symptomData,
              sleep_pattern: sleepData
            }
          });
        }
      }
      
      // Store alerts
      for (const alert of alerts) {
        await this._storeAlert(patientId, alert);
      }
      
      return alerts;
    } catch (error) {
      console.error('Error generating proactive alerts:', error);
      throw error;
    }
  }

  /**
   * Store alert in database
   */
  static async _storeAlert(patientId, alertData) {
    const queryText = `
      INSERT INTO health_alerts (patient_id, alert_type, severity, title, message, context_data)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    
    await query(queryText, [
      patientId,
      alertData.alert_type,
      alertData.severity,
      alertData.title,
      alertData.message,
      JSON.stringify(alertData.context_data)
    ]);
  }
}

