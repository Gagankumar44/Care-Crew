import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Virtual Nurse Avatar Service
 * Handles AR/3D guided sessions: medicine reminders, exercise coaching, breathing, recovery programs
 */

export class NurseAvatarService {
  /**
   * Create a new nurse avatar session
   */
  async createSession(patientId, sessionData) {
    const {
      sessionType,
      sessionData: sessionDataJson,
    } = sessionData;

    const validTypes = ['medicine_reminder', 'exercise_coaching', 'breathing', 'recovery_program'];
    if (!validTypes.includes(sessionType)) {
      throw new Error(`Invalid session type. Must be one of: ${validTypes.join(', ')}`);
    }

    const result = await query(
      `INSERT INTO nurse_avatar_sessions (
        patient_id, session_type, session_data
      ) VALUES ($1, $2, $3)
      RETURNING *`,
      [
        patientId,
        sessionType,
        JSON.stringify(sessionDataJson || {}),
      ]
    );

    return result.rows[0];
  }

  /**
   * Get all sessions for a patient
   */
  async getSessions(patientId, sessionType = null, completed = null) {
    let sql = 'SELECT * FROM nurse_avatar_sessions WHERE patient_id = $1';
    const params = [patientId];
    let paramIndex = 2;

    if (sessionType) {
      sql += ` AND session_type = $${paramIndex++}`;
      params.push(sessionType);
    }

    if (completed !== null) {
      sql += ` AND completed = $${paramIndex++}`;
      params.push(completed);
    }

    sql += ' ORDER BY started_at DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  /**
   * Get a specific session by ID
   */
  async getSessionById(sessionId, patientId) {
    const result = await query(
      'SELECT * FROM nurse_avatar_sessions WHERE id = $1 AND patient_id = $2',
      [sessionId, patientId]
    );

    if (result.rows.length === 0) {
      throw new Error('Session not found');
    }

    return result.rows[0];
  }

  /**
   * Update session progress
   */
  async updateSession(sessionId, patientId, updateData) {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (updateData.sessionData) {
      fields.push(`session_data = $${paramIndex++}`);
      values.push(JSON.stringify(updateData.sessionData));
    }

    if (updateData.completed !== undefined) {
      fields.push(`completed = $${paramIndex++}`);
      values.push(updateData.completed);
      
      if (updateData.completed) {
        fields.push(`completed_at = NOW()`);
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(sessionId, patientId);

    const result = await query(
      `UPDATE nurse_avatar_sessions 
       SET ${fields.join(', ')} 
       WHERE id = $${paramIndex++} AND patient_id = $${paramIndex++}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Session not found');
    }

    return result.rows[0];
  }

  /**
   * Complete a session
   */
  async completeSession(sessionId, patientId) {
    return await this.updateSession(sessionId, patientId, { completed: true });
  }

  /**
   * Get medicine reminder session template
   */
  async getMedicineReminderTemplate(medicineName, dosage, timing) {
    return {
      type: 'medicine_reminder',
      avatar: {
        name: 'Nurse Sarah',
        greeting: `Hello! It's time for your ${medicineName}.`,
        instructions: [
          `Take ${dosage} of ${medicineName}`,
          'Follow with a glass of water',
          'Remind me if you experience any side effects',
        ],
      },
      arGuidance: {
        enabled: true,
        overlay: 'medicine_instruction',
        points: ['bottle_position', 'hand_position', 'mouth_position'],
      },
      confirmation: {
        required: true,
        questions: [
          'Did you take the medicine?',
          'Any side effects to report?',
        ],
      },
      timing: timing || 'now',
    };
  }

  /**
   * Get exercise coaching session template
   */
  async getExerciseCoachingTemplate(exerciseType, duration, difficulty) {
    return {
      type: 'exercise_coaching',
      avatar: {
        name: 'Nurse Sarah',
        greeting: `Let's do some ${exerciseType} exercises together!`,
        instructions: [
          `We'll do ${duration} minutes of ${exerciseType}`,
          'Follow my movements on screen',
          'Take breaks if you feel tired',
        ],
      },
      arGuidance: {
        enabled: true,
        overlay: 'pose_detection',
        tracking: ['joints', 'form', 'range_of_motion'],
      },
      exercises: [
        {
          name: exerciseType,
          duration: duration,
          difficulty: difficulty || 'beginner',
          instructions: this.getExerciseInstructions(exerciseType),
        },
      ],
      metrics: {
        track: ['reps', 'form_score', 'completion_rate'],
      },
    };
  }

  /**
   * Get exercise instructions based on type
   */
  getExerciseInstructions(type) {
    const instructions = {
      'shoulder_rehab': [
        'Raise your arm slowly to shoulder height',
        'Hold for 5 seconds',
        'Lower slowly',
        'Repeat 10 times',
      ],
      'knee_rehab': [
        'Sit with your leg straight',
        'Tighten your thigh muscle',
        'Lift your heel off the ground',
        'Hold for 5 seconds',
        'Lower slowly',
        'Repeat 15 times',
      ],
      'breathing': [
        'Sit comfortably',
        'Inhale deeply through your nose for 4 counts',
        'Hold for 4 counts',
        'Exhale slowly through your mouth for 6 counts',
        'Repeat 5-10 times',
      ],
      'stretching': [
        'Move slowly and gently',
        'Hold each stretch for 20-30 seconds',
        'Don\'t bounce',
        'Breathe deeply throughout',
      ],
    };

    return instructions[type] || [
      'Follow the movements shown on screen',
      'Move at your own pace',
      'Stop if you feel pain',
    ];
  }

  /**
   * Get breathing session template
   */
  async getBreathingSessionTemplate(breathingType = 'deep_breathing', duration = 5) {
    return {
      type: 'breathing',
      avatar: {
        name: 'Nurse Sarah',
        greeting: 'Let\'s practice some breathing exercises together.',
        instructions: [
          'Find a comfortable position',
          'Focus on your breath',
          'Follow my guidance',
        ],
      },
      arGuidance: {
        enabled: true,
        overlay: 'breathing_guide',
        visual: 'animated_circle',
      },
      breathingPattern: {
        type: breathingType,
        inhaleDuration: 4,
        holdDuration: 4,
        exhaleDuration: 6,
        cycles: duration * 60 / 14, // Approximate cycles for duration
      },
      sessionDuration: duration,
      metrics: {
        track: ['breathing_rate', 'completion', 'relaxation_score'],
      },
    };
  }

  /**
   * Get recovery program session template
   */
  async getRecoveryProgramTemplate(programType, dayNumber) {
    const programs = {
      'post_surgery': {
        greeting: 'Welcome to your post-surgery recovery program!',
        exercises: [
          'Gentle range of motion',
          'Pain management guidance',
          'Wound care instructions',
        ],
      },
      'injury_rehab': {
        greeting: 'Let\'s work on your injury rehabilitation!',
        exercises: [
          'Progressive exercises',
          'Strengthening activities',
          'Pain monitoring',
        ],
      },
      'chronic_condition': {
        greeting: 'Time for your daily health management!',
        exercises: [
          'Symptom monitoring',
          'Medication reminders',
          'Lifestyle guidance',
        ],
      },
    };

    const program = programs[programType] || programs['injury_rehab'];

    return {
      type: 'recovery_program',
      avatar: {
        name: 'Nurse Sarah',
        greeting: program.greeting,
        dayInfo: `Day ${dayNumber} of your recovery program`,
      },
      arGuidance: {
        enabled: true,
        overlay: 'recovery_guidance',
        tracking: ['progress', 'form', 'pain_level'],
      },
      activities: program.exercises,
      progress: {
        day: dayNumber,
        milestones: this.getRecoveryMilestones(programType, dayNumber),
      },
      metrics: {
        track: ['pain_level', 'mobility', 'strength', 'adherence'],
      },
    };
  }

  /**
   * Get recovery milestones
   */
  getRecoveryMilestones(programType, dayNumber) {
    const milestones = {
      'post_surgery': {
        1: 'First day of movement',
        7: 'One week milestone',
        14: 'Two weeks milestone',
        30: 'One month milestone',
      },
      'injury_rehab': {
        3: 'Initial recovery phase',
        10: 'Mid-recovery phase',
        21: 'Three weeks milestone',
        30: 'One month milestone',
      },
      'chronic_condition': {
        7: 'One week of consistent management',
        30: 'One month milestone',
        90: 'Three months milestone',
      },
    };

    const programMilestones = milestones[programType] || milestones['injury_rehab'];
    const achieved = [];
    const upcoming = [];

    for (const [day, milestone] of Object.entries(programMilestones)) {
      if (parseInt(day) <= dayNumber) {
        achieved.push({ day: parseInt(day), milestone, achieved: true });
      } else {
        upcoming.push({ day: parseInt(day), milestone, achieved: false });
      }
    }

    return { achieved, upcoming };
  }

  /**
   * Generate session summary
   */
  async generateSessionSummary(sessionId, patientId) {
    const session = await this.getSessionById(sessionId, patientId);
    const sessionData = typeof session.session_data === 'string'
      ? JSON.parse(session.session_data)
      : session.session_data;

    const summary = {
      sessionId: session.id,
      sessionType: session.session_type,
      duration: session.completed_at && session.started_at
        ? Math.floor((new Date(session.completed_at) - new Date(session.started_at)) / 1000 / 60)
        : null,
      completed: session.completed,
      completionRate: sessionData.metrics?.completion_rate || null,
      achievements: sessionData.achievements || [],
      notes: sessionData.notes || null,
      nextSession: this.getNextSessionRecommendation(session.session_type),
    };

    return summary;
  }

  /**
   * Get next session recommendation
   */
  getNextSessionRecommendation(sessionType) {
    const recommendations = {
      'medicine_reminder': {
        nextSession: 'medicine_reminder',
        time: 'Next scheduled dose',
        message: 'Set up your next medicine reminder',
      },
      'exercise_coaching': {
        nextSession: 'exercise_coaching',
        time: 'Tomorrow',
        message: 'Continue with your exercise routine',
      },
      'breathing': {
        nextSession: 'breathing',
        time: 'Later today',
        message: 'Practice breathing exercises 2-3 times daily',
      },
      'recovery_program': {
        nextSession: 'recovery_program',
        time: 'Tomorrow',
        message: 'Continue with your recovery program',
      },
    };

    return recommendations[sessionType] || {
      nextSession: sessionType,
      time: 'As needed',
      message: 'Continue with your health routine',
    };
  }

  /**
   * Get session statistics for patient
   */
  async getSessionStatistics(patientId, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const stats = await query(
      `SELECT 
        session_type,
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN completed = true THEN 1 END) as completed_sessions,
        AVG(EXTRACT(EPOCH FROM (completed_at - started_at))/60) as avg_duration_minutes
      FROM nurse_avatar_sessions
      WHERE patient_id = $1 AND started_at >= $2
      GROUP BY session_type`,
      [patientId, cutoffDate]
    );

    const summary = {
      totalSessions: stats.rows.reduce((sum, row) => sum + parseInt(row.total_sessions), 0),
      completedSessions: stats.rows.reduce((sum, row) => sum + parseInt(row.completed_sessions), 0),
      completionRate: 0,
      byType: {},
    };

    stats.rows.forEach((row) => {
      const completed = parseInt(row.completed_sessions);
      const total = parseInt(row.total_sessions);
      summary.byType[row.session_type] = {
        total,
        completed,
        completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
        avgDuration: row.avg_duration_minutes ? parseFloat(row.avg_duration_minutes).toFixed(1) : null,
      };
    });

    if (summary.totalSessions > 0) {
      summary.completionRate = (
        (summary.completedSessions / summary.totalSessions) * 100
      ).toFixed(1);
    }

    return summary;
  }
}

export default new NurseAvatarService();

