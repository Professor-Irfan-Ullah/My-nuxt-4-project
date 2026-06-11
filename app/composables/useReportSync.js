import { reportDB } from '~/services/reportDatabase';
import { useReportStore } from '~/stores/reportsStore';
import { useOnlineStatus } from '~/composables/useOnlineStatus';
export const useReportSync = () => {
    const store = useReportStore();
    const { isOnline } = useOnlineStatus();
    const isSyncing = ref(false);
    const pendingCount = ref(0);
    const hasSubmitted = ref(false); // Add this
    const syncErrors = ref([])

    let intervalId = null;

    const loadPendingCount = async () => {
        if (import.meta.client) {
            pendingCount.value = await reportDB.getPendingCount();
        }
    };

    // Add this function to check submission status
    const checkSubmissionStatus = async () => {
        if (import.meta.client) {
            const userId = await reportDB.getUserId();
            hasSubmitted.value = await reportDB.hasUserSubmitted(userId);
            return hasSubmitted.value;
        }
        return false;
    };

    const syncPendingReports = async () => {
        if (!isOnline.value || isSyncing.value) return;
        isSyncing.value = true;
        syncErrors.value = []
        try {
            const pendingReports = await reportDB.getPendingReports();
            if (pendingReports.length === 0) {
                await loadPendingCount();
                return;
            }

            // Check if already submitted before syncing
            const alreadySubmitted = await checkSubmissionStatus();
            if (alreadySubmitted) {
                // Clear pending reports since user already submitted
                for (const report of pendingReports) {
                    await reportDB.deleteReport(report.id);
                }
                await loadPendingCount();
                console.log('User already submitted, cleared pending reports');
                return;
            }

            console.log(`🔄 Syncing ${pendingReports.length} pending report(s)...`);

            for (const report of pendingReports) {
                try {
                    const formData = new FormData();
                    formData.append('data', JSON.stringify(report.reportData));

                    if (report.images && report.images.length > 0) {
                        for (const img of report.images) {
                            if (img.base64) {
                                const blob = await fetch(img.base64).then(res => res.blob());
                                formData.append('property_images', blob, img.name);
                            }
                        }
                    }

                    const response = await store.addReport(formData);
                    if (response) {
                        // Mark user as submitted in local DB
                        const userId = await reportDB.getUserId();
                        await reportDB.markUserAsSubmitted(userId, response.reportId || report.id);
                        await reportDB.deleteReport(report.id);
                        await checkSubmissionStatus(); // Update status
                        console.log(`✅ Report ${report.id} synced successfully`);
                    }
                } catch (error) {
                    syncErrors.value.push(error.response._data)
                    console.error(`❌ Failed to sync report ${report.id}:`, error);

                    // Check if error is due to duplicate submission
                    if (error.response?.status === 409 || error.message?.includes('already submitted')) {
                        const userId = await reportDB.getUserId();
                        await reportDB.markUserAsSubmitted(userId, report.id);
                        await reportDB.deleteReport(report.id);
                        await checkSubmissionStatus();
                    } else {
                        await reportDB.incrementRetryCount(report.id);
                        const updatedReports = await reportDB.getPendingReports();
                        const reportToCheck = updatedReports.find(r => r.id === report.id);
                        if (reportToCheck && reportToCheck.retryCount >= 12) {
                            await reportDB.markAsFailed(report.id);
                            const err = new Error('The report was droped due to subsequent request')
                            syncErrors.value.push(err)
                        }
                    }
                }
            }
            await loadPendingCount();
        } catch (error) {
            console.error('Sync process failed:', error);
        } finally {
            isSyncing.value = false;
        }
    };

    const setupAutoSync = () => {
        window.addEventListener('online', () => {
            console.log('🌐 Back online! Syncing reports...');
            syncPendingReports();
        });
    };

    onUnmounted(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });

    onMounted(async () => {
        if (import.meta.client) {
            await checkSubmissionStatus(); // Check on mount
            await loadPendingCount();
            setupAutoSync();

            if (isOnline.value && !hasSubmitted.value) {
                await syncPendingReports();
            }

            intervalId = setInterval(loadPendingCount, 5000);
        }
    });

    return {
        isSyncing,
        pendingCount,
        hasSubmitted, // Return this
        syncPendingReports,
        loadPendingCount,
        checkSubmissionStatus, // Return this
        syncErrors
    };
};