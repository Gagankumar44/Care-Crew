import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.HIPAA_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const ALGORITHM = 'aes-256-gcm';

/**
 * Encrypt PHI (Protected Health Information)
 * @param {string} text - Plain text PHI
 * @returns {string} Encrypted text (base64)
 */
export function encryptPHI(text) {
  if (!text) return text;
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Return: iv:authTag:encrypted (all base64)
  return Buffer.concat([
    iv,
    authTag,
    Buffer.from(encrypted, 'hex'),
  ]).toString('base64');
}

/**
 * Decrypt PHI
 * @param {string} encryptedText - Encrypted text (base64)
 * @returns {string} Decrypted plain text
 */
export function decryptPHI(encryptedText) {
  if (!encryptedText) return encryptedText;
  
  try {
    const buffer = Buffer.from(encryptedText, 'base64');
    const iv = buffer.slice(0, 16);
    const authTag = buffer.slice(16, 32);
    const encrypted = buffer.slice(32);
    
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY.slice(0, 32), 'hex'),
      iv,
    );
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // If decryption fails, return original (might be non-PHI)
    return encryptedText;
  }
}

