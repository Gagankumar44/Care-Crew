import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Zero-Knowledge Medical Locker Service
 * End-to-end encrypted medical records vault
 */

export class MedicalLockerService {
  /**
   * Store encrypted medical record
   * @param {string} patientId - Patient ID
   * @param {string} recordType - Type of record
   * @param {object} data - Data to encrypt
   * @param {string} encryptionKey - User-provided encryption key (never stored)
   * @param {object} metadata - Non-sensitive metadata
   */
  async storeRecord(patientId, recordType, data, encryptionKey, metadata = {}) {
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }

    // Encrypt data with user's key
    const encryptedData = this.encryptData(data, encryptionKey);

    // Create hash of encryption key (for verification purposes only)
    const encryptionKeyHash = this.hashKey(encryptionKey);

    const result = await query(
      `INSERT INTO medical_locker (
        patient_id, record_type, encrypted_data, encryption_key_hash, metadata
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        patientId,
        recordType,
        encryptedData,
        encryptionKeyHash,
        JSON.stringify(metadata),
      ]
    );

    return {
      id: result.rows[0].id,
      recordType: result.rows[0].record_type,
      metadata: result.rows[0].metadata,
      createdAt: result.rows[0].created_at,
      // Never return encrypted data or key hash
    };
  }

  /**
   * Retrieve and decrypt medical record
   * @param {string} recordId - Record ID
   * @param {string} patientId - Patient ID
   * @param {string} encryptionKey - User-provided encryption key
   */
  async retrieveRecord(recordId, patientId, encryptionKey) {
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }

    const result = await query(
      'SELECT * FROM medical_locker WHERE id = $1 AND patient_id = $2',
      [recordId, patientId]
    );

    if (result.rows.length === 0) {
      throw new Error('Record not found');
    }

    const record = result.rows[0];

    // Verify encryption key hash matches
    const providedKeyHash = this.hashKey(encryptionKey);
    if (record.encryption_key_hash !== providedKeyHash) {
      throw new Error('Invalid encryption key');
    }

    // Decrypt data
    const decryptedData = this.decryptData(record.encrypted_data, encryptionKey);

    return {
      id: record.id,
      recordType: record.record_type,
      data: decryptedData,
      metadata: record.metadata,
      createdAt: record.created_at,
    };
  }

  /**
   * Get all records for patient (metadata only)
   */
  async getPatientRecords(patientId) {
    const result = await query(
      `SELECT id, record_type, metadata, created_at 
       FROM medical_locker 
       WHERE patient_id = $1 
       ORDER BY created_at DESC`,
      [patientId]
    );

    return result.rows.map(row => ({
      id: row.id,
      recordType: row.record_type,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      createdAt: row.created_at,
    }));
  }

  /**
   * Delete encrypted record
   */
  async deleteRecord(recordId, patientId, encryptionKey) {
    // Verify encryption key before deletion
    const record = await query(
      'SELECT encryption_key_hash FROM medical_locker WHERE id = $1 AND patient_id = $2',
      [recordId, patientId]
    );

    if (record.rows.length === 0) {
      throw new Error('Record not found');
    }

    const providedKeyHash = this.hashKey(encryptionKey);
    if (record.rows[0].encryption_key_hash !== providedKeyHash) {
      throw new Error('Invalid encryption key');
    }

    await query(
      'DELETE FROM medical_locker WHERE id = $1 AND patient_id = $2',
      [recordId, patientId]
    );

    return { success: true };
  }

  /**
   * Create share link for record
   */
  async createShareLink(recordId, patientId, expiresInHours = 24, maxAccessCount = null) {
    // Verify record exists
    const record = await query(
      'SELECT id FROM medical_locker WHERE id = $1 AND patient_id = $2',
      [recordId, patientId]
    );

    if (record.rows.length === 0) {
      throw new Error('Record not found');
    }

    // Generate secure token
    const shareToken = crypto.randomBytes(32).toString('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const result = await query(
      `INSERT INTO locker_share_links (
        locker_record_id, share_token, expires_at, max_access_count
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [recordId, shareToken, expiresAt, maxAccessCount]
    );

    return {
      shareToken,
      expiresAt: result.rows[0].expires_at,
      maxAccessCount: result.rows[0].max_access_count,
    };
  }

  /**
   * Access record via share link
   */
  async accessViaShareLink(shareToken, encryptionKey) {
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }

    const result = await query(
      `SELECT ml.*, ls.expires_at, ls.max_access_count, ls.access_count
       FROM medical_locker ml
       JOIN locker_share_links ls ON ml.id = ls.locker_record_id
       WHERE ls.share_token = $1`,
      [shareToken]
    );

    if (result.rows.length === 0) {
      throw new Error('Invalid or expired share link');
    }

    const link = result.rows[0];

    // Check expiration
    if (new Date(link.expires_at) < new Date()) {
      throw new Error('Share link has expired');
    }

    // Check access count
    if (link.max_access_count && link.access_count >= link.max_access_count) {
      throw new Error('Maximum access count reached');
    }

    // Update access count
    await query(
      'UPDATE locker_share_links SET access_count = access_count + 1 WHERE share_token = $1',
      [shareToken]
    );

    // Verify encryption key
    const providedKeyHash = this.hashKey(encryptionKey);
    if (link.encryption_key_hash !== providedKeyHash) {
      throw new Error('Invalid encryption key');
    }

    // Decrypt data
    const decryptedData = this.decryptData(link.encrypted_data, encryptionKey);

    return {
      id: link.id,
      recordType: link.record_type,
      data: decryptedData,
      metadata: typeof link.metadata === 'string' ? JSON.parse(link.metadata) : link.metadata,
      createdAt: link.created_at,
    };
  }

  /**
   * Revoke share link
   */
  async revokeShareLink(shareToken, patientId) {
    const result = await query(
      `DELETE FROM locker_share_links 
       WHERE share_token = $1 
       AND locker_record_id IN (
         SELECT id FROM medical_locker WHERE patient_id = $2
       )
       RETURNING *`,
      [shareToken, patientId]
    );

    if (result.rows.length === 0) {
      throw new Error('Share link not found');
    }

    return { success: true };
  }

  /**
   * Get share links for patient
   */
  async getShareLinks(patientId) {
    const result = await query(
      `SELECT ls.*, ml.record_type, ml.metadata
       FROM locker_share_links ls
       JOIN medical_locker ml ON ls.locker_record_id = ml.id
       WHERE ml.patient_id = $1
       ORDER BY ls.created_at DESC`,
      [patientId]
    );

    return result.rows.map(row => ({
      shareToken: row.share_token,
      recordType: row.record_type,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      expiresAt: row.expires_at,
      accessCount: row.access_count,
      maxAccessCount: row.max_access_count,
      createdAt: row.created_at,
    }));
  }

  /**
   * Encrypt data using AES-256
   */
  encryptData(data, key) {
    const dataString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(dataString, key).toString();
    return encrypted;
  }

  /**
   * Decrypt data using AES-256
   */
  decryptData(encryptedData, key) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      throw new Error('Decryption failed - invalid key or corrupted data');
    }
  }

  /**
   * Hash encryption key (for verification only)
   */
  hashKey(key) {
    return crypto.createHash('sha256').update(key).digest('hex');
  }

  /**
   * Clean up expired share links
   */
  async cleanupExpiredLinks() {
    const result = await query(
      'DELETE FROM locker_share_links WHERE expires_at < NOW() RETURNING *'
    );

    return {
      deletedCount: result.rows.length,
    };
  }
}

export default new MedicalLockerService();

