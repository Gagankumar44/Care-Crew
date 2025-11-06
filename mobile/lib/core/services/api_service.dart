import 'package:dio/dio.dart';
import '../config/app_config.dart';
import '../storage/secure_storage.dart';
import '../utils/api_error_handler.dart';

/// API Service for communicating with backend
class ApiService {
  late final Dio _dio;

  ApiService() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
        },
      ),
    );

    // Add interceptors for auth, retry, and error handling
    _dio.interceptors.add(_AuthInterceptor());
    _dio.interceptors.add(RetryInterceptor());
    _dio.interceptors.add(_ErrorInterceptor());
  }

  // AI Triage Endpoints
  Future<Map<String, dynamic>> sendTriageMessage({
    required String sessionId,
    required String message,
    required String patientId,
    List<Map<String, dynamic>>? context,
  }) async {
    final response = await _dio.post(
      '/api/v1/triage/chat',
      data: {
        'sessionId': sessionId,
        'message': message,
        'patientId': patientId,
        'context': context ?? [],
      },
    );
    return response.data;
  }

  Future<Map<String, dynamic>> getTriageSession(String sessionId) async {
    final response = await _dio.get('/api/v1/triage/session/$sessionId');
    return response.data;
  }

  // Patient Data Endpoints
  Future<Map<String, dynamic>> getPatientProfile(String patientId) async {
    final response = await _dio.get('/api/v1/patients/$patientId');
    return response.data;
  }

  Future<Map<String, dynamic>> createSkinCheck({
    required String patientId,
    required String imageUrl,
    Map<String, dynamic>? locationData,
  }) async {
    final response = await _dio.post(
      '/api/v1/patients/$patientId/skin-checks',
      data: {
        'imageUrl': imageUrl,
        'locationData': locationData,
      },
    );
    return response.data;
  }

  Future<Map<String, dynamic>> getSkinChecks(String patientId) async {
    final response = await _dio.get('/api/v1/patients/$patientId/skin-checks');
    return response.data;
  }

  Future<Map<String, dynamic>> createROMRecord({
    required String patientId,
    required String exerciseId,
    required List<Map<String, dynamic>> angleData,
    double? maxAngle,
    double? minAngle,
    int? durationSeconds,
  }) async {
    final response = await _dio.post(
      '/api/v1/patients/$patientId/rom-records',
      data: {
        'exerciseId': exerciseId,
        'angleData': angleData,
        'maxAngle': maxAngle,
        'minAngle': minAngle,
        'durationSeconds': durationSeconds,
      },
    );
    return response.data;
  }

  Future<Map<String, dynamic>> getROMRecords(
    String patientId, {
    String? exerciseId,
    DateTime? startDate,
    DateTime? endDate,
    int limit = 50,
  }) async {
    final queryParams = <String, dynamic>{
      'limit': limit,
    };
    if (exerciseId != null) queryParams['exerciseId'] = exerciseId;
    if (startDate != null) queryParams['startDate'] = startDate.toIso8601String();
    if (endDate != null) queryParams['endDate'] = endDate.toIso8601String();

    final response = await _dio.get(
      '/api/v1/patients/$patientId/rom-records',
      queryParameters: queryParams,
    );
    return response.data;
  }

  // Health Data Endpoints
  Future<Map<String, dynamic>> ingestHealthData({
    required String patientId,
    required String source,
    required String dataType,
    required double value,
    String? unit,
    DateTime? timestamp,
  }) async {
    final response = await _dio.post(
      '/api/v1/health-data/ingest',
      data: {
        'patientId': patientId,
        'source': source,
        'dataType': dataType,
        'value': value,
        'unit': unit,
        'timestamp': timestamp?.toIso8601String(),
      },
    );
    return response.data;
  }

  Future<Map<String, dynamic>> getHealthData(
    String patientId, {
    DateTime? startDate,
    DateTime? endDate,
    String? dataType,
    String? source,
    int limit = 100,
  }) async {
    final queryParams = <String, dynamic>{
      'limit': limit,
    };
    if (startDate != null) queryParams['startDate'] = startDate.toIso8601String();
    if (endDate != null) queryParams['endDate'] = endDate.toIso8601String();
    if (dataType != null) queryParams['dataType'] = dataType;
    if (source != null) queryParams['source'] = source;

    final response = await _dio.get(
      '/api/v1/health-data/$patientId',
      queryParameters: queryParams,
    );
    return response.data;
  }

  Future<Map<String, dynamic>> getHealthDataSummary(
    String patientId, {
    DateTime? startDate,
    DateTime? endDate,
  }) async {
    final queryParams = <String, dynamic>{};
    if (startDate != null) queryParams['startDate'] = startDate.toIso8601String();
    if (endDate != null) queryParams['endDate'] = endDate.toIso8601String();

    final response = await _dio.get(
      '/api/v1/health-data/$patientId/summary',
      queryParameters: queryParams,
    );
    return response.data;
  }

  // Sync endpoints
  Future<Map<String, dynamic>> syncPendingRecords(List<Map<String, dynamic>> records) async {
    final response = await _dio.post(
      '/api/v1/sync',
      data: {
        'records': records,
      },
    );
    return response.data;
  }

  // Generic HTTP methods
  Future<Map<String, dynamic>> get(String path, {Map<String, dynamic>? queryParameters}) async {
    final response = await _dio.get(path, queryParameters: queryParameters);
    return response.data;
  }

  Future<Map<String, dynamic>> post(String path, {dynamic data}) async {
    final response = await _dio.post(path, data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> put(String path, {dynamic data}) async {
    final response = await _dio.put(path, data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> delete(String path) async {
    final response = await _dio.delete(path);
    return response.data;
  }
}

/// Auth Interceptor - Adds JWT token to requests
class _AuthInterceptor extends Interceptor {
  final SecureStorage _secureStorage = SecureStorage();

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _secureStorage.getToken();
    
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    
    handler.next(options);
  }
}

/// Error Interceptor - Handles API errors
class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Convert DioException to ApiException
    final apiException = ApiErrorHandler.handleError(err);
    
    // Handle specific error codes
    switch (err.response?.statusCode) {
      case 401:
        // Token expired, refresh or redirect to login
        // TODO: Implement token refresh logic
        break;
      case 403:
        // Forbidden - insufficient permissions
        break;
      case 429:
        // Rate limited
        break;
      case 500:
        // Server error - retry logic handled by RetryInterceptor
        break;
    }
    
    handler.next(err);
  }
}

