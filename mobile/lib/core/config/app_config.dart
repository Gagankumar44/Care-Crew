class AppConfig {
  // Environment
  static const String environment = String.fromEnvironment(
    'ENVIRONMENT',
    defaultValue: 'development',
  );
  
  // API Configuration
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api-dev.mediar.app',
  );
  
  // WebRTC Configuration
  static const String webrtcSignalingUrl = String.fromEnvironment(
    'WEBRTC_SIGNALING_URL',
    defaultValue: 'wss://signaling-dev.mediar.app',
  );
  
  // GCP Configuration
  static const String gcpProjectId = String.fromEnvironment(
    'GCP_PROJECT_ID',
    defaultValue: 'mediar-dev',
  );
  
  // Vertex AI Configuration (Med-Gemini)
  static const String vertexAiLocation = 'us-central1';
  static const String medGeminiModel = 'medlm-medium';
  
  // Sentry Configuration
  static const String sentryDsn = String.fromEnvironment(
    'SENTRY_DSN',
    defaultValue: '',
  );
  
  // Feature Flags
  static const bool enableAR = true;
  static const bool enableAI = true;
  static const bool enableGamification = true;
  static const bool enableRPM = true;
  
  // Compliance
  static const bool hipaaCompliant = true;
  static const bool gdprCompliant = true;
  
  // AR Configuration
  static const double arMinTrackingDistance = 0.2; // meters
  static const double arMaxTrackingDistance = 5.0; // meters
  static const double arMinLightLevel = 50.0; // lux
  
  // MediaPipe Configuration
  static const int mediaPipeFps = 30;
  static const bool mediaPipeSmoothLandmarks = true;
  
  // Sync Configuration
  static const int syncBatchSize = 100;
  static const Duration syncRetryDelay = Duration(minutes: 5);
}

