import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

import '../config/app_config.dart';

/// Offline-first database using Room (SQLite abstraction)
/// Primary source of truth for local data
class AppDatabase {
  static final AppDatabase _instance = AppDatabase._internal();
  static Database? _database;

  factory AppDatabase() => _instance;
  AppDatabase._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'mediar.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    // Patient Profile Table
    await db.execute('''
      CREATE TABLE patient_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        sync_timestamp INTEGER,
        data TEXT NOT NULL
      )
    ''');

    // Triage Sessions Table
    await db.execute('''
      CREATE TABLE triage_sessions (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        sync_timestamp INTEGER,
        session_data TEXT NOT NULL,
        triage_result TEXT,
        FOREIGN KEY (patient_id) REFERENCES patient_profiles(id)
      )
    ''');

    // Skin Check Records Table
    await db.execute('''
      CREATE TABLE skin_checks (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        sync_timestamp INTEGER,
        image_path TEXT NOT NULL,
        location_data TEXT,
        risk_assessment TEXT,
        FOREIGN KEY (patient_id) REFERENCES patient_profiles(id)
      )
    ''');

    // ROM Analysis Records Table
    await db.execute('''
      CREATE TABLE rom_records (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        sync_timestamp INTEGER,
        angle_data TEXT NOT NULL,
        max_angle REAL,
        min_angle REAL,
        duration_seconds INTEGER,
        FOREIGN KEY (patient_id) REFERENCES patient_profiles(id)
      )
    ''');

    // Sync Queue Table (for conflict resolution)
    await db.execute('''
      CREATE TABLE sync_queue (
        id TEXT PRIMARY KEY,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        priority INTEGER NOT NULL DEFAULT 1,
        created_at INTEGER NOT NULL,
        data TEXT NOT NULL,
        origin TEXT NOT NULL DEFAULT 'patient'
      )
    ''');

    // Adherence Log Table
    await db.execute('''
      CREATE TABLE adherence_logs (
        id TEXT PRIMARY KEY,
        patient_id TEXT NOT NULL,
        exercise_id TEXT NOT NULL,
        completed_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'pending',
        sync_timestamp INTEGER,
        pain_score INTEGER,
        notes TEXT,
        FOREIGN KEY (patient_id) REFERENCES patient_profiles(id)
      )
    ''');

    // Create indexes for performance
    await db.execute('CREATE INDEX idx_sync_queue_priority ON sync_queue(priority DESC, created_at ASC)');
    await db.execute('CREATE INDEX idx_sync_status ON patient_profiles(sync_status)');
    await db.execute('CREATE INDEX idx_rom_patient_date ON rom_records(patient_id, created_at DESC)');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    // Handle database migrations
    // TODO: Implement migration logic
  }

  /// Mark record as synced
  Future<void> markSynced(String tableName, String recordId) async {
    final db = await database;
    await db.update(
      tableName,
      {
        'sync_status': 'synced',
        'sync_timestamp': DateTime.now().millisecondsSinceEpoch,
      },
      where: 'id = ?',
      whereArgs: [recordId],
    );
  }

  /// Get pending sync records
  Future<List<Map<String, dynamic>>> getPendingSyncRecords({
    int limit = AppConfig.syncBatchSize,
  }) async {
    final db = await database;
    
    // Get records from sync_queue ordered by priority
    final results = await db.query(
      'sync_queue',
      orderBy: 'priority DESC, created_at ASC',
      limit: limit,
    );
    
    return results;
  }
}

