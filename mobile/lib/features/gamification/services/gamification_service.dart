/// Gamification System - Octalysis Framework Implementation
/// Module 2.4: Patient adherence and engagement

import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Gamification Points
class GamificationPoints {
  final int totalPoints;
  final int currentLevel;
  final int pointsToNextLevel;
  final int exerciseStreak;
  final List<Badge> badges;

  GamificationPoints({
    required this.totalPoints,
    required this.currentLevel,
    required this.pointsToNextLevel,
    required this.exerciseStreak,
    required this.badges,
  });
}

/// Badge Types (Octalysis Core Drives)
enum BadgeType {
  // Core Drive 2: Development & Accomplishment
  perfectForm,
  sevenDayStreak,
  thirtyDayStreak,
  hundredExercises,
  
  // Core Drive 1: Epic Meaning & Calling
  healingJourney,
  recoveryMilestone,
  
  // Core Drive 4: Ownership & Possession
  profileCustomized,
  dataOwned,
}

class Badge {
  final String id;
  final BadgeType type;
  final String name;
  final String description;
  final DateTime earnedAt;

  Badge({
    required this.id,
    required this.type,
    required this.name,
    required this.description,
    required this.earnedAt,
  });
}

/// Gamification Service
class GamificationService {
  /// Calculate points for completing an exercise
  static int calculateExercisePoints({
    required bool perfectForm,
    required int durationSeconds,
    required double romProgress, // Percentage improvement
  }) {
    int points = 10; // Base points
    
    if (perfectForm) points += 5; // Perfect form bonus
    if (durationSeconds >= 60) points += 5; // Duration bonus
    if (romProgress > 0.1) points += (romProgress * 20).round(); // Progress bonus
    
    return points;
  }

  /// Calculate level from total points
  static int calculateLevel(int totalPoints) {
    // Level formula: sqrt(points / 100)
    return (totalPoints / 100).sqrt().floor() + 1;
  }

  /// Calculate points needed for next level
  static int calculatePointsToNextLevel(int currentLevel, int totalPoints) {
    final nextLevelPoints = (currentLevel * currentLevel) * 100;
    return nextLevelPoints - totalPoints;
  }

  /// Check for new badges
  static List<Badge> checkBadges({
    required int totalPoints,
    required int exerciseStreak,
    required int totalExercises,
    required bool profileCustomized,
  }) {
    final badges = <Badge>[];
    
    // 7-Day Streak Badge
    if (exerciseStreak >= 7 && exerciseStreak < 30) {
      badges.add(Badge(
        id: 'badge_7day_streak',
        type: BadgeType.sevenDayStreak,
        name: '7-Day Streak',
        description: 'Completed exercises for 7 consecutive days!',
        earnedAt: DateTime.now(),
      ));
    }
    
    // 30-Day Streak Badge
    if (exerciseStreak >= 30) {
      badges.add(Badge(
        id: 'badge_30day_streak',
        type: BadgeType.thirtyDayStreak,
        name: '30-Day Streak',
        description: 'Completed exercises for 30 consecutive days!',
        earnedAt: DateTime.now(),
      ));
    }
    
    // 100 Exercises Badge
    if (totalExercises >= 100) {
      badges.add(Badge(
        id: 'badge_100_exercises',
        type: BadgeType.hundredExercises,
        name: '100 Exercises',
        description: 'Completed 100 exercises!',
        earnedAt: DateTime.now(),
      ));
    }
    
    // Profile Customized Badge
    if (profileCustomized) {
      badges.add(Badge(
        id: 'badge_profile',
        type: BadgeType.profileCustomized,
        name: 'Profile Master',
        description: 'Customized your profile!',
        earnedAt: DateTime.now(),
      ));
    }
    
    return badges;
  }

  /// Get motivational message based on progress
  static String getMotivationalMessage({
    required int exerciseStreak,
    required double romProgress,
    required int daysSinceStart,
  }) {
    if (exerciseStreak >= 30) {
      return 'Amazing! You\'re on a ${exerciseStreak}-day streak! Keep up the incredible work!';
    } else if (exerciseStreak >= 7) {
      return 'Great job! You\'ve maintained a ${exerciseStreak}-day streak!';
    } else if (romProgress > 0.2) {
      return 'Excellent progress! Your range of motion has improved significantly!';
    } else if (daysSinceStart < 7) {
      return 'Welcome to your healing journey! Every exercise counts!';
    } else {
      return 'Keep going! Consistency is key to recovery!';
    }
  }
}

/// Gamification State Provider
final gamificationProvider = StateNotifierProvider<GamificationNotifier, GamificationPoints>((ref) {
  return GamificationNotifier();
});

class GamificationNotifier extends StateNotifier<GamificationPoints> {
  GamificationNotifier() : super(GamificationPoints(
    totalPoints: 0,
    currentLevel: 1,
    pointsToNextLevel: 100,
    exerciseStreak: 0,
    badges: [],
  ));

  /// Award points for completing exercise
  void awardExercisePoints({
    required bool perfectForm,
    required int durationSeconds,
    required double romProgress,
  }) {
    final points = GamificationService.calculateExercisePoints(
      perfectForm: perfectForm,
      durationSeconds: durationSeconds,
      romProgress: romProgress,
    );

    final newTotalPoints = state.totalPoints + points;
    final newLevel = GamificationService.calculateLevel(newTotalPoints);
    final pointsToNext = GamificationService.calculatePointsToNextLevel(
      newLevel,
      newTotalPoints,
    );

    state = GamificationPoints(
      totalPoints: newTotalPoints,
      currentLevel: newLevel,
      pointsToNextLevel: pointsToNext,
      exerciseStreak: state.exerciseStreak,
      badges: state.badges,
    );
  }

  /// Update exercise streak
  void updateStreak(int newStreak) {
    final newBadges = GamificationService.checkBadges(
      totalPoints: state.totalPoints,
      exerciseStreak: newStreak,
      totalExercises: 0, // TODO: Track total exercises
      profileCustomized: false, // TODO: Track profile customization
    );

    state = GamificationPoints(
      totalPoints: state.totalPoints,
      currentLevel: state.currentLevel,
      pointsToNextLevel: state.pointsToNextLevel,
      exerciseStreak: newStreak,
      badges: [...state.badges, ...newBadges],
    );
  }
}

// Extension for sqrt calculation
extension MathExtension on double {
  double sqrt() {
    // Simple approximation
    double guess = this / 2;
    for (int i = 0; i < 10; i++) {
      guess = (guess + this / guess) / 2;
    }
    return guess;
  }
}

extension IntExtension on int {
  double sqrt() => (this as double).sqrt();
}

