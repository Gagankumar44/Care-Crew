class TriageSession {
  final String id;
  final String patientId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? triageResult;
  final List<TriageMessage> messages;
  final SyncStatus syncStatus;
  final DateTime? syncTimestamp;

  TriageSession({
    required this.id,
    required this.patientId,
    required this.createdAt,
    required this.updatedAt,
    this.triageResult,
    required this.messages,
    this.syncStatus = SyncStatus.pending,
    this.syncTimestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'patient_id': patientId,
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
        'triage_result': triageResult,
        'messages': messages.map((m) => m.toJson()).toList(),
        'sync_status': syncStatus.name,
        'sync_timestamp': syncTimestamp?.toIso8601String(),
      };

  factory TriageSession.fromJson(Map<String, dynamic> json) => TriageSession(
        id: json['id'] as String,
        patientId: json['patient_id'] as String,
        createdAt: DateTime.parse(json['created_at'] as String),
        updatedAt: DateTime.parse(json['updated_at'] as String),
        triageResult: json['triage_result'] as String?,
        messages: (json['messages'] as List?)
                ?.map((m) => TriageMessage.fromJson(m))
                .toList() ??
            [],
        syncStatus: SyncStatus.values.firstWhere(
          (e) => e.name == json['sync_status'],
          orElse: () => SyncStatus.pending,
        ),
        syncTimestamp: json['sync_timestamp'] != null
            ? DateTime.parse(json['sync_timestamp'] as String)
            : null,
      );
}

class TriageMessage {
  final String id;
  final String role; // 'user' or 'assistant'
  final String content;
  final DateTime timestamp;

  TriageMessage({
    required this.id,
    required this.role,
    required this.content,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'role': role,
        'content': content,
        'timestamp': timestamp.toIso8601String(),
      };

  factory TriageMessage.fromJson(Map<String, dynamic> json) => TriageMessage(
        id: json['id'] as String,
        role: json['role'] as String,
        content: json['content'] as String,
        timestamp: DateTime.parse(json['timestamp'] as String),
      );
}

class TriageResult {
  final String recommendedModule; // 'skin-check', 'rom-analysis', 'provider', 'emergency'
  final String urgency; // 'low', 'moderate', 'high', 'urgent'
  final double confidence; // 0.0 to 1.0
  final String reasoning;

  TriageResult({
    required this.recommendedModule,
    required this.urgency,
    required this.confidence,
    required this.reasoning,
  });

  factory TriageResult.fromJson(Map<String, dynamic> json) => TriageResult(
        recommendedModule: json['recommendedModule'] as String,
        urgency: json['urgency'] as String,
        confidence: (json['confidence'] as num).toDouble(),
        reasoning: json['reasoning'] as String,
      );
}

enum SyncStatus {
  pending,
  syncing,
  synced,
  failed,
}

