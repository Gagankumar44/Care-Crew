import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:camera/camera.dart';
import '../../../core/services/ar_service.dart';
import '../../../core/services/mediapipe_pose_service.dart';
import '../../../core/models/rom_record.dart';
import '../../../core/models/rom_record.dart' show AngleMeasurement;
import '../../../core/repositories/data_repositories.dart';

/// ROM Analysis Provider
final romAnalysisProvider = StateNotifierProvider<ROMAnalysisNotifier, ROMAnalysisState>((ref) {
  return ROMAnalysisNotifier(ref.read(romRepositoryProvider));
});

class ROMAnalysisState {
  final bool isTracking;
  final PoseDetection? currentPose;
  final double? currentAngle;
  final double? maxAngle;
  final double? minAngle;
  final List<AngleMeasurement> angleHistory;
  final ARTrackingQuality trackingQuality;
  final ARLightEstimate? lightEstimate;

  ROMAnalysisState({
    this.isTracking = false,
    this.currentPose,
    this.currentAngle,
    this.maxAngle,
    this.minAngle,
    required this.angleHistory,
    this.trackingQuality = ARTrackingQuality.notAvailable,
    this.lightEstimate,
  });

  ROMAnalysisState copyWith({
    bool? isTracking,
    PoseDetection? currentPose,
    double? currentAngle,
    double? maxAngle,
    double? minAngle,
    List<AngleMeasurement>? angleHistory,
    ARTrackingQuality? trackingQuality,
    ARLightEstimate? lightEstimate,
  }) {
    return ROMAnalysisState(
      isTracking: isTracking ?? this.isTracking,
      currentPose: currentPose ?? this.currentPose,
      currentAngle: currentAngle ?? this.currentAngle,
      maxAngle: maxAngle ?? this.maxAngle,
      minAngle: minAngle ?? this.minAngle,
      angleHistory: angleHistory ?? this.angleHistory,
      trackingQuality: trackingQuality ?? this.trackingQuality,
      lightEstimate: lightEstimate ?? this.lightEstimate,
    );
  }
}

class ROMAnalysisNotifier extends StateNotifier<ROMAnalysisState> {
  final ROMRepository _repository;
  final ARService _arService = ARServiceFactory.create();
  final MediaPipePoseService _poseService = MediaPipePoseServiceFactory.create();
  CameraController? _cameraController;
  String? _currentExerciseId;

  ROMAnalysisNotifier(this._repository) : super(ROMAnalysisState(angleHistory: [])) {
    _initialize();
  }

  Future<void> _initialize() async {
    await _arService.initialize();
    await _poseService.initialize();
  }

  /// Start ROM tracking for an exercise
  Future<void> startTracking(String exerciseId) async {
    try {
      // Initialize camera
      final cameras = await availableCameras();
      _cameraController = CameraController(
        cameras.first,
        ResolutionPreset.high,
        enableAudio: false,
      );
      await _cameraController!.initialize();

      // Start AR session
      await _arService.startSession(_cameraController!);

      // Start pose detection
      await _poseService.startDetection(_cameraController!);

      // Listen to pose updates
      _poseService.poseStream.listen((pose) {
        _processPoseDetection(pose, exerciseId);
      });

      // Listen to AR updates
      _arService.lightEstimateStream.listen((lightEstimate) {
        state = state.copyWith(lightEstimate: lightEstimate);
      });

      _arService.sessionStateStream.listen((sessionState) async {
        if (sessionState == ARSessionState.error) {
          await stopTracking();
        }
      });

      _currentExerciseId = exerciseId;
      state = state.copyWith(
        isTracking: true,
        angleHistory: [],
        maxAngle: null,
        minAngle: null,
      );
    } catch (e) {
      state = state.copyWith(isTracking: false);
      rethrow;
    }
  }

  /// Process pose detection and calculate angles
  void _processPoseDetection(PoseDetection pose, String exerciseId) {
    double? angle;

    // Calculate angle based on exercise type
    switch (exerciseId) {
      case 'shoulder-abduction':
        angle = pose.getShoulderAbductionAngle();
        break;
      case 'knee-flexion':
        angle = pose.getKneeFlexionAngle();
        break;
      default:
        // Generic angle calculation
        angle = pose.getShoulderAbductionAngle();
    }

    if (angle == null) return;

    // Add to history
    final angleMeasurement = AngleMeasurement(
      timestamp: DateTime.now(),
      angle: angle,
      jointType: _getJointType(exerciseId),
    );

    final updatedHistory = [...state.angleHistory, angleMeasurement];

    // Update max/min angles
    final currentMax = state.maxAngle;
    final currentMin = state.minAngle;

    final newMax = currentMax == null || angle > currentMax ? angle : currentMax;
    final newMin = currentMin == null || angle < currentMin ? angle : currentMin;

    state = state.copyWith(
      currentPose: pose,
      currentAngle: angle,
      maxAngle: newMax,
      minAngle: newMin,
      angleHistory: updatedHistory,
    );
  }

  String _getJointType(String exerciseId) {
    if (exerciseId.contains('shoulder')) return 'shoulder';
    if (exerciseId.contains('knee')) return 'knee';
    if (exerciseId.contains('hip')) return 'hip';
    return 'unknown';
  }

  /// Stop tracking and save ROM record
  Future<void> stopTracking() async {
    if (!state.isTracking) return;

    try {
      // Stop pose detection
      await _poseService.stopDetection();

      // Stop AR session
      await _arService.stopSession();

      // Dispose camera
      await _cameraController?.dispose();
      _cameraController = null;

      // Save ROM record if we have data
      if (state.angleHistory.isNotEmpty && _currentExerciseId != null) {
        await _saveROMRecord();
      }

      state = state.copyWith(isTracking: false);
    } catch (e) {
      // Handle error
      state = state.copyWith(isTracking: false);
    }
  }

  /// Save ROM record to local database
  Future<void> _saveROMRecord() async {
    if (_currentExerciseId == null || state.angleHistory.isEmpty) return;

    final now = DateTime.now();
    final duration = state.angleHistory.last.timestamp
        .difference(state.angleHistory.first.timestamp)
        .inSeconds;

    final romRecord = ROMRecord(
      id: 'rom-${now.millisecondsSinceEpoch}',
      patientId: 'patient-123', // TODO: Get from auth
      exerciseId: _currentExerciseId!,
      createdAt: now,
      updatedAt: now,
      angleData: state.angleHistory,
      maxAngle: state.maxAngle,
      minAngle: state.minAngle,
      durationSeconds: duration,
    );

    await _repository.saveLocal(romRecord);
  }

  @override
  void dispose() {
    _arService.stopSession();
    _poseService.dispose();
    _cameraController?.dispose();
    super.dispose();
  }
}

