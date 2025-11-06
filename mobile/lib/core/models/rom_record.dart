import 'triage_session.dart' show SyncStatus;

class ROMRecord {
  final String id;
  final String patientId;
  final String exerciseId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<AngleMeasurement> angleData;
  final double? maxAngle;
  final double? minAngle;
  final int? durationSeconds;
  final SyncStatus syncStatus;
  final DateTime? syncTimestamp;

  ROMRecord({
    required this.id,
    required this.patientId,
    required this.exerciseId,
    required this.createdAt,
    required this.updatedAt,
    required this.angleData,
    this.maxAngle,
    this.minAngle,
    this.durationSeconds,
    this.syncStatus = SyncStatus.pending,
    this.syncTimestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'patient_id': patientId,
        'exercise_id': exerciseId,
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
        'angle_data': angleData.map((a) => a.toJson()).toList(),
        'max_angle': maxAngle,
        'min_angle': minAngle,
        'duration_seconds': durationSeconds,
        'sync_status': syncStatus.name,
        'sync_timestamp': syncTimestamp?.toIso8601String(),
      };

  factory ROMRecord.fromJson(Map<String, dynamic> json) => ROMRecord(
        id: json['id'] as String,
        patientId: json['patient_id'] as String,
        exerciseId: json['exercise_id'] as String,
        createdAt: DateTime.parse(json['created_at'] as String),
        updatedAt: DateTime.parse(json['updated_at'] as String),
        angleData: (json['angle_data'] as List)
            .map((a) => AngleMeasurement.fromJson(a))
            .toList(),
        maxAngle: json['max_angle'] != null ? (json['max_angle'] as num).toDouble() : null,
        minAngle: json['min_angle'] != null ? (json['min_angle'] as num).toDouble() : null,
        durationSeconds: json['duration_seconds'] as int?,
        syncStatus: SyncStatus.values.firstWhere(
          (e) => e.name == json['sync_status'],
          orElse: () => SyncStatus.pending,
        ),
        syncTimestamp: json['sync_timestamp'] != null
            ? DateTime.parse(json['sync_timestamp'] as String)
            : null,
      );
}

class AngleMeasurement {
  final DateTime timestamp;
  final double angle; // Degrees
  final String jointType; // 'shoulder', 'knee', 'hip', etc.

  AngleMeasurement({
    required this.timestamp,
    required this.angle,
    required this.jointType,
  });

  Map<String, dynamic> toJson() => {
        'timestamp': timestamp.toIso8601String(),
        'angle': angle,
        'joint_type': jointType,
      };

  factory AngleMeasurement.fromJson(Map<String, dynamic> json) =>
      AngleMeasurement(
        timestamp: DateTime.parse(json['timestamp'] as String),
        angle: (json['angle'] as num).toDouble(),
        jointType: json['joint_type'] as String,
      );
}

import 'triage_session.dart' show SyncStatus;

