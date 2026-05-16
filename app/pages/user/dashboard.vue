<!-- src/components/victim/Dashboard.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">
        Monitor your disaster relief reports and status
      </p>
    </div>

    <!-- Welcome Card -->
    <div
      class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 mb-8 text-white"
    >
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="mb-4 md:mb-0">
          <div class="flex items-center">
            <div class="bg-white/20 p-3 rounded-full mr-4">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold">
                Welcome back,
                <span class="capitalize">{{
                  store.userData?.name || "User"
                }}</span
                >!
              </h2>
              <p class="mt-1 text-blue-100">
                Here's your current relief status
              </p>
            </div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p class="text-sm font-medium text-blue-100">Victim ID</p>
          <p class="text-lg font-semibold mt-1">
            {{ reportStore.reports?.user_id || "N/A" }}
          </p>
          <p class="text-sm text-blue-200 mt-2">
            {{ maskedPhoneNumber }}
          </p>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Report Overview</h3>
        <span class="text-sm text-gray-500"
          >Last updated: {{ currentDate }}</span
        >
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Reports"
          :value="reportStore.reports?.total_reports || 0"
          description="All submitted reports"
          icon="document"
          color="blue"
        />

        <StatsCard
          title="Verified"
          :value="reportStore.reports?.total_verified_reports || 0"
          description="Approved for assistance"
          icon="check"
          color="green"
        />

        <StatsCard
          title="Pending Review"
          :value="reportStore.reports?.total_pending_reports || 0"
          description="Awaiting verification"
          icon="clock"
          color="yellow"
        />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionButton
          title="New Damage Report"
          description="Submit new disaster damage assessment"
          icon="plus"
          color="blue"
          :disabled="isNewReportDisabled"
          @click="handleNewReport"
        />

        <QuickActionButton
          title="Refresh Status"
          description="Update all report statuses"
          icon="refresh"
          color="green"
          @click="refreshReports"
        />
      </div>
    </div>

    <!-- Recent Reports -->
    <div
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div
        class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Recent Reports</h3>
          <p class="text-sm text-gray-500 mt-1">
            Your latest disaster damage assessments
          </p>
        </div>
        <button
          @click="handleNewReport"
          :disabled="isNewReportDisabled"
          :aria-label="
            isNewReportDisabled
              ? `Report submission disabled (max ${MAX_REPORTS} reports)`
              : 'Submit new damage report'
          "
          class="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Report
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
        <p class="mt-4 text-gray-600 font-medium">Loading your reports...</p>
        <p class="text-sm text-gray-500 mt-1">Please wait a moment</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="(reportStore.reports?.total_reports || 0) === 0"
        class="p-8 text-center"
      >
        <div
          class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            class="w-8 h-8 text-gray-400"
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
        <h4 class="text-lg font-semibold text-gray-900">No reports yet</h4>
        <p class="text-gray-600 mt-2">
          You haven't submitted any disaster damage reports
        </p>
        <button
          @click="createNewReport"
          class="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Submit Your First Report
        </button>
      </div>

      <!-- Reports List -->
      <div v-else class="divide-y divide-gray-200">
        <ReportListItem
          v-for="(report, index) in reportStore.reports?.all_reports || []"
          :key="report.report_id"
          :report="report"
          :index="index"
          @click="viewReport(report.report_id)"
        />
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="mt-8 text-center">
      <p class="text-sm text-gray-500">
        Need immediate assistance? Call our support line:
        <a
          href="tel:1234-567-89-1234"
          class="text-blue-600 hover:text-blue-700 font-medium"
        >
          1234-567-89-1234
        </a>
      </p>
    </div>

    <!-- Limit Reached Modal -->
    <ReusableModal :is-open="showLimitModal" @close="closeLimitModal">
      <template #icon>
        <div
          class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto"
        >
          <svg
            class="w-10 h-10 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
      </template>

      <template #title> Report Limit Reached </template>

      <template #content>
        <p class="text-gray-600">
          You have reached the maximum limit of {{ MAX_REPORTS }} reports.
        </p>
        <p class="text-sm text-gray-500 mt-2">
          Please contact support if you need to submit additional reports.
        </p>
      </template>

      <template #actions>
        <button
          @click="closeLimitModal"
          class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Understand
        </button>
      </template>
    </ReusableModal>
  </div>
</template>

<script setup>
import StatsCard from "~/components/statusCard.vue";
import QuickActionButton from "~/components/quickActionsButtons.vue";
import ReportListItem from "~/components/reportListItem.vue";
import ReusableModal from "~/components/reusableModal.vue";
import { useAuthStore } from "~/stores/auth";
import { useReportStore } from "~/stores/reportsStore";

// nuxt specific
definePageMeta({
  middleware: "role-check",
  allowedRoles: ["user", "admin"],
});

useSeoMeta({
  title: "User Dashboard Page",
  description: "Add and view your disaster reports along with their status",
});
// No of reports limit for victims
const MAX_REPORTS = 1;

// Router & Stores
const store = useAuthStore();
const reportStore = useReportStore();

// State
const isLoading = ref(true);
const showLimitModal = ref(false);
const currentDate = ref("");

// Minimal computed properties - only for business logic
const isNewReportDisabled = computed(() => {
  return reportStore.reports?.total_reports?.length > 0;
});

const maskedPhoneNumber = computed(() => {
  const phone = reportStore.reports?.phone_number || "";
  if (phone.length <= 4) return phone;
  const visibleDigits = 4;
  const maskedPart = "*".repeat(phone.length - visibleDigits);
  return maskedPart + phone.slice(-visibleDigits);
});

// Methods
const refreshReports = async () => {
  isLoading.value = true;

  try {
    await reportStore.fetchReports();
  } catch (error) {
    console.error("Failed to refresh reports:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleNewReport = () => {
  if (isNewReportDisabled.value) {
    showLimitModal.value = true;
    return;
  }
  createNewReport();
};

const createNewReport = () => {
  navigateTo("/report");
};

const viewReport = (id) => {
  navigateTo(`/user/reports/${id}`);
};

const closeLimitModal = () => {
  showLimitModal.value = false;
};

const fetchReports = async () => {
  try {
    await reportStore.fetchReports();
  } catch (error) {
    console.error("Failed to load reports:", error);

    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      navigateTo("/login");
    }
  }
};

const initializeCurrentDate = () => {
  currentDate.value = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Lifecycle
onMounted(async () => {
  initializeCurrentDate();

  try {
    await store.userAuthStatus();
    await fetchReports();
    console.log(reportStore.reports);
  } catch (error) {
    console.error("Failed to initialize dashboard:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Custom animations */
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

.divide-y > div {
  animation: fadeIn 0.3s ease-out;
  animation-fill-mode: both;
}

/* Enhanced hover effects */
.group:hover .group-hover\:text-blue-600 {
  color: #2563eb;
}
</style>