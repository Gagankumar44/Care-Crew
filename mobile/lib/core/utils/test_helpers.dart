/// Test Utilities for Development

import 'package:flutter_test/flutter_test.dart';
import '../models/triage_session.dart';
import '../models/skin_check_record.dart';
import '../models/rom_record.dart';
import 'mock_data_generator.dart';

class TestHelpers {
  /// Create a test widget with providers
  static Widget createTestWidget(Widget child) {
    // TODO: Wrap with ProviderScope and other providers
    return child;
  }

  /// Assert ROM record is valid
  static void assertROMRecordValid(ROMRecord record) {
    expect(record.id, isNotEmpty);
    expect(record.patientId, isNotEmpty);
    expect(record.exerciseId, isNotEmpty);
    expect(record.angleData, isNotEmpty);
    expect(record.maxAngle, greaterThanOrEqualTo(0));
    expect(record.minAngle, lessThanOrEqualTo(record.maxAngle ?? 0));
  }

  /// Assert skin check record is valid
  static void assertSkinCheckValid(SkinCheckRecord record) {
    expect(record.id, isNotEmpty);
    expect(record.patientId, isNotEmpty);
    expect(record.imagePath, isNotEmpty);
    expect(record.createdAt, isNotNull);
  }

  /// Assert triage session is valid
  static void assertTriageSessionValid(TriageSession session) {
    expect(session.id, isNotEmpty);
    expect(session.patientId, isNotEmpty);
    expect(session.messages, isNotEmpty);
    expect(session.createdAt, isNotNull);
  }

  /// Wait for async operations
  static Future<void> waitForAsync() async {
    await Future.delayed(const Duration(milliseconds: 100));
  }
}

