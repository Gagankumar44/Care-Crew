import { logger } from '../utils/logger.js';

/**
 * Claim Analysis Service
 * Analyzes insurance claims and determines status
 */
export class ClaimAnalysisService {
  /**
   * Analyze claim document
   */
  static async analyzeClaim(ocrText, structuredData) {
    try {
      const analysis = {
        status: 'pending',
        can_be_approved: false,
        missing_documents: [],
        recommendations: [],
        approval_likelihood: 0.5
      };

      // Check for required information
      const requiredFields = {
        policy_number: structuredData.policy_number,
        claim_number: structuredData.claim_number,
        patient_name: structuredData.patient_name,
        date_of_service: structuredData.date_of_service,
        amount_claimed: structuredData.amount_claimed
      };

      // Check missing fields
      Object.keys(requiredFields).forEach(field => {
        if (!requiredFields[field] || requiredFields[field] === '') {
          analysis.missing_documents.push(`${field.replace(/_/g, ' ')} is missing`);
        }
      });

      // Check for common required documents in text
      const documentKeywords = {
        'discharge summary': 'discharge summary',
        'prescription': 'prescription',
        'lab reports': 'lab report',
        'medical certificate': 'medical certificate',
        'bill': 'hospital bill'
      };

      const lowerText = ocrText.toLowerCase();
      Object.keys(documentKeywords).forEach(doc => {
        if (!lowerText.includes(documentKeywords[doc])) {
          analysis.missing_documents.push(`${doc} not found`);
        }
      });

      // Determine claim status
      if (analysis.missing_documents.length === 0) {
        analysis.can_be_approved = true;
        analysis.status = 'approved';
        analysis.approval_likelihood = 0.9;
        analysis.recommendations.push('All required documents are present. Claim can be approved.');
      } else {
        analysis.status = 'needs_info';
        analysis.approval_likelihood = 0.3;
        analysis.recommendations.push(
          `Missing documents: ${analysis.missing_documents.join(', ')}`
        );
        analysis.recommendations.push('Please provide the missing documents to proceed with claim approval.');
      }

      // Check for common rejection reasons
      const rejectionKeywords = ['expired', 'not covered', 'pre-existing', 'excluded'];
      rejectionKeywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          analysis.status = 'rejected';
          analysis.can_be_approved = false;
          analysis.approval_likelihood = 0.1;
          analysis.recommendations.push(`Claim may be rejected due to: ${keyword}`);
        }
      });

      // Validate amounts
      if (structuredData.amount_claimed > 0 && structuredData.amount_approved > 0) {
        const approvalRate = structuredData.amount_approved / structuredData.amount_claimed;
        if (approvalRate < 0.8) {
          analysis.recommendations.push(
            `Only ${(approvalRate * 100).toFixed(0)}% of claimed amount was approved. Review deductions.`
          );
        }
      }

      return analysis;
    } catch (error) {
      logger.error('Claim analysis error', { error: error.message });
      throw error;
    }
  }
}

