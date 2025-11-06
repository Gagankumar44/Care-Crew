import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/services/api_service.dart';
import '../../core/storage/secure_storage.dart';

/// Authentication State Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

class AuthState {
  final bool isAuthenticated;
  final String? userId;
  final String? email;
  final bool isLoading;

  AuthState({
    this.isAuthenticated = false,
    this.userId,
    this.email,
    this.isLoading = false,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    String? userId,
    String? email,
    bool? isLoading,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      userId: userId ?? this.userId,
      email: email ?? this.email,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiService _apiService = ApiService();
  final SecureStorage _secureStorage = SecureStorage();

  AuthNotifier() : super(AuthState()) {
    _checkAuthStatus();
  }

  /// Check if user is already authenticated
  Future<void> _checkAuthStatus() async {
    final token = await _secureStorage.getToken();
    final userId = await _secureStorage.getUserId();
    final email = await _secureStorage.getUserId(); // TODO: Store email separately

    if (token != null && userId != null) {
      state = state.copyWith(
        isAuthenticated: true,
        userId: userId,
        email: email,
      );
    }
  }

  /// Register new user
  Future<void> register({
    required String email,
    required String password,
    Map<String, dynamic>? userData,
  }) async {
    state = state.copyWith(isLoading: true);

    try {
      final response = await _apiService.post('/api/v1/auth/register', data: {
        'email': email,
        'password': password,
        'userData': userData ?? {},
      });

      // After registration, automatically login
      await login(email: email, password: password);
    } catch (e) {
      state = state.copyWith(isLoading: false);
      rethrow;
    }
  }

  /// Login user
  Future<void> login({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true);

    try {
      final response = await _apiService.post('/api/v1/auth/login', data: {
        'email': email,
        'password': password,
      });

      // Store tokens securely
      await _secureStorage.storeToken(response['token'] as String);
      await _secureStorage.storeRefreshToken(response['refreshToken'] as String);
      await _secureStorage.storeUserId(response['user']['id'] as String);

      state = state.copyWith(
        isAuthenticated: true,
        userId: response['user']['id'] as String,
        email: email,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false);
      rethrow;
    }
  }

  /// Logout user
  Future<void> logout() async {
    state = state.copyWith(isLoading: true);

    try {
      // TODO: Call logout API
      await _secureStorage.clearAll();

      state = AuthState(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false);
      rethrow;
    }
  }

  /// Refresh access token
  Future<void> refreshToken() async {
    try {
      final refreshToken = await _secureStorage.getRefreshToken();
      if (refreshToken == null) {
        await logout();
        return;
      }

      // TODO: Call refresh token API
      // For now, just verify current token is still valid
      final token = await _secureStorage.getToken();
      if (token == null) {
        await logout();
      }
    } catch (e) {
      await logout();
    }
  }
}

