import 'package:flutter/services.dart';
import 'dart:io' show Platform;
import 'ar_service.dart';

/// ARCore Service Implementation (Android)
/// Uses platform channels to communicate with native ARCore

class ARCoreService implements ARService {
  static const MethodChannel _channel = MethodChannel('mediar/arcore');

  ARSessionState _state = ARSessionState.initialized;
  final _stateController = StreamController<ARSessionState>.broadcast();
  final _planesController = StreamController<List<ARPlane>>.broadcast();
  final _lightEstimateController = StreamController<ARLightEstimate>.broadcast();

  @override
  Future<void> initialize() async {
    try {
      await _channel.invokeMethod('initialize');
      _state = ARSessionState.initialized;
      _stateController.add(_state);
    } catch (e) {
      _state = ARSessionState.error;
      _stateController.add(_state);
      rethrow;
    }
  }

  @override
  Future<bool> isARAvailable() async {
    try {
      final result = await _channel.invokeMethod<bool>('isARAvailable');
      return result ?? false;
    } catch (e) {
      return false;
    }
  }

  @override
  Future<void> startSession(CameraController cameraController) async {
    try {
      await _channel.invokeMethod('startSession');
      _state = ARSessionState.running;
      _stateController.add(_state);
      _channel.setMethodCallHandler(_handleMethodCall);
    } catch (e) {
      _state = ARSessionState.error;
      _stateController.add(_state);
      rethrow;
    }
  }

  @override
  Future<void> pauseSession() async {
    await _channel.invokeMethod('pauseSession');
    _state = ARSessionState.paused;
    _stateController.add(_state);
  }

  @override
  Future<void> resumeSession() async {
    await _channel.invokeMethod('resumeSession');
    _state = ARSessionState.running;
    _stateController.add(_state);
  }

  @override
  Future<void> stopSession() async {
    await _channel.invokeMethod('stopSession');
    _state = ARSessionState.stopped;
    _stateController.add(_state);
  }

  @override
  ARSessionState get state => _state;

  @override
  Future<ARTrackingQuality> getTrackingQuality() async {
    try {
      final result = await _channel.invokeMethod<String>('getTrackingQuality');
      switch (result) {
        case 'normal':
          return ARTrackingQuality.normal;
        case 'limited':
          return ARTrackingQuality.limited;
        default:
          return ARTrackingQuality.notAvailable;
      }
    } catch (e) {
      return ARTrackingQuality.notAvailable;
    }
  }

  @override
  Future<List<ARPlane>> detectPlanes() async {
    try {
      final result = await _channel.invokeMethod<List>('detectPlanes');
      return (result ?? []).map((plane) => _parsePlane(plane)).toList();
    } catch (e) {
      return [];
    }
  }

  @override
  Future<ARLightEstimate> getLightEstimate() async {
    try {
      final result = await _channel.invokeMethod<Map>('getLightEstimate');
      return ARLightEstimate(
        ambientIntensity: (result?['ambientIntensity'] as num?)?.toDouble() ?? 0.0,
        temperature: (result?['temperature'] as num?)?.toDouble(),
      );
    } catch (e) {
      return ARLightEstimate(ambientIntensity: 0.0);
    }
  }

  @override
  Future<List<ARPoint>> hitTest(double screenX, double screenY) async {
    try {
      final result = await _channel.invokeMethod<List>('hitTest', {
        'x': screenX,
        'y': screenY,
      });
      return (result ?? []).map((point) => _parsePoint(point)).toList();
    } catch (e) {
      return [];
    }
  }

  @override
  Future<String> addAnchor(ARPoint position, ARRotation rotation) async {
    try {
      final result = await _channel.invokeMethod<String>('addAnchor', {
        'position': {'x': position.x, 'y': position.y, 'z': position.z},
        'rotation': {'x': rotation.x, 'y': rotation.y, 'z': rotation.z, 'w': rotation.w},
      });
      return result ?? '';
    } catch (e) {
      return '';
    }
  }

  @override
  Future<void> removeAnchor(String anchorId) async {
    await _channel.invokeMethod('removeAnchor', {'anchorId': anchorId});
  }

  @override
  Stream<ARSessionState> get sessionStateStream => _stateController.stream;

  @override
  Stream<List<ARPlane>> get planesStream => _planesController.stream;

  @override
  Stream<ARLightEstimate> get lightEstimateStream => _lightEstimateController.stream;

  Future<dynamic> _handleMethodCall(MethodCall call) async {
    switch (call.method) {
      case 'onPlaneDetected':
        final planes = (call.arguments as List).map((p) => _parsePlane(p)).toList();
        _planesController.add(planes);
        break;
      case 'onLightEstimateUpdated':
        final estimate = ARLightEstimate(
          ambientIntensity: (call.arguments['ambientIntensity'] as num).toDouble(),
          temperature: (call.arguments['temperature'] as num?)?.toDouble(),
        );
        _lightEstimateController.add(estimate);
        break;
    }
  }

  ARPlane _parsePlane(Map<dynamic, dynamic> data) {
    return ARPlane(
      id: data['id'] as String,
      width: (data['width'] as num).toDouble(),
      height: (data['height'] as num).toDouble(),
      center: _parsePoint(data['center'] as Map),
      rotation: _parseRotation(data['rotation'] as Map),
    );
  }

  ARPoint _parsePoint(Map<dynamic, dynamic> data) {
    return ARPoint(
      (data['x'] as num).toDouble(),
      (data['y'] as num).toDouble(),
      (data['z'] as num).toDouble(),
    );
  }

  ARRotation _parseRotation(Map<dynamic, dynamic> data) {
    return ARRotation(
      (data['x'] as num).toDouble(),
      (data['y'] as num).toDouble(),
      (data['z'] as num).toDouble(),
      (data['w'] as num).toDouble(),
    );
  }

  void dispose() {
    _stateController.close();
    _planesController.close();
    _lightEstimateController.close();
  }
}

