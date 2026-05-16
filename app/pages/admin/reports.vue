<template>
  <div class="min-h-scree bg-gray-50 p-4 md:p-6">
    <!-- ERROR BOUNDARY -->
    <div v-if="hasError" class="bg-red-50 p-6 rounded-xl text-center">
      <h2 class="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p class="text-red-600 mt-2">{{ errorMessage }}</p>
      <button
        @click="resetError"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Try Again
      </button>
    </div>

    <!-- LIST VIEW -->
    <div v-else-if="viewMode === 'list'">
      <!-- Header -->
      <div class="mb-8">
        <!-- Main header section with responsive stacking -->
        <div
          class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <!-- Left side: Title and Dashboard navigation -->
          <div class="flex flex-col xs:flex-row xs:items-center gap-3">
            <div>
              <h1
                class="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900"
              >
                Disaster Reports
              </h1>
              <p class="text-sm sm:text-base text-gray-600 mt-1 md:mt-2">
                Manage and review all submitted reports
              </p>
            </div>

            <!-- Dashboard Navigation Button - responsive -->
            <NuxtLink
              to="/admin/dashboard"
              class="inline-flex items-center justify-center xs:justify-start px-4 py-2.5 sm:py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full xs:w-auto mt-2 xs:mt-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>View Dashboard</span>
            </NuxtLink>
          </div>

          <!-- Right side: Actions and counter - stacked on mobile -->
          <div
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <!-- Refresh Button - full width on mobile -->
            <button
              @click="refreshReports"
              :disabled="loading || refreshing"
              :aria-label="loading ? 'Loading reports' : 'Refresh reports'"
              :aria-busy="loading.toString()"
              class="px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto"
            >
              <svg
                v-if="loading || refreshing"
                class="animate-spin h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <svg
                v-else
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>

            <!-- Counter - centered on mobile -->
            <div
              class="text-sm text-gray-500 text-center sm:text-right px-2 py-1 bg-gray-50 rounded-lg sm:bg-transparent"
              aria-live="polite"
            >
              Showing {{ filteredReports.length }} of {{ totalReports }} reports
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2
          class="text-lg font-semibold text-gray-800 mb-4"
          id="filters-heading"
        >
          Filters
        </h2>

        <div
          class="grid grid-cols-1 md:grid-cols-4 gap-4"
          role="group"
          aria-labelledby="filters-heading"
        >
          <!-- District Filter -->
          <div>
            <label
              for="district-filter"
              class="block text-sm font-medium text-gray-700 mb-2"
              >District</label
            >
            <select
              id="district-filter"
              v-model="filters.district"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            >
              <option value="">All Districts</option>
              <option
                v-for="district in uniqueDistricts"
                :key="district"
                :value="district"
                class="capitalize"
              >
                {{ district }}
              </option>
            </select>
          </div>

          <!-- Tehsil Filter -->
          <div>
            <label
              for="tehsil-filter"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Tehsil</label
            >
            <select
              id="tehsil-filter"
              v-model="filters.tehsil"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="!filters.district"
              @change="debouncedFilter"
            >
              <option value="">All Tehsils</option>
              <option
                class="capitalize"
                v-for="tehsil in filteredTehsils"
                :key="tehsil"
                :value="tehsil"
              >
                {{ tehsil }}
              </option>
            </select>
          </div>

          <!-- Disaster Type Filter -->
          <div>
            <label
              for="disaster-filter"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Disaster Type
            </label>
            <select
              id="disaster-filter"
              v-model="filters.disasterType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            >
              <option value="">All Types</option>
              <option
                v-for="type in disasterTypes"
                :key="type.value"
                :value="type.value"
              >
                {{ type.emoji }} {{ type.label }}
              </option>
            </select>
          </div>

          <!-- Verification Status Filter -->
          <div>
            <label
              for="status-filter"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Status</label
            >
            <select
              id="status-filter"
              v-model="filters.verificationStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            >
              <option value="">All Status</option>
              <option
                v-for="status in dynamicStatus"
                :key="status"
                :value="status.value"
              >
                {{ status.emoji }} {{ status.formated }}
              </option>
              <!-- <option value="">All Status</option>
              <option value="verified">✅ Verified</option>
              <option value="pending">⏳ Pending</option>
              <option value="rejected">❌ Rejected</option> -->
            </select>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              for="from-date"
              class="block text-sm font-medium text-gray-700 mb-2"
              >From Date</label
            >
            <input
              id="from-date"
              type="date"
              v-model="filters.fromDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            />
          </div>
          <div>
            <label
              for="to-date"
              class="block text-sm font-medium text-gray-700 mb-2"
              >To Date</label
            >
            <input
              id="to-date"
              type="date"
              v-model="filters.toDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Reports Table -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Table Header -->
        <div
          class="px-6 py-4 border-b border-gray-200 flex items-center justify-between"
        >
          <h3 class="text-lg font-semibold text-gray-800">All Reports</h3>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500" id="sort-label">Sort by:</span>
            <select
              v-model="sortBy"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              aria-labelledby="sort-label"
              @change="currentPage = 1"
            >
              <option value="created_at">Date (Newest)</option>
              <option value="created_at_asc">Date (Oldest)</option>
              <option value="deaths_count">Deaths (High-Low)</option>
              <option value="district">District (A-Z)</option>
            </select>
          </div>
        </div>

        <!-- loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="n in 5" :key="n" class="animate-pulse">
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>

        <!-- Empty State -->
        <EmptyState
          v-else-if="filteredReports.length === 0"
          @clearFilters="clearFilters"
        />

        <!-- Reports Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Impact
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="report in paginatedReports"
                :key="report.report_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    #{{ report.report_id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ formatDate(report.submission_date) }}
                  </div>
                  <div class="text-sm text-gray-500 flex items-center mt-1">
                    <span class="mr-2" aria-hidden="true">{{
                      getDisasterEmoji(report.disaster_type)
                    }}</span>
                    {{ formatDisasterType(report.disaster_type) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 capitalize">
                    {{ report.tehsil || "N/A" }}
                  </div>
                  <div class="text-sm text-gray-500 capitalize">
                    {{ report.district || "N/A" }}
                  </div>
                  <div class="text-xs text-gray-400 mt-1 capitalize">
                    {{ report.village || "N/A" }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <!-- Human Impact -->
                    <div
                      v-if="report.deaths_count > 0 || report.injured_count > 0"
                      class="flex items-center text-sm"
                    >
                      <span class="text-red-600 mr-2" aria-hidden="true"
                        >💀</span
                      >
                      <span class="font-medium">
                        {{
                          report.deaths_count > 0
                            ? `${report.deaths_count} deaths`
                            : ""
                        }}
                        {{
                          report.deaths_count > 0 && report.injured_count > 0
                            ? ", "
                            : ""
                        }}
                        {{
                          report.injured_count > 0
                            ? `${report.injured_count} injured`
                            : ""
                        }}
                      </span>
                    </div>

                    <!-- Dynamic Property Impact -->
                    <div
                      v-if="
                        report.property_details &&
                        report.property_details.length > 0
                      "
                    >
                      <div
                        v-for="property in getTopProperties(
                          report.property_details,
                          2
                        )"
                        :key="property.impact_id"
                        class="flex items-center text-sm mb-1"
                      >
                        <span class="mr-2" aria-hidden="true">{{
                          getPropertyEmoji(property.property_type)
                        }}</span>
                        <span class="font-medium truncate max-w-[150px]">
                          {{ property.property_type }}:
                          {{ formatDamageLevelShort(property.impact_level) }}
                        </span>
                      </div>
                      <div
                        v-if="report.property_details.length > 2"
                        class="text-xs text-gray-500 mt-1"
                      >
                        +{{ report.property_details.length - 2 }} more
                        properties
                      </div>
                    </div>

                    <!-- Animal Impact -->
                    <div
                      v-if="report.are_animals_impacted"
                      class="flex items-center text-sm"
                    >
                      <span class="text-green-600 mr-2" aria-hidden="true"
                        >🐄</span
                      >
                      <div class="font-medium flex flex-col gap-1">
                        <span>
                          {{
                            (report.big_animals_death_count || 0) +
                            (report.small_animals_death_count || 0)
                          }}
                          lost,</span
                        >
                        <span>
                          {{
                            (report.big_animals_injured_count || 0) +
                            (report.small_animals_injured_count || 0)
                          }}
                          injured.</span
                        >
                      </div>
                    </div>

                    <!-- No Impact Message -->
                    <div
                      v-if="
                        !report.deaths_count &&
                        !report.injured_count &&
                        (!report.property_details ||
                          report.property_details.length === 0) &&
                        !report.are_animals_impacted
                      "
                      class="text-sm text-gray-400"
                    >
                      No significant impact reported
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClasses(report.verification_status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ formatStatus(report.verification_status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewReport(report.report_id)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    @click="navigateToUpdateReportPage(report.report_id)"
                    class="text-orange-600 hover:text-orange-900 mr-4"
                  >
                    Update
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredReports.length > 0"
          class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
        >
          <div class="text-sm text-gray-700">
            Showing {{ paginationStart }} to {{ paginationEnd }} of
            {{ filteredReports.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import EmptyState from "~/components/emptyState.vue";
import { useAdminStore } from "~/stores/admin";
// for cleanup
let stopWatch = null;
// ============= Nuxt specific =============
definePageMeta({
  middleware: "role-check",
  allowedRoles: ["admin", "super_admin"],
  layout: "admin",
});
useSeoMeta({
  title: "Reports Page - Disaster Management",
  description:
    "View and manage all disaster reports submitted by affected peoples",
});

// ============= STORE =============
const store = useAdminStore();

// ============= CONSTANTS (Static configs only) =============
const STATUS_CONFIG = Object.freeze({
  verified: {
    label: "Verified",
    class: "bg-green-100 text-green-800",
    emoji: "✅",
  },
  pending: {
    label: "Pending",
    class: "bg-yellow-100 text-yellow-800",
    emoji: "⏳",
  },
  rejected: {
    label: "Rejected",
    class: "bg-red-100 text-red-800",
    emoji: "❌",
  },
});

const DAMAGE_LEVELS = Object.freeze({
  minor: {
    label: "Only water & silt",
    class: "bg-yellow-100 text-yellow-800",
    description: "Water & silt damage only",
  },
  major: {
    label: "Minor Damage",
    class: "bg-orange-100 text-orange-800",
    description: "1 room or boundary wall damaged",
  },
  fully_destroyed: {
    label: "Complete Destruction",
    class: "bg-red-100 text-red-800",
    description: "2 or more rooms completely destroyed",
  },
});
// Helper function to get property type emoji
const getPropertyEmoji = (propertyType) => {
  const emojiMap = {
    Home: "🏠",
    Shop: "🏪",
    Warehouse: "🏭",
    Farm: "🌾",
    "Farm/Field": "🌾",
    Field: "🌾",
    Vehicle: "🚗",
    "Livestock Shed": "🐄",
    School: "🏫",
    Mosque: "🕌",
    Hospital: "🏥",
    Office: "🏢",
    Factory: "🏭",
    Other: "📦",
  };
  return emojiMap[propertyType] || "🏚️";
};
// ✅ DYNAMIC: Get emoji for disaster type
const getDisasterEmoji = (type) => {
  const emojiMap = {
    flood: "🌊",
    fire: "🔥",
    land_slide: "🏔️",
    landslide: "🏔️",
    earthquake: "🌋",
    storm: "🌪️",
    drought: "🏜️",
    cyclone: "🌀",
    tornado: "🌪️",
    tsunami: "🌊",
    volcano: "🌋",
    epidemic: "🦠",
    famine: "🍽️",
    accident: "🚗",
    industrial: "🏭",
    war: "💥",
    terror: "💣",
    other: "⚠️",
  };

  return emojiMap[type.toLowerCase()] || "🌪️";
};
const getReportStatusEmoji = (status) => {
  const emojiMap = {
    pending: "⏳",
    verified: "✅",
    rejected: "❌",
  };

  return emojiMap[status] || "⚠️";
};

// Helper to get top N properties (for display in table)
const getTopProperties = (properties, limit) => {
  if (!properties || properties.length === 0) return [];
  return properties.slice(0, limit);
};

// Format damage level short version for table
const formatDamageLevelShort = (level) => {
  if (!level) return "None";

  const shortMap = {
    minor: "Minor",
    major: "Major",
    fully_destroyed: "Destroyed",
  };

  return (
    shortMap[level?.toLowerCase()] ||
    level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
  );
};

// ============= STATE =============
// Error Handling
const hasError = ref(false);
const errorMessage = ref("");

// View Mode
const viewMode = ref("list");
const selectedReport = ref(null);

// UI State
const loading = ref(false);
const refreshing = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortBy = ref("created_at");

// Debounce Timer
let filterTimeout = null;

// Filters
const filters = ref({
  district: "",
  tehsil: "",
  disasterType: "",
  verificationStatus: "",
  fromDate: "",
  toDate: "",
});

// ============= COMPUTED =============

// ✅ FIXED - Maps report_status to verification_status
const reports = computed(() => {
  return (store.reports || []).map((report) => ({
    ...report,
    // 🎯 CRITICAL: Map the status field
    verification_status:
      report.verification_status || report.report_status || "pending",
    // Optional: cache timestamp for performance
    _timestamp: new Date(report.submission_date).getTime(),
  }));
});

const totalReports = computed(() => reports.value.length);

// ============= DYNAMIC DROPDOWN VALUES =============

// ✅ DYNAMIC: Unique districts from actual data
const uniqueDistricts = computed(() => {
  const districts = new Set();
  reports.value.forEach((report) => {
    if (report.district) districts.add(report.district);
  });
  return Array.from(districts).sort();
});
// unique reports status dynmic from data
const dynamicStatus = computed(() => {
  const status = new Set();
  reports.value.forEach((report) => {
    if (report.verification_status) status.add(report.verification_status);
  });
  return Array.from(status)
    .sort()
    .map((report) => ({
      value: report,
      formated: formatReportStatus(report),
      emoji: getReportStatusEmoji(report),
    }));
});

// ✅ DYNAMIC: Unique tehsils filtered by district
const filteredTehsils = computed(() => {
  if (!filters.value.district) {
    const tehsils = new Set();
    reports.value.forEach((report) => {
      if (report.tehsil) tehsils.add(report.tehsil);
    });
    return Array.from(tehsils).sort();
  }

  const tehsils = new Set();
  reports.value.forEach((report) => {
    if (report.district === filters.value.district && report.tehsil) {
      tehsils.add(report.tehsil);
    }
  });
  return Array.from(tehsils).sort();
});

// ✅ DYNAMIC: Unique disaster types from actual data with emojis
const disasterTypes = computed(() => {
  const types = new Set();
  reports.value.forEach((report) => {
    if (report.disaster_type) types.add(report.disaster_type);
  });

  // Convert to array with emojis
  return Array.from(types)
    .sort()
    .map((type) => ({
      value: type,
      label: formatDisasterType(type),
      emoji: getDisasterEmoji(type),
    }));
});

// Filter reports
const filteredReports = computed(() => {
  return reports.value.filter((report) => {
    // District filter
    if (filters.value.district && report.district !== filters.value.district) {
      return false;
    }

    // Tehsil filter
    if (filters.value.tehsil && report.tehsil !== filters.value.tehsil) {
      return false;
    }

    // ✅ DYNAMIC: Disaster type filter
    if (
      filters.value.disasterType &&
      report.disaster_type !== filters.value.disasterType
    ) {
      return false;
    }

    // Status filter
    if (
      filters.value.verificationStatus &&
      report.verification_status !== filters.value.verificationStatus
    ) {
      return false;
    }
    // Date range filter - USE CACHED TIMESTAMP
    if (filters.value.fromDate || filters.value.toDate) {
      // ✅ Use _timestamp instead of creating new Date()
      if (filters.value.fromDate) {
        const fromTime = new Date(filters.value.fromDate).setHours(0, 0, 0, 0);
        if (report._timestamp < fromTime) return false;
      }

      if (filters.value.toDate) {
        const toTime = new Date(filters.value.toDate).setHours(23, 59, 59, 999);
        if (report._timestamp > toTime) return false;
      }
    }

    return true;
  });
});

// Sorted reports
const sortedReports = computed(() => {
  const sorted = [...filteredReports.value];

  switch (sortBy.value) {
    case "created_at":
      return sorted.sort(
        (a, b) =>
          new Date(b.submission_date).getTime() -
          new Date(a.submission_date).getTime()
      );
    case "created_at_asc":
      return sorted.sort(
        (a, b) =>
          new Date(a.submission_date).getTime() -
          new Date(b.submission_date).getTime()
      );
    case "deaths_count":
      return sorted.sort(
        (a, b) => (b.deaths_count || 0) - (a.deaths_count || 0)
      );
    case "district":
      return sorted.sort((a, b) =>
        (a.district || "").localeCompare(b.district || "")
      );
    default:
      return sorted;
  }
});
// Pagination
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return sortedReports.value.slice(start, start + itemsPerPage.value);
});

const totalPages = computed(
  () => Math.ceil(filteredReports.value.length / itemsPerPage.value) || 1
);

const paginationStart = computed(() =>
  filteredReports.value.length
    ? (currentPage.value - 1) * itemsPerPage.value + 1
    : 0
);

const paginationEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredReports.value.length)
);
// ============= FORMATTING FUNCTIONS =============

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Invalid Date";
  }
};

// ✅ DYNAMIC: Format disaster type with proper capitalization
const formatDisasterType = (type) => {
  if (!type) return "Unknown";

  // Convert snake_case to Title Case
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatReportStatus = (status) => {
  if (!status) return "Unknown";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDamageLevel = (level) => {
  return DAMAGE_LEVELS[level]?.label || level || "Unknown";
};

const formatStatus = (status) => {
  return STATUS_CONFIG[status]?.label || status || "Unknown";
};

const getStatusClasses = (status) => {
  return STATUS_CONFIG[status]?.class || "bg-gray-100 text-gray-800";
};

// ============= METHODS =============

const debouncedFilter = () => {
  if (filterTimeout) clearTimeout(filterTimeout);
  filterTimeout = setTimeout(() => {
    currentPage.value = 1;
  }, 300);
};

const fetchReports = async (showRefreshing = false) => {
  if (showRefreshing) {
    refreshing.value = true;
  } else {
    loading.value = true;
  }

  try {
    await store.fetchAllReports();

    currentPage.value = 1;
    hasError.value = false;
    errorMessage.value = "";
  } catch (error) {
    console.error("Fetch reports error:", error);
    hasError.value = true;
    errorMessage.value =
      error.response?._data?.message || "Failed to load reports";
  } finally {
    loading.value = false;
    refreshing.value = false;
  }
};

const refreshReports = () => fetchReports(true);

const clearFilters = () => {
  filters.value = {
    district: "",
    tehsil: "",
    disasterType: "",
    verificationStatus: "",
    fromDate: "",
    toDate: "",
  };
  currentPage.value = 1;
};

const viewReport = (reportId) => {
  navigateTo(`/admin/report/${reportId}`, { open: { target: "_blank" } });
};
const navigateToUpdateReportPage = (reportId) => {
  navigateTo(`/admin/update-report/${reportId}`, {
    open: { target: "_blank" },
  });
};

const resetError = () => {
  hasError.value = false;
  errorMessage.value = "";
  fetchReports();
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// ============= WATCHERS =============
stopWatch = watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ============= LIFECYCLE =============
onMounted(async () => {
  await fetchReports();
});

onUnmounted(() => {
  if (filterTimeout) {
    clearTimeout(filterTimeout);
  }
  if (stopWatch) {
    stopWatch();
  }
});
</script>

<style scoped>
/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Hover effects */
tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: #f9fafb;
}

/* Aspect ratio for images */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Focus styles for accessibility */
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }

  table {
    font-size: 0.875rem;
  }

  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .grid {
    gap: 1rem;
  }

  .p-6 {
    padding: 1rem;
  }

  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}
</style>