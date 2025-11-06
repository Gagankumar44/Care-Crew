import 'package:health/health.dart';
import '../storage/secure_storage.dart';
import '../services/api_service.dart';

/// HealthKit/Health Connect Integration Service
class HealthDataService {
  final ApiService _apiService = ApiService();
  Health? _health;

  /// Initialize Health service
  Future<void> initialize() async {
    try {
      _health = Health();
      
      // Request permissions
      final types = [
        HealthDataType.HEART_RATE,
        HealthDataType.STEPS,
        HealthDataType.SLEEP_IN_BED,
        HealthDataType.WEIGHT,
        HealthDataType.BLOOD_PRESSURE_SYSTOLIC,
        HealthDataType.BLOOD_PRESSURE_DIASTOLIC,
      ];

      final requested = await _health!.requestAuthorization(types);
      
      if (!requested) {
        throw Exception('Health data permissions denied');
      }
    } catch (e) {
      // Health service not available on this device
      _health = null;
    }
  }

  /// Fetch health data from HealthKit/Health Connect
  Future<void> syncHealthData() async {
    if (_health == null) {
      await initialize();
    }

    if (_health == null) {
      return; // Health service not available
    }

    try {
      final patientId = await SecureStorage().getPatientId();
      if (patientId == null) return;

      final now = DateTime.now();
      final startDate = now.subtract(const Duration(days: 7));

      // Fetch heart rate
      await _fetchAndSyncDataType(
        HealthDataType.HEART_RATE,
        patientId,
        startDate,
        now,
        'bpm',
      );

      // Fetch steps
      await _fetchAndSyncDataType(
        HealthDataType.STEPS,
        patientId,
        startDate,
        now,
        'count',
      );

      // Fetch sleep
      await _fetchAndSyncDataType(
        HealthDataType.SLEEP_IN_BED,
        patientId,
        startDate,
        now,
        'minutes',
      );

      // Fetch weight
      await _fetchAndSyncDataType(
        HealthDataType.WEIGHT,
        patientId,
        startDate,
        now,
        'kg',
      );
    } catch (e) {
      // Handle error silently or log
      print('Error syncing health data: $e');
    }
  }

  /// Fetch and sync a specific data type
  Future<void> _fetchAndSyncDataType(
    HealthDataType dataType,
    String patientId,
    DateTime startDate,
    DateTime endDate,
    String unit,
  ) async {
    try {
      final healthData = await _health!.getHealthDataFromTypes(
        [dataType],
        startDate,
        endDate,
      );

      for (final data in healthData) {
        await _apiService.ingestHealthData(
          patientId: patientId,
          source: _getSource(),
          dataType: _mapHealthDataType(dataType),
          value: data.value.toDouble(),
          unit: unit,
          timestamp: data.dateFrom,
        );
      }
    } catch (e) {
      // Skip this data type if error occurs
      print('Error fetching $dataType: $e');
    }
  }

  /// Get platform-specific source name
  String _getSource() {
    // TODO: Detect platform (iOS/Android)
    return 'healthkit'; // or 'health_connect' for Android
  }

  /// Map HealthDataType to our data type string
  String _mapHealthDataType(HealthDataType dataType) {
    switch (dataType) {
      case HealthDataType.HEART_RATE:
        return 'heart_rate';
      case HealthDataType.STEPS:
        return 'steps';
      case HealthDataType.SLEEP_IN_BED:
        return 'sleep_duration';
      case HealthDataType.WEIGHT:
        return 'weight';
      case HealthDataType.BLOOD_PRESSURE_SYSTOLIC:
        return 'blood_pressure_systolic';
      case HealthDataType.BLOOD_PRESSURE_DIASTOLIC:
        return 'blood_pressure_diastolic';
      default:
        return 'unknown';
    }
  }

  /// Check if health service is available
  bool isAvailable() {
    return _health != null;
  }
}

