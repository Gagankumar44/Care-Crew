import 'package:workmanager/workmanager.dart';
import '../database/database.dart';
import '../services/api_service.dart';
import '../config/app_config.dart';

/// Sync Engine for Offline-First Architecture
/// Implements "Rule-Based Field-Level Merge" strategy
class SyncEngine {
  final AppDatabase _database = AppDatabase();
  final ApiService _apiService = ApiService();

  /// Initialize background sync worker
  static Future<void> initialize() async {
    await Workmanager().initialize(
      callbackDispatcher,
      isInDebugMode: false,
    );

    // Register periodic sync task
    await Workmanager().registerPeriodicTask(
      'sync-task',
      'syncPendingRecords',
      frequency: const Duration(minutes: 15),
      constraints: Constraints(
        networkType: NetworkType.notRequired, // Will sync when network available
      ),
    );
  }

  /// Manual sync trigger
  Future<void> syncNow() async {
    await _syncPendingRecords();
  }

  /// Sync pending records from local database
  Future<void> _syncPendingRecords() async {
    try {
      final pendingRecords = await _database.getPendingSyncRecords(
        limit: AppConfig.syncBatchSize,
      );

      if (pendingRecords.isEmpty) {
        return;
      }

      // Group records by table
      final groupedRecords = <String, List<Map<String, dynamic>>>{};
      for (final record in pendingRecords) {
        final tableName = record['table_name'] as String;
        if (!groupedRecords.containsKey(tableName)) {
          groupedRecords[tableName] = [];
        }
        groupedRecords[tableName]!.add(record);
      }

      // Sync each group
      for (final entry in groupedRecords.entries) {
        await _syncTableRecords(entry.key, entry.value);
      }
    } catch (e) {
      // Log error but don't throw - sync will retry later
      print('Sync error: $e');
    }
  }

  /// Sync records for a specific table
  Future<void> _syncTableRecords(
    String tableName,
    List<Map<String, dynamic>> records,
  ) async {
    try {
      // Prepare records for sync
      final syncPayload = records.map((record) {
        return {
          'table': tableName,
          'recordId': record['record_id'],
          'operation': record['operation'],
          'priority': record['priority'],
          'data': record['data'],
          'origin': record['origin'],
          'timestamp': record['created_at'],
        };
      }).toList();

      // Send to backend
      final response = await _apiService.syncPendingRecords(syncPayload);

      // Process response (merged data from server)
      final mergedRecords = response['mergedRecords'] as List;
      
      for (final mergedRecord in mergedRecords) {
        // Update local database with merged data
        await _updateLocalRecord(
          tableName,
          mergedRecord['recordId'] as String,
          mergedRecord['data'] as Map<String, dynamic>,
        );

        // Mark as synced
        await _database.markSynced(tableName, mergedRecord['recordId'] as String);
      }

      // Handle conflicts
      final conflicts = response['conflicts'] as List?;
      if (conflicts != null && conflicts.isNotEmpty) {
        await _handleConflicts(conflicts);
      }
    } catch (e) {
      // Mark sync as failed, will retry later
      print('Sync error for table $tableName: $e');
      rethrow;
    }
  }

  /// Update local record with merged data
  Future<void> _updateLocalRecord(
    String tableName,
    String recordId,
    Map<String, dynamic> data,
  ) async {
    final db = await _database.database;
    
    // Update based on table type
    switch (tableName) {
      case 'triage_sessions':
        await db.update(
          'triage_sessions',
          {'session_data': data.toString()},
          where: 'id = ?',
          whereArgs: [recordId],
        );
        break;
      case 'skin_checks':
        await db.update(
          'skin_checks',
          {
            'image_path': data['image_path'],
            'location_data': data['location_data']?.toString(),
            'risk_assessment': data['risk_assessment']?.toString(),
          },
          where: 'id = ?',
          whereArgs: [recordId],
        );
        break;
      case 'rom_records':
        await db.update(
          'rom_records',
          {
            'angle_data': data['angle_data'].toString(),
            'max_angle': data['max_angle'],
            'min_angle': data['min_angle'],
            'duration_seconds': data['duration_seconds'],
          },
          where: 'id = ?',
          whereArgs: [recordId],
        );
        break;
    }
  }

  /// Handle sync conflicts
  /// Provider data always wins in conflicts
  Future<void> _handleConflicts(List<dynamic> conflicts) async {
    for (final conflict in conflicts) {
      final recordId = conflict['recordId'] as String;
      final tableName = conflict['table'] as String;
      final serverData = conflict['serverData'] as Map<String, dynamic>;
      final localData = conflict['localData'] as Map<String, dynamic>;

      // Provider data has higher priority
      if (serverData['origin'] == 'provider') {
        // Server wins - update local
        await _updateLocalRecord(tableName, recordId, serverData);
      } else if (localData['origin'] == 'provider') {
        // Local provider data wins - re-sync
        // This shouldn't happen in normal flow, but handle it
        await _resyncRecord(tableName, recordId, localData);
      } else {
        // Both patient data - use timestamp (last write wins)
        final serverTimestamp = DateTime.parse(serverData['updated_at'] as String);
        final localTimestamp = DateTime.parse(localData['updated_at'] as String);
        
        if (serverTimestamp.isAfter(localTimestamp)) {
          await _updateLocalRecord(tableName, recordId, serverData);
        } else {
          await _resyncRecord(tableName, recordId, localData);
        }
      }
    }
  }

  /// Re-sync a record to server
  Future<void> _resyncRecord(
    String tableName,
    String recordId,
    Map<String, dynamic> data,
  ) async {
    // Add back to sync queue with higher priority
    final db = await _database.database;
    await db.insert('sync_queue', {
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'table_name': tableName,
      'record_id': recordId,
      'operation': 'update',
      'priority': 2, // Higher priority
      'created_at': DateTime.now().millisecondsSinceEpoch,
      'data': data.toString(),
      'origin': data['origin'] ?? 'patient',
    });
  }
}

/// Background callback for WorkManager
@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    if (task == 'syncPendingRecords') {
      final syncEngine = SyncEngine();
      await syncEngine.syncNow();
      return Future.value(true);
    }
    return Future.value(false);
  });
}

