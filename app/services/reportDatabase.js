// services/reportDatabase.js
/*
import Dexie from 'dexie';

export const db = new Dexie('DisasterReportsDB');

// Define database schema
db.version(1).stores({
    pendingReports: '++id, timestamp, syncStatus, retryCount'
});

export const reportDB = {
    // Save report for offline submission
    async savePendingReport(reportData, images = []) {
        return await db.pendingReports.add({
            reportData: reportData,
            images: images.map(img => ({
                name: img.name,
                size: img.size,
                type: img.type,
                base64: img.base64 || null
            })),
            timestamp: new Date().toISOString(),
            syncStatus: 'pending',
            retryCount: 0
        });
    },

    // Get all pending reports
    async getPendingReports() {
        return await db.pendingReports
            .where('syncStatus')
            .equals('pending')
            .toArray();
    },

    // Get count of pending reports
    async getPendingCount() {
        return await db.pendingReports
            .where('syncStatus')
            .equals('pending')
            .count();
    },

    // Delete report after successful sync
    async deleteReport(id) {
        await db.pendingReports.delete(id);
    },

    // Increment retry count
    async incrementRetryCount(id) {
        const report = await db.pendingReports.get(id);
        if (report) {
            await db.pendingReports.update(id, {
                retryCount: (report.retryCount || 0) + 1
            });
        }
    },

    // Mark as failed after max retries
    async markAsFailed(id) {
        await db.pendingReports.update(id, {
            syncStatus: 'failed',
            failedAt: new Date().toISOString()
        });
    },

    // Clear all synced reports
    async clearSyncedReports() {
        await db.pendingReports.where('syncStatus').equals('synced').delete();
    }
};
*/
// services/reportDatabase.js
import Dexie from 'dexie';

export const db = new Dexie('DisasterReportsDB');

// Update schema to version 2
db.version(2).stores({
    pendingReports: '++id, userId, timestamp, syncStatus, retryCount',
    submittedReports: 'userId'  // Track users who have submitted
});

// Keep version 1 for backward compatibility
db.version(1).stores({
    pendingReports: '++id, timestamp, syncStatus, retryCount'
}).upgrade(tx => {
    // Migration: add userId to existing reports
    return tx.table('pendingReports').toCollection().modify(report => {
        report.userId = localStorage.getItem('disaster_user_id') || 'anonymous';
    });
});

export const reportDB = {
    // Get or create user ID
    async getUserId() {
        let userId = localStorage.getItem('disaster_user_id');
        if (!userId) {
            userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('disaster_user_id', userId);
        }
        return userId;
    },

    // Check if user has already submitted
    async hasUserSubmitted(userId) {
        const count = await db.submittedReports
            .where('userId')
            .equals(userId)
            .count();
        return count > 0;
    },

    // Mark user as submitted
    async markUserAsSubmitted(userId, reportId = null) {
        await db.submittedReports.add({
            userId: userId,
            reportId: reportId,
            submittedAt: new Date().toISOString()
        });
    },

    // Save report for offline submission (with user check)
    async savePendingReport(reportData, images = []) {
        const userId = await this.getUserId();

        // Check if already submitted
        const hasSubmitted = await this.hasUserSubmitted(userId);
        if (hasSubmitted) {
            throw new Error('ONLY_ONE_REPORT_ALLOWED');
        }

        // Check for existing pending report for this user
        const existingPending = await db.pendingReports
            .where('userId')
            .equals(userId)
            .and(r => r.syncStatus === 'pending')
            .first();

        if (existingPending) {
            throw new Error('PENDING_REPORT_EXISTS');
        }

        return await db.pendingReports.add({
            userId: userId,
            reportData: reportData,
            images: images.map(img => ({
                name: img.name,
                size: img.size,
                type: img.type,
                base64: img.base64 || null
            })),
            timestamp: new Date().toISOString(),
            syncStatus: 'pending',
            retryCount: 0
        });
    },

    // Get pending reports for current user only
    async getPendingReports() {
        const userId = await this.getUserId();
        return await db.pendingReports
            .where('userId')
            .equals(userId)
            .and(r => r.syncStatus === 'pending')
            .toArray();
    },

    // Get pending count for current user
    async getPendingCount() {
        const userId = await this.getUserId();
        return await db.pendingReports
            .where('userId')
            .equals(userId)
            .and(r => r.syncStatus === 'pending')
            .count();
    },

    // Delete report after successful sync
    async deleteReport(id) {
        await db.pendingReports.delete(id);
    },

    // Increment retry count
    async incrementRetryCount(id) {
        const report = await db.pendingReports.get(id);
        if (report) {
            await db.pendingReports.update(id, {
                retryCount: (report.retryCount || 0) + 1
            });
        }
    },

    // Mark as failed after max retries
    async markAsFailed(id) {
        await db.pendingReports.update(id, {
            syncStatus: 'failed',
            failedAt: new Date().toISOString()
        });
    },

    // Clear all synced reports for current user
    async clearSyncedReports() {
        const userId = await this.getUserId();
        await db.pendingReports
            .where('userId')
            .equals(userId)
            .and(r => r.syncStatus === 'synced')
            .delete();
    }
};