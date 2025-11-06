/// Mock Data Generators for Testing and Development

import '../../core/models/triage_session.dart';
import '../../core/models/skin_check_record.dart';
import '../../core/models/rom_record.dart';

class MockDataGenerator {
  /// Generate mock triage session
  static TriageSession generateTriageSession({
    String? patientId,
    int messageCount = 5,
  }) {
    final now = DateTime.now();
    final messages = <TriageMessage>[];
    
    for (int i = 0; i < messageCount; i++) {
      messages.add(TriageMessage(
        id: 'msg-$i',
        role: i % 2 == 0 ? 'user' : 'assistant',
        content: i % 2 == 0
            ? 'This is a user message $i'
            : 'This is an AI assistant response $i',
        timestamp: now.subtract(Duration(minutes: messageCount - i)),
      ));
    }
    
    return TriageSession(
      id: 'session-${DateTime.now().millisecondsSinceEpoch}',
      patientId: patientId ?? 'patient-123',
      createdAt: now.subtract(const Duration(hours: 1)),
      updatedAt: now,
      messages: messages,
      triageResult: '{"recommendedModule": "skin-check", "urgency": "moderate"}',
    );
  }

  /// Generate mock skin check record
  static SkinCheckRecord generateSkinCheckRecord({
    String? patientId,
    String? riskLevel,
  }) {
    final now = DateTime.now();
    return SkinCheckRecord(
      id: 'skin-${DateTime.now().millisecondsSinceEpoch}',
      patientId: patientId ?? 'patient-123',
      createdAt: now,
      updatedAt: now,
      imagePath: '/mock/path/to/image.jpg',
      locationData: BodyLocation(
        bodyPart: 'arm',
        x: 0.5,
        y: 0.3,
      ),
      riskAssessment: RiskAssessment(
        riskLevel: riskLevel ?? 'low',
        recommendation: riskLevel == 'high' ? 'see-dermatologist' : 'monitor',
        confidence: 0.85,
        features: ['asymmetry', 'irregular-border'],
      ),
    );
  }

  /// Generate mock ROM record
  static ROMRecord generateROMRecord({
    String? patientId,
    String? exerciseId,
    double? maxAngle,
  }) {
    final now = DateTime.now();
    final angleData = <AngleMeasurement>[];
    
    for (int i = 0; i < 10; i++) {
      angleData.add(AngleMeasurement(
        timestamp: now.subtract(Duration(seconds: 10 - i)),
        angle: (maxAngle ?? 85.0) * (i / 10.0),
        jointType: 'shoulder',
      ));
    }
    
    return ROMRecord(
      id: 'rom-${DateTime.now().millisecondsSinceEpoch}',
      patientId: patientId ?? 'patient-123',
      exerciseId: exerciseId ?? 'shoulder-abduction',
      createdAt: now,
      updatedAt: now,
      angleData: angleData,
      maxAngle: maxAngle ?? 85.0,
      minAngle: 0.0,
      durationSeconds: 120,
    );
  }

  /// Generate list of mock ROM records for chart
  static List<ROMRecord> generateROMRecordsForChart({
    String? patientId,
    String? exerciseId,
    int days = 7,
  }) {
    final records = <ROMRecord>[];
    final now = DateTime.now();
    
    for (int i = 0; i < days; i++) {
      final date = now.subtract(Duration(days: days - i - 1));
      final baseAngle = 60.0 + (i * 3.0);
      final variance = (i % 2 == 0 ? 2.0 : -1.5);
      
      records.add(ROMRecord(
        id: 'rom-$i',
        patientId: patientId ?? 'patient-123',
        exerciseId: exerciseId ?? 'shoulder-abduction',
        createdAt: date,
        updatedAt: date,
        angleData: [
          AngleMeasurement(
            timestamp: date,
            angle: baseAngle + variance,
            jointType: 'shoulder',
          ),
        ],
        maxAngle: baseAngle + variance,
        minAngle: 0.0,
        durationSeconds: 120,
      ));
    }
    
    return records;
  }

  /// Generate mock user data
  static Map<String, dynamic> generateUserData() {
    return {
      'id': 'user-123',
      'email': 'patient@example.com',
      'firstName': 'John',
      'lastName': 'Doe',
      'dateOfBirth': '1990-01-01',
      'phone': '+1234567890',
    };
  }
}

