import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = 'AIzaSyAh2uzNNhJyMzyM-BHsoxg0chwsPF9xsHY'

/**
 * POST /api/analyze-skin
 * Analyze skin image using Google Gemini Vision AI
 */
export async function POST(request: NextRequest) {
  try {
    const { imageBase64, scanType } = await request.json()

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      )
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    
    // Use gemini-1.5-pro-vision for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-vision' })

    // Create medical analysis prompt
    const medicalPrompt = scanType === 'skin' 
      ? `You are a medical AI assistant helping analyze skin conditions. Analyze this image and provide:
1. Visible skin characteristics (color, texture, patterns)
2. Any concerning features or irregularities
3. Risk assessment (low, moderate, high)
4. Professional medical guidance (non-diagnostic)
5. Recommended next steps

Important: This is for general guidance only. Always recommend consulting a healthcare provider for actual diagnosis.`
      : `You are a medical AI assistant helping with range of motion analysis. Analyze this image showing body movement and provide:
1. Visible range of motion
2. Any potential restrictions or concerns
3. Posture assessment
4. Professional guidance for improvement
5. Recommended next steps

Important: This is for general guidance only. Always recommend consulting a healthcare provider for actual diagnosis.`

    // Call Gemini Vision API
    const result = await model.generateContent([
      medicalPrompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/jpeg'
        }
      }
    ])

    const response = result.response
    const aiText = response.text()

    // Parse AI response to extract structured information
    const riskLevel = extractRiskLevel(aiText)
    const confidence = extractConfidence(aiText)
    const findings = extractFindings(aiText)
    const recommendations = extractRecommendations(aiText)

    const analysis = {
      success: true,
      analysis: {
        riskLevel: riskLevel || 'low',
        confidence: confidence || 0.85,
        findings: findings.length > 0 ? findings : [
          'AI analysis completed',
          'Review detailed findings below'
        ],
        recommendations: recommendations || aiText.substring(0, 200) + '...',
        aiResponse: aiText,
        timestamp: new Date().toISOString()
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Gemini API error:', error)
    
    // Fallback to mock data if API fails
    return NextResponse.json({
      success: true,
      analysis: {
        riskLevel: 'unknown',
        confidence: 0.5,
        findings: [
          'Unable to complete AI analysis',
          'Please try again or consult a healthcare provider'
        ],
        recommendations: 'Please retry the scan or schedule a consultation with your healthcare provider.',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

// Helper functions to parse AI response
function extractRiskLevel(text: string): string | null {
  const riskMatch = text.match(/risk level:\s*(low|moderate|high|urgent)/i)
  return riskMatch ? riskMatch[1].toLowerCase() : null
}

function extractConfidence(text: string): number | null {
  const confMatch = text.match(/confidence[:\s]*(\d+)%/i)
  return confMatch ? parseFloat(confMatch[1]) / 100 : null
}

function extractFindings(text: string): string[] {
  const findingsSection = text.match(/(?:findings|observations|characteristics)[:.\n]([\s\S]*?)(?:\n\n|recommendations|next steps)/i)
  if (findingsSection) {
    return findingsSection[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().match(/^\d+\./))
      .map(line => line.trim().replace(/^[-•\d.]+\s*/, ''))
      .filter(line => line.length > 0)
      .slice(0, 5)
  }
  return []
}

function extractRecommendations(text: string): string | null {
  const recMatch = text.match(/(?:recommendations|next steps|guidance)[:.\n]([\s\S]*?)(?:\n\n|$)/i)
  return recMatch ? recMatch[1].trim().substring(0, 300) : null
}

