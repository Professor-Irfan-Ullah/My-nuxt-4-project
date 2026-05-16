<!-- src/components/victim/ReportListItem.vue -->
<template>
  <div
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
    class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
    :tabindex="0"
    :style="{ animationDelay: `${index * 0.1}s` }"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="flex-shrink-0">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="statusIconClass"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
        <div>
          <h4
            class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors group-focus:text-blue-600"
          >
            Damage Report #{{ report.report_id }}
          </h4>
          <div class="flex items-center space-x-3 mt-1">
            <span class="text-sm text-gray-500">
              <svg
                class="w-4 h-4 inline-block mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ formattedDate }}
            </span>
            <span
              v-if="report.total_residents_count"
              class="text-sm text-gray-500"
            >
              <svg
                class="w-4 h-4 inline-block mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {{ report.total_residents_count }} family members
            </span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span
          class="px-3 py-1 rounded-full text-xs font-medium"
          :class="statusBadgeClass"
        >
          {{ formattedStatus }}
        </span>
        <svg
          class="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-focus:text-blue-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  report: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["click"]);

// Get status from either status or report_status field
const reportStatus = computed(() => {
  return (
    props.report.status ||
    props.report.report_status ||
    ""
  ).toLowerCase();
});

// Format status for display
const formattedStatus = computed(() => {
  const status = reportStatus.value;
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1);
});

// Format date for display
const formattedDate = computed(() => {
  const dateString = props.report.created_at;
  if (!dateString) return "N/A";

  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid Date";
  }
});

// Status styling
const statusIconClass = computed(() => {
  const status = reportStatus.value;

  if (status === "verified") {
    return "bg-green-100 text-green-600";
  }

  if (status === "pending") {
    return "bg-yellow-100 text-yellow-600";
  }

  return "bg-gray-100 text-gray-600";
});

const statusBadgeClass = computed(() => {
  const status = reportStatus.value;

  if (status === "verified") {
    return "bg-green-100 text-green-800";
  }

  if (status === "pending") {
    return "bg-yellow-100 text-yellow-800";
  }

  return "bg-gray-100 text-gray-800";
});

const handleClick = () => {
  emit("click");
};
</script>

<style scoped>
/* Animation for staggered list items */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

div {
  animation: fadeIn 0.3s ease-out;
  animation-fill-mode: both;
}
</style>