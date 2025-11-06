/// AR Service - Abstract interface for ARKit/ARCore
/// Provides platform-agnostic AR functionality

import 'dart:async';
import 'dart:io' show Platform;
import 'package:camera/camera.dart';
import 'arkit_service.dart';
import 'arcore_service.dart';

/// AR Session State
enum ARSessionState {
  initialized,
  running,
  paused,
  stopped,
  error,
}

/// AR Tracking Quality
enum ARTrackingQuality {
  notAvailable,
  limited,
  normal,
}

/// AR Plane Detection Result
class ARPlane {
  final String id;
  final double width;
  final double height;
  final ARPoint center;
  final ARRotation rotation;

  ARPlane({
    required this.id,
    required this.width,
    required this.height,
    required this.center,
    required this.rotation,
  });
}

/// AR Point (3D coordinate)
class ARPoint {
  final double x;
  final double y;
  final double z;

  ARPoint(this.x, this.y, this.z);

  double distanceTo(ARPoint other) {
    return (x - other.x) * (x - other.x) +
           (y - other.y) * (y - other.y) +
           (z - other.z) * (z - other.z);
  }
}

/// AR Rotation
class ARRotation {
  final double x;
  final double y;
  final double z;
  final double w;

  ARRotation(this.x, this.y, this.z, this.w);
}

/// AR Light Estimation
class ARLightEstimate {
  final double ambientIntensity; // In lumens
  final double? temperature; // Color temperature in Kelvin

  ARLightEstimate({
    required this.ambientIntensity,
    this.temperature,
  });

  bool get isWellLit => ambientIntensity >= 50.0; // 50 lux minimum
}

/// AR Service Interface
abstract class ARService {
  /// Initialize AR session
  Future<void> initialize();

  /// Check if AR is available on device
  Future<bool> isARAvailable();

  /// Start AR session with camera
  Future<void> startSession(CameraController cameraController);

  /// Pause AR session
  Future<void> pauseSession();

  /// Resume AR session
  Future<void> resumeSession();

  /// Stop AR session
  Future<void> stopSession();

  /// Get current session state
  ARSessionState get state;

  /// Get tracking quality
  Future<ARTrackingQuality> getTrackingQuality();

  /// Detect planes in AR scene
  Future<List<ARPlane>> detectPlanes();

  /// Get light estimation
  Future<ARLightEstimate> getLightEstimate();

  /// Hit test (raycast) in AR scene
  Future<List<ARPoint>> hitTest(double screenX, double screenY);

  /// Add anchor to AR scene
  Future<String> addAnchor(ARPoint position, ARRotation rotation);

  /// Remove anchor
  Future<void> removeAnchor(String anchorId);

  /// Stream of AR session updates
  Stream<ARSessionState> get sessionStateStream;

  /// Stream of detected planes
  Stream<List<ARPlane>> get planesStream;

  /// Stream of light estimation updates
  Stream<ARLightEstimate> get lightEstimateStream;
}

class ARServiceFactory {
  static ARService create() {
    if (Platform.isIOS) {
      return ARKitService();
    } else if (Platform.isAndroid) {
      return ARCoreService();
    } else {
      // Fallback to stub for testing
      return ARServiceStub();
    }
  }
}

/// Stub implementation (for development/testing)
class ARServiceStub implements ARService {
  ARSessionState _state = ARSessionState.initialized;
  final _stateController = StreamController<ARSessionState>.broadcast();
  final _planesController = StreamController<List<ARPlane>>.broadcast();
  final _lightEstimateController = StreamController<ARLightEstimate>.broadcast();

  @override
  Future<void> initialize() async {
    _state = ARSessionState.initialized;
    _stateController.add(_state);
  }

  @override
  Future<bool> isARAvailable() async => false; // Stub

  @override
  Future<void> startSession(CameraController cameraController) async {
    _state = ARSessionState.running;
    _stateController.add(_state);
  }

  @override
  Future<void> pauseSession() async {
    _state = ARSessionState.paused;
    _stateController.add(_state);
  }

  @override
  Future<void> resumeSession() async {
    _state = ARSessionState.running;
    _stateController.add(_state);
  }

  @override
  Future<void> stopSession() async {
    _state = ARSessionState.stopped;
    _stateController.add(_state);
  }

  @override
  ARSessionState get state => _state;

  @override
  Future<ARTrackingQuality> getTrackingQuality() async =>
      ARTrackingQuality.normal;

  @override
  Future<List<ARPlane>> detectPlanes() async => [];

  @override
  Future<ARLightEstimate> getLightEstimate() async => ARLightEstimate(
        ambientIntensity: 100.0,
        temperature: 5500.0,
      );

  @override
  Future<List<ARPoint>> hitTest(double screenX, double screenY) async => [];

  @override
  Future<String> addAnchor(ARPoint position, ARRotation rotation) async =>
      'anchor-${DateTime.now().millisecondsSinceEpoch}';

  @override
  Future<void> removeAnchor(String anchorId) async {}

  @override
  Stream<ARSessionState> get sessionStateStream => _stateController.stream;

  @override
  Stream<List<ARPlane>> get planesStream => _planesController.stream;

  @override
  Stream<ARLightEstimate> get lightEstimateStream =>
      _lightEstimateController.stream;

  void dispose() {
    _stateController.close();
    _planesController.close();
    _lightEstimateController.close();
  }
}

