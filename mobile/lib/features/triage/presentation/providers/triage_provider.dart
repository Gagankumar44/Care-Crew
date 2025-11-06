import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/triage_session.dart';
import '../services/api_service.dart';

/// Provider for API Service
final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

/// Provider for Triage Session State
final triageSessionProvider = StateNotifierProvider<TriageSessionNotifier, TriageSession?>((ref) {
  return TriageSessionNotifier(ref.read(apiServiceProvider));
});

class TriageSessionNotifier extends StateNotifier<TriageSession?> {
  final ApiService _apiService;

  TriageSessionNotifier(this._apiService) : super(null);

  Future<void> createSession(String patientId) async {
    final now = DateTime.now();
    final session = TriageSession(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      patientId: patientId,
      createdAt: now,
      updatedAt: now,
      messages: [],
    );
    state = session;
  }

  Future<void> sendMessage(String message) async {
    if (state == null) return;

    try {
      // Add user message locally
      final userMessage = TriageMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        role: 'user',
        content: message,
        timestamp: DateTime.now(),
      );

      final updatedMessages = [...state!.messages, userMessage];
      state = state!.copyWith(
        messages: updatedMessages,
        updatedAt: DateTime.now(),
      );

      // Send to API
      final response = await _apiService.sendTriageMessage(
        sessionId: state!.id,
        message: message,
        patientId: state!.patientId,
        context: state!.messages.map((m) => m.toJson()).toList(),
      );

      // Add assistant response
      final assistantMessage = TriageMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        role: 'assistant',
        content: response['response'] as String,
        timestamp: DateTime.now(),
      );

      final triageResult = response['triageResult'] != null
          ? TriageResult.fromJson(response['triageResult'] as Map<String, dynamic>)
          : null;

      state = state!.copyWith(
        messages: [...updatedMessages, assistantMessage],
        triageResult: triageResult?.toJson().toString(),
        updatedAt: DateTime.now(),
      );
    } catch (e) {
      // Handle error - show error message to user
      rethrow;
    }
  }
}

// Extension to add copyWith method
extension TriageSessionExtension on TriageSession {
  TriageSession copyWith({
    String? id,
    String? patientId,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? triageResult,
    List<TriageMessage>? messages,
    SyncStatus? syncStatus,
    DateTime? syncTimestamp,
  }) {
    return TriageSession(
      id: id ?? this.id,
      patientId: patientId ?? this.patientId,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      triageResult: triageResult ?? this.triageResult,
      messages: messages ?? this.messages,
      syncStatus: syncStatus ?? this.syncStatus,
      syncTimestamp: syncTimestamp ?? this.syncTimestamp,
    );
  }
}

