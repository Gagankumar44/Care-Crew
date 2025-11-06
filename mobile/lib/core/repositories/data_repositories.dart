import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/triage_session.dart';
import '../models/skin_check_record.dart';
import '../models/rom_record.dart';
import '../database/database.dart';
import '../services/api_service.dart';

/// Repository for Triage Sessions
class TriageRepository {
  final AppDatabase _database = AppDatabase();
  final ApiService _apiService = ApiService();

  /// Save triage session locally
  Future<void> saveLocal(TriageSession session) async {
    final db = await _database.database;
    await db.insert('triage_sessions', {
      'id': session.id,
      'patient_id': session.patientId,
      'created_at': session.createdAt.millisecondsSinceEpoch,
      'updated_at': session.updatedAt.millisecondsSinceEpoch,
      'session_data': session.toJson().toString(),
      'triage_result': session.triageResult,
      'sync_status': session.syncStatus.name,
    });
  }

  /// Get local triage sessions
  Future<List<TriageSession>> getLocalSessions(String patientId) async {
    final db = await _database.database;
    final results = await db.query(
      'triage_sessions',
      where: 'patient_id = ?',
      whereArgs: [patientId],
      orderBy: 'created_at DESC',
    );

    return results.map((row) {
      final sessionData = Map<String, dynamic>.from(
        jsonDecode(row['session_data'] as String),
      );
      return TriageSession.fromJson(sessionData);
    }).toList();
  }
}

/// Repository for Skin Checks
class SkinCheckRepository {
  final AppDatabase _database = AppDatabase();
  final ApiService _apiService = ApiService();

  /// Save skin check locally
  Future<void> saveLocal(SkinCheckRecord record) async {
    final db = await _database.database;
    await db.insert('skin_checks', {
      'id': record.id,
      'patient_id': record.patientId,
      'created_at': record.createdAt.millisecondsSinceEpoch,
      'updated_at': record.updatedAt.millisecondsSinceEpoch,
      'image_path': record.imagePath,
      'location_data': record.locationData?.toJson().toString(),
      'risk_assessment': record.riskAssessment?.toJson().toString(),
      'sync_status': record.syncStatus.name,
    });
  }

  /// Get local skin checks
  Future<List<SkinCheckRecord>> getLocalChecks(String patientId) async {
    final db = await _database.database;
    final results = await db.query(
      'skin_checks',
      where: 'patient_id = ?',
      whereArgs: [patientId],
      orderBy: 'created_at DESC',
    );

    return results.map((row) => SkinCheckRecord.fromJson({
      'id': row['id'] as String,
      'patient_id': row['patient_id'] as String,
      'created_at': DateTime.fromMillisecondsSinceEpoch(row['created_at'] as int).toIso8601String(),
      'updated_at': DateTime.fromMillisecondsSinceEpoch(row['updated_at'] as int).toIso8601String(),
      'image_path': row['image_path'] as String,
      'location_data': row['location_data'] != null
          ? jsonDecode(row['location_data'] as String)
          : null,
      'risk_assessment': row['risk_assessment'] != null
          ? jsonDecode(row['risk_assessment'] as String)
          : null,
      'sync_status': row['sync_status'] as String,
    })).toList();
  }
}

/// Repository for ROM Records
class ROMRepository {
  final AppDatabase _database = AppDatabase();
  final ApiService _apiService = ApiService();

  /// Save ROM record locally
  Future<void> saveLocal(ROMRecord record) async {
    final db = await _database.database;
    await db.insert('rom_records', {
      'id': record.id,
      'patient_id': record.patientId,
      'exercise_id': record.exerciseId,
      'created_at': record.createdAt.millisecondsSinceEpoch,
      'updated_at': record.updatedAt.millisecondsSinceEpoch,
      'angle_data': record.angleData.map((a) => a.toJson()).toList().toString(),
      'max_angle': record.maxAngle,
      'min_angle': record.minAngle,
      'duration_seconds': record.durationSeconds,
      'sync_status': record.syncStatus.name,
    });
  }

  /// Get local ROM records
  Future<List<ROMRecord>> getLocalRecords(String patientId, {String? exerciseId}) async {
    final db = await _database.database;
    var whereClause = 'patient_id = ?';
    var whereArgs = [patientId];

    if (exerciseId != null) {
      whereClause += ' AND exercise_id = ?';
      whereArgs.add(exerciseId);
    }

    final results = await db.query(
      'rom_records',
      where: whereClause,
      whereArgs: whereArgs,
      orderBy: 'created_at DESC',
    );

    return results.map((row) {
      final angleData = jsonDecode(row['angle_data'] as String) as List;
      return ROMRecord.fromJson({
        'id': row['id'] as String,
        'patient_id': row['patient_id'] as String,
        'exercise_id': row['exercise_id'] as String,
        'created_at': DateTime.fromMillisecondsSinceEpoch(row['created_at'] as int).toIso8601String(),
        'updated_at': DateTime.fromMillisecondsSinceEpoch(row['updated_at'] as int).toIso8601String(),
        'angle_data': angleData,
        'max_angle': row['max_angle'],
        'min_angle': row['min_angle'],
        'duration_seconds': row['duration_seconds'],
        'sync_status': row['sync_status'] as String,
      });
    }).toList();
  }
}

// Riverpod providers
final triageRepositoryProvider = Provider<TriageRepository>((ref) => TriageRepository());
final skinCheckRepositoryProvider = Provider<SkinCheckRepository>((ref) => SkinCheckRepository());
final romRepositoryProvider = Provider<ROMRepository>((ref) => ROMRepository());

// Missing import
import 'dart:convert';

