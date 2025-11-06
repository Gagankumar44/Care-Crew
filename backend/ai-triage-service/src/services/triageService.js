import { VertexAI } from '@google-cloud/aiplatform';
import { logger } from '../utils/logger.js';
import { encryptPHI, decryptPHI } from '../utils/encryption.js';

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = process.env.VERTEX_AI_LOCATION || 'us-central1';
const MODEL_NAME = process.env.MED_GEMINI_MODEL || 'medlm-medium';

// Initialize Vertex AI client
const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
});

/**
 * Call Med-Gemini model for AI triage
 * @param {string} message - Patient message
 * @param {Array} context - Previous conversation context
 * @returns {Promise<Object>} Triage response
 */
export async function callMedGemini(message, context = []) {
  try {
    // Encrypt PHI before sending to Vertex AI
    const encryptedMessage = encryptPHI(message);
    
    // Prepare conversation context
    const conversationHistory = context.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.role === 'user' ? encryptPHI(msg.message) : msg.response }],
    }));

    // Add current message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: encryptedMessage }],
    });

    // Call Vertex AI
    const model = vertexAI.preview.getGenerativeModel({
      model: MODEL_NAME,
    });

    const prompt = `You are a medical triage assistant. Your role is to:
1. Conduct empathetic patient intake
2. Perform comprehensive symptom assessment
3. Triage patients to appropriate care modules (skin-check, rom-analysis, or escalate to provider)
4. Provide clear, non-diagnostic guidance

Guidelines:
- Be empathetic and reassuring
- Ask clarifying questions
- Never provide a diagnosis
- For skin concerns, recommend "skin-check" module
- For joint/muscle pain, recommend "rom-analysis" module
- For urgent symptoms, escalate to provider

Patient message: ${encryptedMessage}

Previous context: ${JSON.stringify(conversationHistory)}

Respond in JSON format:
{
  "response": "Your empathetic response to the patient",
  "triageResult": {
    "recommendedModule": "skin-check" | "rom-analysis" | "provider" | "emergency",
    "urgency": "low" | "moderate" | "high" | "urgent",
    "confidence": 0.0-1.0,
    "reasoning": "Brief explanation"
  },
  "followUpQuestions": ["question1", "question2"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.candidates[0].content.parts[0].text;
    
    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Med-Gemini');
    }
    
    const triageResponse = JSON.parse(jsonMatch[0]);
    
    // Decrypt PHI in response
    triageResponse.response = decryptPHI(triageResponse.response);
    
    // Audit log
    logger.info('Med-Gemini triage completed', {
      recommendedModule: triageResponse.triageResult.recommendedModule,
      urgency: triageResponse.triageResult.urgency,
      confidence: triageResponse.triageResult.confidence,
    });

    return triageResponse;
  } catch (error) {
    logger.error('Error calling Med-Gemini', { error: error.message });
    throw new Error('Failed to process triage request');
  }
}

/**
 * Validate triage request
 */
export function validateTriageRequest(req) {
  const { message, patientId, sessionId } = req.body;
  
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw new Error('Message is required and must be non-empty');
  }
  
  if (!patientId || typeof patientId !== 'string') {
    throw new Error('Patient ID is required');
  }
  
  // sessionId is optional - will be created if not provided
  // No need to validate it
  
  return true;
}

