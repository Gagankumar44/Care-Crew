import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Secure Storage for authentication tokens and sensitive data
class SecureStorage {
  static final SecureStorage _instance = SecureStorage._internal();
  factory SecureStorage() => _instance;
  SecureStorage._internal();

  final _storage = const FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );

  /// Store JWT token
  Future<void> storeToken(String token) async {
    await _storage.write(key: 'jwt_token', value: token);
  }

  /// Get JWT token
  Future<String?> getToken() async {
    return await _storage.read(key: 'jwt_token');
  }

  /// Delete JWT token (logout)
  Future<void> deleteToken() async {
    await _storage.delete(key: 'jwt_token');
  }

  /// Store refresh token
  Future<void> storeRefreshToken(String refreshToken) async {
    await _storage.write(key: 'refresh_token', value: refreshToken);
  }

  /// Get refresh token
  Future<String?> getRefreshToken() async {
    return await _storage.read(key: 'refresh_token');
  }

  /// Store user ID
  Future<void> storeUserId(String userId) async {
    await _storage.write(key: 'user_id', value: userId);
  }

  /// Get user ID
  Future<String?> getUserId() async {
    return await _storage.read(key: 'user_id');
  }

  /// Store patient ID
  Future<void> storePatientId(String patientId) async {
    await _storage.write(key: 'patient_id', value: patientId);
  }

  /// Get patient ID
  Future<String?> getPatientId() async {
    return await _storage.read(key: 'patient_id');
  }

  /// Clear all stored data (logout)
  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}

