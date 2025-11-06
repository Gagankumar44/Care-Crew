import { SpeechClient } from '@google-cloud/speech';
import { logger } from '../utils/logger.js';

/**
 * Speech-to-Text Service
 * Uses Google Cloud Speech-to-Text API
 */
export class SpeechToTextService {
  static client = null;

  static initialize() {
    if (!this.client) {
      try {
        this.client = new SpeechClient({
          keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
          projectId: process.env.GCP_PROJECT_ID,
        });
      } catch (error) {
        logger.warn('Google Cloud Speech client not initialized. Using fallback.', { error: error.message });
      }
    }
    return this.client;
  }

  /**
   * Transcribe audio buffer to text
   */
  static async transcribe(audioBuffer, mimeType) {
    try {
      const client = this.initialize();
      
      if (!client) {
        // Fallback: return mock transcript for development
        logger.warn('Speech-to-text fallback: returning mock transcript');
        return 'Mock transcript: Patient reported headache and fatigue for the past three days.';
      }

      const encoding = this._getEncoding(mimeType);
      const sampleRateHertz = 16000; // Standard sample rate
      const languageCode = 'en-US';

      const config = {
        encoding,
        sampleRateHertz,
        languageCode,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: true,
      };

      const audio = {
        content: audioBuffer.toString('base64'),
      };

      const request = {
        config,
        audio,
      };

      const [response] = await client.recognize(request);
      
      if (!response.results || response.results.length === 0) {
        throw new Error('No transcription results');
      }

      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      return transcription;
    } catch (error) {
      logger.error('Speech-to-text error', { error: error.message });
      // Fallback for development
      return 'Error transcribing audio. Please try again or type your symptoms manually.';
    }
  }

  /**
   * Transcribe emergency audio (prioritized)
   */
  static async transcribeEmergency(audioBuffer) {
    // Same as regular transcription but could use different model/priority
    return this.transcribe(audioBuffer, 'audio/wav');
  }

  /**
   * Get encoding from MIME type
   */
  static _getEncoding(mimeType) {
    const encodings = {
      'audio/wav': 'LINEAR16',
      'audio/mp3': 'MP3',
      'audio/mpeg': 'MP3',
      'audio/webm': 'WEBM_OPUS',
      'audio/ogg': 'OGG_OPUS',
    };
    return encodings[mimeType] || 'LINEAR16';
  }
}

