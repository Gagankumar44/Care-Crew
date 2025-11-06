import { query } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Offline-First Sync Service
 * Handles sync queue management, conflict resolution, and batch operations
 */

export class SyncService {
  /**
   * Add record to sync queue
   */
  async addToSyncQueue(patientId, recordType, recordId, operation, data) {
    const validOperations = ['create', 'update', 'delete'];
    if (!validOperations.includes(operation)) {
      throw new Error(`Invalid operation. Must be one of: ${validOperations.join(', ')}`);
    }

    // Check if record already exists in queue
    const existing = await query(
      `SELECT id FROM sync_queue 
       WHERE patient_id = $1 
       AND record_type = $2 
       AND record_id = $3 
       AND sync_status = 'pending'`,
      [patientId, recordType, recordId]
    );

    if (existing.rows.length > 0) {
      // Update existing queue item
      const result = await query(
        `UPDATE sync_queue 
         SET operation = $1, data = $2, created_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [operation, JSON.stringify(data), existing.rows[0].id]
      );
      return result.rows[0];
    } else {
      // Create new queue item
      const result = await query(
        `INSERT INTO sync_queue (
          patient_id, record_type, record_id, operation, data
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [patientId, recordType, recordId, operation, JSON.stringify(data)]
      );
      return result.rows[0];
    }
  }

  /**
   * Get pending sync items for patient
   */
  async getPendingSyncItems(patientId, limit = 50, offset = 0) {
    const result = await query(
      `SELECT * FROM sync_queue 
       WHERE patient_id = $1 
       AND sync_status = 'pending'
       ORDER BY created_at ASC
       LIMIT $2 OFFSET $3`,
      [patientId, limit, offset]
    );

    return result.rows.map(row => ({
      ...row,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
    }));
  }

  /**
   * Get sync status for patient
   */
  async getSyncStatus(patientId) {
    const stats = await query(
      `SELECT 
        sync_status,
        COUNT(*) as count
      FROM sync_queue
      WHERE patient_id = $1
      GROUP BY sync_status`,
      [patientId]
    );

    const summary = {
      pending: 0,
      syncing: 0,
      synced: 0,
      failed: 0,
      lastSyncAt: null,
    };

    stats.rows.forEach(row => {
      summary[row.sync_status] = parseInt(row.count);
    });

    // Get last sync timestamp
    const lastSync = await query(
      `SELECT MAX(synced_at) as last_sync
       FROM sync_queue
       WHERE patient_id = $1 AND synced_at IS NOT NULL`,
      [patientId]
    );

    summary.lastSyncAt = lastSync.rows[0]?.last_sync || null;

    return summary;
  }

  /**
   * Mark sync item as syncing
   */
  async markAsSyncing(queueItemId) {
    const result = await query(
      `UPDATE sync_queue 
       SET sync_status = 'syncing'
       WHERE id = $1
       RETURNING *`,
      [queueItemId]
    );

    if (result.rows.length === 0) {
      throw new Error('Sync queue item not found');
    }

    return result.rows[0];
  }

  /**
   * Mark sync item as synced
   */
  async markAsSynced(queueItemId) {
    const result = await query(
      `UPDATE sync_queue 
       SET sync_status = 'synced', synced_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [queueItemId]
    );

    if (result.rows.length === 0) {
      throw new Error('Sync queue item not found');
    }

    return result.rows[0];
  }

  /**
   * Mark sync item as failed
   */
  async markAsFailed(queueItemId, errorMessage = null) {
    const result = await query(
      `UPDATE sync_queue 
       SET sync_status = 'failed', 
           data = jsonb_set(data, '{error}', $1::jsonb)
       WHERE id = $2
       RETURNING *`,
      [JSON.stringify(errorMessage || 'Unknown error'), queueItemId]
    );

    if (result.rows.length === 0) {
      throw new Error('Sync queue item not found');
    }

    return result.rows[0];
  }

  /**
   * Batch sync pending items
   */
  async batchSync(patientId, batchSize = 20) {
    const pendingItems = await this.getPendingSyncItems(patientId, batchSize, 0);

    if (pendingItems.length === 0) {
      return {
        synced: 0,
        failed: 0,
        items: [],
      };
    }

    const results = {
      synced: 0,
      failed: 0,
      items: [],
    };

    for (const item of pendingItems) {
      try {
        // Mark as syncing
        await this.markAsSyncing(item.id);

        // Process sync (in production, this would call appropriate service)
        // For now, simulate successful sync
        await this.markAsSynced(item.id);

        results.synced++;
        results.items.push({
          id: item.id,
          status: 'synced',
        });
      } catch (error) {
        logger.error('Sync item failed', { itemId: item.id, error: error.message });
        await this.markAsFailed(item.id, error.message);

        results.failed++;
        results.items.push({
          id: item.id,
          status: 'failed',
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Retry failed sync items
   */
  async retryFailedItems(patientId, limit = 10) {
    const result = await query(
      `UPDATE sync_queue 
       SET sync_status = 'pending'
       WHERE patient_id = $1 
       AND sync_status = 'failed'
       AND id IN (
         SELECT id FROM sync_queue 
         WHERE patient_id = $1 AND sync_status = 'failed'
         ORDER BY created_at ASC
         LIMIT $2
       )
       RETURNING *`,
      [patientId, limit]
    );

    return result.rows;
  }

  /**
   * Clear synced items (cleanup)
   */
  async clearSyncedItems(patientId, olderThanDays = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await query(
      `DELETE FROM sync_queue 
       WHERE patient_id = $1 
       AND sync_status = 'synced'
       AND synced_at < $2
       RETURNING *`,
      [patientId, cutoffDate]
    );

    return {
      deletedCount: result.rows.length,
    };
  }

  /**
   * Get sync conflicts
   */
  async getConflicts(patientId) {
    // Find records with conflicting updates
    const conflicts = await query(
      `SELECT 
        record_type,
        record_id,
        COUNT(*) as conflict_count,
        ARRAY_AGG(id ORDER BY created_at) as queue_item_ids
      FROM sync_queue
      WHERE patient_id = $1
      AND sync_status = 'pending'
      GROUP BY record_type, record_id
      HAVING COUNT(*) > 1`,
      [patientId]
    );

    return conflicts.rows.map(row => ({
      recordType: row.record_type,
      recordId: row.record_id,
      conflictCount: parseInt(row.conflict_count),
      queueItemIds: row.queue_item_ids,
    }));
  }

  /**
   * Resolve conflict using last-write-wins strategy
   */
  async resolveConflict(recordType, recordId, patientId) {
    const conflicts = await query(
      `SELECT * FROM sync_queue
       WHERE patient_id = $1
       AND record_type = $2
       AND record_id = $3
       AND sync_status = 'pending'
       ORDER BY created_at DESC`,
      [patientId, recordType, recordId]
    );

    if (conflicts.rows.length <= 1) {
      return { resolved: false, message: 'No conflict found' };
    }

    // Keep the most recent one, mark others as resolved
    const latest = conflicts.rows[0];
    const others = conflicts.rows.slice(1);

    for (const other of others) {
      await query(
        `UPDATE sync_queue 
         SET sync_status = 'synced', 
             synced_at = NOW(),
             data = jsonb_set(data, '{conflict_resolved}', 'true'::jsonb)
         WHERE id = $1`,
        [other.id]
      );
    }

    return {
      resolved: true,
      keptItemId: latest.id,
      resolvedItemIds: others.map(o => o.id),
    };
  }

  /**
   * Get sync history
   */
  async getSyncHistory(patientId, limit = 50, offset = 0) {
    const result = await query(
      `SELECT * FROM sync_queue 
       WHERE patient_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [patientId, limit, offset]
    );

    return result.rows.map(row => ({
      ...row,
      data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data,
    }));
  }

  /**
   * Get sync statistics
   */
  async getSyncStatistics(patientId, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const stats = await query(
      `SELECT 
        sync_status,
        record_type,
        COUNT(*) as count,
        AVG(EXTRACT(EPOCH FROM (synced_at - created_at))) as avg_sync_time_seconds
      FROM sync_queue
      WHERE patient_id = $1 AND created_at >= $2
      GROUP BY sync_status, record_type`,
      [patientId, cutoffDate]
    );

    const summary = {
      total: 0,
      byStatus: {},
      byRecordType: {},
      avgSyncTime: 0,
    };

    let totalSyncTime = 0;
    let syncCount = 0;

    stats.rows.forEach(row => {
      summary.total += parseInt(row.count);

      if (!summary.byStatus[row.sync_status]) {
        summary.byStatus[row.sync_status] = 0;
      }
      summary.byStatus[row.sync_status] += parseInt(row.count);

      if (!summary.byRecordType[row.record_type]) {
        summary.byRecordType[row.record_type] = 0;
      }
      summary.byRecordType[row.record_type] += parseInt(row.count);

      if (row.avg_sync_time_seconds) {
        totalSyncTime += parseFloat(row.avg_sync_time_seconds);
        syncCount++;
      }
    });

    if (syncCount > 0) {
      summary.avgSyncTime = (totalSyncTime / syncCount).toFixed(2);
    }

    return summary;
  }
}

export default new SyncService();

