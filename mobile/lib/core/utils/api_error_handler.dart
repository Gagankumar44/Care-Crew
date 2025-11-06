import 'package:dio/dio.dart';
import '../config/app_config.dart';

/// Custom Exception for API Errors
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final String? code;

  ApiException({
    required this.message,
    this.statusCode,
    this.code,
  });

  @override
  String toString() => message;
}

/// API Error Handler Utility
class ApiErrorHandler {
  /// Handle DioException and convert to ApiException
  static ApiException handleError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return ApiException(
          message: 'Connection timeout. Please check your internet connection.',
          statusCode: 408,
        );

      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final data = error.response?.data;

        if (data is Map<String, dynamic> && data.containsKey('error')) {
          final errorData = data['error'] as Map<String, dynamic>;
          return ApiException(
            message: errorData['message'] as String? ?? 'An error occurred',
            statusCode: statusCode,
            code: errorData['code'] as String?,
          );
        }

        return ApiException(
          message: _getErrorMessage(statusCode),
          statusCode: statusCode,
        );

      case DioExceptionType.cancel:
        return ApiException(
          message: 'Request cancelled',
          statusCode: null,
        );

      case DioExceptionType.unknown:
        return ApiException(
          message: 'Network error. Please check your connection.',
          statusCode: null,
        );

      default:
        return ApiException(
          message: 'An unexpected error occurred',
          statusCode: null,
        );
    }
  }

  /// Get user-friendly error message based on status code
  static String _getErrorMessage(int? statusCode) {
    switch (statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred. The resource may already exist.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
}

/// API Response Wrapper
class ApiResponse<T> {
  final T? data;
  final ApiException? error;
  final bool success;

  ApiResponse({
    this.data,
    this.error,
    required this.success,
  });

  factory ApiResponse.success(T data) {
    return ApiResponse(
      data: data,
      success: true,
    );
  }

  factory ApiResponse.failure(ApiException error) {
    return ApiResponse(
      error: error,
      success: false,
    );
  }
}

/// Retry Configuration
class RetryConfig {
  final int maxRetries;
  final Duration delay;
  final bool Function(DioException)? retryCondition;

  const RetryConfig({
    this.maxRetries = 3,
    this.delay = const Duration(seconds: 1),
    this.retryCondition,
  });

  bool shouldRetry(DioException error) {
    if (retryCondition != null) {
      return retryCondition!(error);
    }

    // Default: retry on network errors and 5xx errors
    return error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.unknown ||
        (error.response?.statusCode != null &&
            error.response!.statusCode! >= 500);
  }
}

/// Retry Interceptor
class RetryInterceptor extends Interceptor {
  final RetryConfig config;

  RetryInterceptor({RetryConfig? config})
      : config = config ?? const RetryConfig();

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (!config.shouldRetry(err)) {
      return handler.next(err);
    }

    int retryCount = 0;
    while (retryCount < config.maxRetries) {
      await Future.delayed(config.delay);
      retryCount++;

      try {
        final response = await err.requestOptions.dio.request(
          err.requestOptions.path,
          data: err.requestOptions.data,
          queryParameters: err.requestOptions.queryParameters,
          options: Options(
            method: err.requestOptions.method,
            headers: err.requestOptions.headers,
          ),
        );

        return handler.resolve(response);
      } catch (e) {
        if (e is DioException && retryCount < config.maxRetries) {
          continue;
        }
        return handler.next(err);
      }
    }

    return handler.next(err);
  }
}

