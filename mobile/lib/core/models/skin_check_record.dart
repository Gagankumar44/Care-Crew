import 'triage_session.dart' show SyncStatus;

class SkinCheckRecord {
  final String id;
  final String patientId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String imagePath; // Local path to encrypted image
  final BodyLocation? locationData;
  final RiskAssessment? riskAssessment;
  final SyncStatus syncStatus;
  final DateTime? syncTimestamp;

  SkinCheckRecord({
    required this.id,
    required this.patientId,
    required this.createdAt,
    required this.updatedAt,
    required this.imagePath,
    this.locationData,
    this.riskAssessment,
    this.syncStatus = SyncStatus.pending,
    this.syncTimestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'patient_id': patientId,
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
        'image_path': imagePath,
        'location_data': locationData?.toJson(),
        'risk_assessment': riskAssessment?.toJson(),
        'sync_status': syncStatus.name,
        'sync_timestamp': syncTimestamp?.toIso8601String(),
      };

  factory SkinCheckRecord.fromJson(Map<String, dynamic> json) =>
      SkinCheckRecord(
        id: json['id'] as String,
        patientId: json['patient_id'] as String,
        createdAt: DateTime.parse(json['created_at'] as String),
        updatedAt: DateTime.parse(json['updated_at'] as String),
        imagePath: json['image_path'] as String,
        locationData: json['location_data'] != null
            ? BodyLocation.fromJson(json['location_data'] as Map<String, dynamic>)
            : null,
        riskAssessment: json['risk_assessment'] != null
            ? RiskAssessment.fromJson(json['risk_assessment'] as Map<String, dynamic>)
            : null,
        syncStatus: SyncStatus.values.firstWhere(
          (e) => e.name == json['sync_status'],
          orElse: () => SyncStatus.pending,
        ),
        syncTimestamp: json['sync_timestamp'] != null
            ? DateTime.parse(json['sync_timestamp'] as String)
            : null,
      );
}

class BodyLocation {
  final String bodyPart; // 'arm', 'leg', 'torso', etc.
  final double x; // Normalized 0.0-1.0
  final double y; // Normalized 0.0-1.0

  BodyLocation({
    required this.bodyPart,
    required this.x,
    required this.y,
  });

  Map<String, dynamic> toJson() => {
        'body_part': bodyPart,
        'x': x,
        'y': y,
      };

  factory BodyLocation.fromJson(Map<String, dynamic> json) => BodyLocation(
        bodyPart: json['body_part'] as String,
        x: (json['x'] as num).toDouble(),
        y: (json['y'] as num).toDouble(),
      );
}

class RiskAssessment {
  final String riskLevel; // 'low', 'moderate', 'high'
  final String recommendation; // 'monitor', 'see-dermatologist', 'urgent-care'
  final double confidence; // 0.0-1.0
  final List<String>? features; // Detected features

  RiskAssessment({
    required this.riskLevel,
    required this.recommendation,
    required this.confidence,
    this.features,
  });

  Map<String, dynamic> toJson() => {
        'risk_level': riskLevel,
        'recommendation': recommendation,
        'confidence': confidence,
        'features': features,
      };

  factory RiskAssessment.fromJson(Map<String, dynamic> json) =>
      RiskAssessment(
        riskLevel: json['risk_level'] as String,
        recommendation: json['recommendation'] as String,
        confidence: (json['confidence'] as num).toDouble(),
        features: json['features'] != null
            ? (json['features'] as List).map((e) => e as String).toList()
            : null,
      );
}

import 'triage_session.dart' show SyncStatus;

