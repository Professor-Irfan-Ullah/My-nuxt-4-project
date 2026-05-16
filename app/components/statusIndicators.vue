<!-- components/StatusIndicators.vue -->
<template>
  <div class="status-indicators">
    <!-- Top Right Status Badges -->
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <!-- Already Submitted Warning -->
      <div v-if="hasSubmitted" class="status-badge status-badge--submitted">
        <span class="status-icon">⚠️</span>
        <span>Report Already Submitted</span>
      </div>

      <!-- Offline Mode -->
      <div v-else-if="!isOnline" class="status-badge status-badge--offline">
        <span class="status-icon">📴</span>
        <span>Offline Mode - Report will be saved locally</span>
      </div>

      <!-- Online Mode Indicator -->
      <div
        v-else-if="isOnline && pendingCount === 0 && !hasSubmitted"
        class="status-badge status-badge--online"
      >
        <span class="status-icon">✅</span>
        <span>Online - Ready to submit</span>
      </div>

      <!-- Syncing Indicator -->
      <div v-if="isSyncing" class="status-badge status-badge--syncing">
        <span class="status-icon animate-spin">⏳</span>
        <span>Syncing report(s)...</span>
      </div>

      <!-- Pending Reports -->
      <div
        v-if="pendingCount > 0 && !hasSubmitted"
        class="status-badge status-badge--pending"
      >
        <div class="flex items-center gap-2">
          <span class="status-icon">📋</span>
          <span class="font-bold">{{ pendingCount }}</span>
          <span>{{
            pendingCount === 1 ? "pending report" : "pending reports"
          }}</span>

          <!-- Progress indicator -->
          <div v-if="pendingCount > 1" class="progress-track">
            <div
              class="progress-bar"
              :style="{ width: syncProgress + '%' }"
            ></div>
          </div>

          <button
            v-if="isOnline && !isSyncing"
            @click="handleSync"
            class="sync-button"
            :disabled="isSyncing"
          >
            {{ isSyncing ? "Syncing..." : "Sync Now" }}
          </button>
        </div>
        <div class="status-hint">Will auto-sync when online</div>
      </div>
    </div>

    <!-- Floating Action Buttons -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <!-- Manual Sync Button -->
      <button
        v-if="pendingCount > 0 && isOnline && !isSyncing && !hasSubmitted"
        @click="handleSync"
        class="fab-button fab-button--sync"
      >
        <span class="fab-icon">🔄</span>
        <span>Sync Now</span>
        <span class="fab-badge">{{ pendingCount }}</span>
      </button>

      <!-- Retry Failed Reports Button -->
      <button
        v-if="failedCount > 0 && isOnline && !hasSubmitted"
        @click="handleRetryFailed"
        class="fab-button fab-button--retry"
      >
        <span class="fab-icon">⚠️</span>
        <span>Retry Failed ({{ failedCount }})</span>
      </button>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="showToastMessage"
        class="toast-notification"
        :class="`toast--${toastType}`"
      >
        <div class="flex items-center gap-2">
          <span>{{ toastIcon }}</span>
          <span>{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";

// Props
const props = defineProps({
  hasSubmitted: {
    type: Boolean,
    default: false,
  },
  isOnline: {
    type: Boolean,
    default: true, // Default to true for SSR
  },
  pendingCount: {
    type: Number,
    default: 0,
  },
  isSyncing: {
    type: Boolean,
    default: false,
  },
  syncedCount: {
    type: Number,
    default: 0,
  },
  failedCount: {
    type: Number,
    default: 0,
  },
});

// Emits
const emit = defineEmits(["sync", "retry-failed"]);

// Toast state
const showToastMessage = ref(false);
const toastMessage = ref("");
const toastType = ref("success");
let toastTimeout = null;

// Computed
const syncProgress = computed(() => {
  if (props.pendingCount === 0) return 0;
  const total = props.syncedCount + props.pendingCount;
  return (props.syncedCount / total) * 100;
});

const toastIcon = computed(() => {
  switch (toastType.value) {
    case "success":
      return "✅";
    case "error":
      return "❌";
    default:
      return "ℹ️";
  }
});

// Methods
const showToast = (message, type = "success") => {
  toastMessage.value = message;
  toastType.value = type;
  showToastMessage.value = true;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    showToastMessage.value = false;
  }, 3000);
};

const handleSync = () => {
  emit("sync");
};

const handleRetryFailed = () => {
  emit("retry-failed");
};

// Watch for sync completion
watch(
  () => props.isSyncing,
  (newVal, oldVal) => {
    if (oldVal === true && newVal === false && props.pendingCount === 0) {
      showToast("All reports synced successfully!", "success");
    }
  }
);

// Watch for pending count changes
watch(
  () => props.pendingCount,
  (newCount, oldCount) => {
    if (oldCount > 0 && newCount === 0 && props.isOnline) {
      showToast("All caught up! No pending reports.", "success");
    }
  }
);

// Cleanup
onUnmounted(() => {
  if (toastTimeout) clearTimeout(toastTimeout);
});

// Expose methods for parent component
defineExpose({
  showToast,
});
</script>

<style scoped>
/* Status Badges */
.status-badge {
  @apply px-4 py-2 rounded-lg shadow-lg flex items-center gap-2;
}

.status-badge--submitted {
  @apply bg-red-500 text-white animate-pulse;
}

.status-badge--offline {
  @apply bg-yellow-500 text-white;
}

.status-badge--online {
  @apply bg-green-500 text-white;
}

.status-badge--syncing {
  @apply bg-purple-500 text-white;
}

.status-badge--pending {
  @apply bg-blue-500 text-white;
}

.status-icon {
  @apply flex-shrink-0;
}

.status-hint {
  @apply text-xs mt-1 opacity-90;
}

/* Progress Indicator */
.progress-track {
  @apply ml-2 w-16 bg-blue-400 rounded-full h-1.5 overflow-hidden;
}

.progress-bar {
  @apply bg-white rounded-full h-1.5 transition-all duration-300;
}

/* Sync Button */
.sync-button {
  @apply ml-2 text-xs bg-white text-blue-500 px-2 py-1 rounded 
         hover:bg-blue-50 transition-colors font-medium;
}

.sync-button:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Floating Action Buttons */
.fab-button {
  @apply px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl 
         transition-all duration-200 flex items-center gap-2 font-medium;
}

.fab-button--sync {
  @apply bg-gradient-to-r from-green-500 to-green-600 text-white;
}

.fab-button--retry {
  @apply bg-orange-500 text-white hover:bg-orange-600;
}

.fab-icon {
  @apply group-hover:animate-pulse;
}

.fab-badge {
  @apply bg-white text-green-600 rounded-full px-2 py-0.5 text-xs font-bold ml-1;
}

/* Toast Notification */
.toast-notification {
  @apply fixed bottom-20 right-4 z-50 bg-gray-800 text-white 
         px-4 py-2 rounded-lg shadow-lg;
}

.toast--success {
  @apply bg-green-600;
}

.toast--error {
  @apply bg-red-600;
}

.toast--info {
  @apply bg-blue-600;
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>