<template>
  <section class="min-h-screen bg-gray-50">
    <!-- Header with Breadcrumb and Actions -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <!-- Header Content -->
        <div class="flex flex-col gap-3 sm:gap-4">
          <!-- Title and Status Row -->
          <div class="flex flex-wrap items-start gap-2">
            <h1
              class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex-1 min-w-[200px]"
            >
              Disaster Impact Report
            </h1>
            <span
              v-if="!error && selectedReport.verification_status"
              :class="[
                'inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm whitespace-nowrap',
                getStatusClasses(selectedReport.verification_status)
                  .split(' ')
                  .slice(1)
                  .join(' '),
              ]"
            >
              <span
                class="w-1.5 h-1.5 rounded-full mr-1 sm:mr-1.5"
                :class="{
                  'bg-yellow-400':
                    selectedReport.verification_status === 'pending',
                  'bg-green-400':
                    selectedReport.verification_status === 'verified',
                  'bg-red-400':
                    selectedReport.verification_status === 'rejected',
                }"
              ></span>
              {{ formatStatus(selectedReport.verification_status) }}
            </span>
          </div>

          <!-- Meta Info Row - Stack on mobile -->
          <div
            v-if="!error && selectedReport.submission_date"
            class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500"
          >
            <div class="flex items-center">
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0"
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
              <span class="truncate">{{
                formatDate(selectedReport.submission_date)
              }}</span>
            </div>
            <div class="flex items-center">
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="truncate"
                >{{ selectedReport.district }},
                {{ selectedReport.tehsil }}</span
              >
            </div>
            <div class="flex items-center">
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span class="truncate">#{{ selectedReport.report_id }}</span>
            </div>
          </div>

          <!-- Action Button - Full width on mobile -->
          <div
            v-if="!error && selectedReport.report_id"
            class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2"
          >
            <button
              @click="saveAsPDF(selectedReport.report_id)"
              :disabled="generating[selectedReport.report_id]"
              class="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-xl shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <!-- Loading Spinner (shows when generating[id] is true) -->
              <svg
                v-if="generating[selectedReport.report_id]"
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

              <!-- PDF Icon (shows when NOT loading) -->
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
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 15h6M9 11h6"
                />
              </svg>

              <span>{{
                generating[selectedReport.report_id]
                  ? "Generating..."
                  : "Save as PDF"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-if="error"
      class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8"
      >
        <div class="text-center">
          <!-- Error Icon -->
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
          >
            <svg
              class="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <!-- Error Message -->
          <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {{ error.title }}
          </h3>
          <p class="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
            {{ error.message }}
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              @click="retryLoadReport"
              class="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
            <NuxtLink
              to="/admin/reports"
              class="inline-flex items-center justify-center px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Reports
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div
        v-if="selectedReport && Object.keys(selectedReport).length > 0"
        class="space-y-4 sm:space-y-6"
      >
        <!-- Overview Stats Cards - 2 columns on mobile -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Disaster</p>
                <p
                  class="text-sm sm:text-lg font-semibold text-gray-900 truncate max-w-[80px] sm:max-w-none"
                >
                  {{ formatDisasterType(selectedReport.disaster_type) }}
                </p>
              </div>
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
              >
                {{ getDisasterEmoji(selectedReport.disaster_type) }}
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Humans</p>
                <p class="text-sm sm:text-lg font-semibold text-gray-900">
                  {{
                    selectedReport.are_humans_impacted === true
                      ? "Affected"
                      : "Not Affected"
                  }}
                </p>
              </div>
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 text-lg sm:text-xl flex-shrink-0"
              >
                👥
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Cattle</p>
                <p class="text-sm sm:text-lg font-semibold text-gray-900">
                  {{
                    selectedReport.are_animals_impacted === true
                      ? "Affected"
                      : "Not Affected"
                  }}
                </p>
              </div>
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 text-lg sm:text-xl flex-shrink-0"
              >
                🐄
              </div>
            </div>
          </div>

          <!-- Property card in overview stats -->
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Properties</p>
                <p
                  class="text-sm sm:text-lg font-semibold text-gray-900 truncate"
                  :title="propertyImpact"
                >
                  {{ propertyImpactShort }}
                </p>
              </div>
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 text-lg sm:text-xl flex-shrink-0 ml-2"
              >
                🏠
              </div>
            </div>
          </div>
        </div>

        <!-- Main Information Card -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <!-- Card Header with Tabs - Scrollable on mobile -->
          <div
            class="border-b border-gray-100 bg-gray-50/50 px-3 sm:px-6 py-3 sm:py-4"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <h2 class="text-base sm:text-lg font-semibold text-gray-900">
                Report Details
              </h2>
              <div
                class="flex gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 -mb-1 sm:mb-0"
              >
                <button
                  v-for="section in sections"
                  :key="section.id"
                  @click="activeSection = section.id"
                  :class="[
                    'px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                    activeSection === section.id
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50',
                  ]"
                >
                  {{ section.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-4 sm:p-6">
            <!-- Personal Information Section -->
            <div
              v-show="activeSection === 'personal'"
              class="space-y-4 sm:space-y-6"
            >
              <!-- Mobile: Stack vertically, Desktop: Grid -->
              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                <!-- Personal Info -->
                <div class="space-y-2 sm:space-y-3">
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Personal Info
                  </h3>
                  <div class="space-y-1.5 sm:space-y-2">
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Name</span>
                      <span
                        class="font-medium text-gray-900 capitalize truncate ml-2"
                        >{{ selectedReport.name || "N/A" }}</span
                      >
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Father</span>
                      <span
                        class="font-medium text-gray-900 capitalize truncate ml-2"
                        >{{ selectedReport.father_name || "N/A" }}</span
                      >
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">CNIC</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        selectedReport.cnic || "N/A"
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Phone</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        selectedReport.phone_number || "N/A"
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Email</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        selectedReport.email || "N/A"
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Location -->
                <div class="space-y-2 sm:space-y-3">
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </h3>
                  <div class="space-y-1.5 sm:space-y-2">
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">District</span>
                      <span
                        class="font-medium text-gray-900 capitalize truncate ml-2"
                        >{{ selectedReport.district || "N/A" }}</span
                      >
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Tehsil</span>
                      <span
                        class="font-medium text-gray-900 capitalize truncate ml-2"
                        >{{ selectedReport.tehsil || "N/A" }}</span
                      >
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Village</span>
                      <span
                        class="font-medium text-gray-900 capitalize truncate ml-2"
                        >{{ selectedReport.village || "N/A" }}</span
                      >
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Muhalla</span>
                      <span
                        class="font-medium text-gray-900 capitalize truncate ml-2"
                        >{{ selectedReport.muhalla || "N/A" }}</span
                      >
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">GPS</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        selectedReport.location || "N/A"
                      }}</span>
                    </div>
                  </div>
                  <button
                    v-if="selectedReport.location"
                    @click="openInMaps(selectedReport)"
                    class="mt-2 w-full inline-flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg
                      class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span class="hidden xs:inline">View on Maps</span>
                    <span class="xs:hidden">Maps</span>
                  </button>
                </div>

                <!-- Report Info -->
                <div class="space-y-2 sm:space-y-3">
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Report Info
                  </h3>
                  <div class="space-y-1.5 sm:space-y-2">
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Report ID</span>
                      <span class="font-medium text-gray-900 truncate ml-2"
                        >#{{ selectedReport.report_id }}</span
                      >
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Submitted</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        formatDate(selectedReport.submission_date)
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Status</span>
                      <span
                        :class="
                          getStatusClasses(selectedReport.verification_status)
                        "
                        class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2"
                      >
                        {{ formatStatus(selectedReport.verification_status) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Quick Impact -->
                <div class="space-y-2 sm:space-y-3">
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quick Impact
                  </h3>
                  <div class="space-y-1.5 sm:space-y-2">
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Deaths</span>
                      <span class="font-medium text-red-600">{{
                        selectedReport.deaths_count || 0
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Injured</span>
                      <span class="font-medium text-orange-600">{{
                        selectedReport.injured_count || 0
                      }}</span>
                    </div>
                    <!-- Dynamic Property Impact - Fixed overflow -->
                    <div
                      v-for="property in propertyDetails"
                      :key="property.impact_id"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span
                        class="text-gray-500 truncate max-w-[80px] sm:max-w-[100px]"
                        >{{ property.property_type }}</span
                      >
                      <span
                        class="font-medium text-gray-900 truncate ml-2 text-right"
                      >
                        {{ formatDamageLevelShort(property.impact_level) }}
                      </span>
                    </div>
                    <div
                      v-if="propertyDetails.length === 0"
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Properties</span>
                      <span class="font-medium text-gray-900 truncate ml-2"
                        >None affected</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Human Impact Section -->
            <div
              v-show="activeSection === 'human'"
              class="space-y-4 sm:space-y-6"
            >
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3"
                  >
                    Casualties
                  </h3>
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <div class="bg-red-50 rounded-xl p-3 sm:p-4">
                      <p class="text-xs text-gray-500 mb-1">Deaths</p>
                      <p class="text-xl sm:text-2xl font-bold text-red-600">
                        {{ selectedReport.deaths_count || 0 }}
                      </p>
                    </div>
                    <div class="bg-orange-50 rounded-xl p-3 sm:p-4">
                      <p class="text-xs text-gray-500 mb-1">Injured</p>
                      <p class="text-xl sm:text-2xl font-bold text-orange-600">
                        {{ selectedReport.injured_count || 0 }}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3"
                  >
                    Family Demographics
                  </h3>
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <div class="bg-white border rounded-xl p-2 sm:p-3">
                      <p class="text-xs text-gray-500">Residents</p>
                      <p
                        class="text-base sm:text-lg font-semibold text-gray-900"
                      >
                        {{ selectedReport.total_residents_count || 0 }}
                      </p>
                    </div>
                    <div class="bg-white border rounded-xl p-2 sm:p-3">
                      <p class="text-xs text-gray-500">Pregnant</p>
                      <p
                        class="text-base sm:text-lg font-semibold text-pink-600"
                      >
                        {{ selectedReport.pregnant_women_count || 0 }}
                      </p>
                    </div>
                    <div class="bg-white border rounded-xl p-2 sm:p-3">
                      <p class="text-xs text-gray-500">Disabled</p>
                      <p
                        class="text-base sm:text-lg font-semibold text-blue-600"
                      >
                        {{ selectedReport.disabled_persons_count || 0 }}
                      </p>
                    </div>
                    <div class="bg-white border rounded-xl p-2 sm:p-3">
                      <p class="text-xs text-gray-500">School</p>
                      <p
                        class="text-base sm:text-lg font-semibold text-green-600"
                      >
                        {{ selectedReport.school_going_children_count || 0 }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Property Impact Section - Updated to handle dynamic property details -->
            <div
              v-show="activeSection === 'property'"
              class="space-y-4 sm:space-y-6"
            >
              <div
                v-if="propertyDetails.length > 0"
                class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
              >
                <div
                  v-for="property in propertyDetails"
                  :key="property.impact_id"
                  class="space-y-3 sm:space-y-4"
                >
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ property.property_type }} Damage
                  </h3>
                  <div class="bg-white border rounded-xl p-3 sm:p-4">
                    <div
                      class="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-4"
                    >
                      <span
                        class="text-base sm:text-lg font-semibold text-gray-900"
                        >Damage Level</span
                      >
                      <span
                        :class="getDamageLevelClasses(property.impact_level)"
                        class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start xs:self-auto"
                      >
                        {{ formatDamageLevel(property.impact_level) }}
                      </span>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      {{ getDamageDescription(property.impact_level) }}
                    </p>

                    <div
                      v-if="property.PROPERTY_IMAGE_URL"
                      class="mt-3 sm:mt-4"
                    >
                      <p
                        class="text-xs sm:text-sm font-medium text-gray-700 mb-2"
                      >
                        Evidence
                      </p>
                      <div
                        @click="openImage(property.PROPERTY_IMAGE_URL)"
                        class="relative group"
                      >
                        <img
                          :src="property.PROPERTY_IMAGE_URL"
                          :alt="`${property.property_type} damage`"
                          class="w-full h-40 sm:h-48 object-cover rounded-lg cursor-pointer"
                          @error="
                            (e) =>
                              handleImageError(
                                e,
                                selectedReport.report_id,
                                property.property_type
                              )
                          "
                        />
                        <div
                          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No properties impacted message -->
              <div v-else class="text-center py-8 sm:py-12">
                <div class="text-gray-400 mb-2">
                  <svg
                    class="w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <p class="text-sm sm:text-base text-gray-500">
                  No properties reported as impacted
                </p>
              </div>

              <!-- Animal Impact Section -->
              <div
                v-if="selectedReport.are_animals_impacted"
                class="lg:col-span-2"
              >
                <h3
                  class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4"
                >
                  Animal Impact
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div class="bg-white border rounded-xl p-3 sm:p-4">
                    <h4
                      class="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base"
                    >
                      Large Animals
                    </h4>
                    <div class="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <p class="text-xs text-gray-500">Deaths</p>
                        <p
                          class="text-base sm:text-lg font-semibold text-red-600"
                        >
                          {{ selectedReport.big_animals_death_count || 0 }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Injured</p>
                        <p
                          class="text-base sm:text-lg font-semibold text-orange-600"
                        >
                          {{ selectedReport.big_animals_injured_count || 0 }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="bg-white border rounded-xl p-3 sm:p-4">
                    <h4
                      class="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base"
                    >
                      Small Animals
                    </h4>
                    <div class="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <p class="text-xs text-gray-500">Deaths</p>
                        <p
                          class="text-base sm:text-lg font-semibold text-red-600"
                        >
                          {{ selectedReport.small_animals_death_count || 0 }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Injured</p>
                        <p
                          class="text-base sm:text-lg font-semibold text-orange-600"
                        >
                          {{ selectedReport.small_animals_injured_count || 0 }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="mt-3 sm:mt-4 bg-green-50 border border-green-100 rounded-xl p-3 sm:p-4"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-xs sm:text-sm font-medium text-gray-700">
                        Total Animal Impact
                      </p>
                      <p class="text-xs text-gray-500">
                        {{ totalAnimalDeaths }} deaths,
                        {{ totalAnimalInjuries }} injured
                      </p>
                    </div>
                    <p class="text-lg sm:text-xl font-bold text-green-600">
                      {{ totalAnimalImpact }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Section - Simplified on mobile -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
        >
          <h3
            class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4"
          >
            Report Timeline
          </h3>
          <div
            class="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"
              ></div>
              <span class="text-xs text-gray-500"
                >Created: {{ formatDate(selectedReport.submission_date) }}</span
              >
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full flex-shrink-0"
                :class="
                  selectedReport.verification_status === 'pending'
                    ? 'bg-yellow-500'
                    : 'bg-blue-500'
                "
              ></div>
              <span class="text-xs text-gray-500"
                >Updated:
                {{
                  formatDate(
                    selectedReport.updated_at || selectedReport.submission_date
                  )
                }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center items-center py-12 sm:py-20">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-3 border-gray-200 border-t-blue-600 mb-3 sm:mb-4"
          ></div>
          <p class="text-sm sm:text-base text-gray-500">
            Loading report details...
          </p>
        </div>
      </div>
    </div>

    <!-- Image Modal - Mobile optimized -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-90 flex items-center justify-center p-2 sm:p-4"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl w-full" @click.stop>
        <button
          @click="closeImageModal"
          class="absolute text-white top-2 right-2 sm:top-4 sm:right-4 hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-1"
        >
          <svg
            class="w-6 h-6 sm:w-8 sm:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img
          :src="selectedImage"
          alt="Damage evidence"
          class="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAdminStore } from "~/stores/admin";

definePageMeta({
  middleware: "role-check",
  allowedRoles: ["admin", "super_admin"],
});

useSeoMeta({
  title: "Report Details",
  description: "View detailed disaster impact report information",
});
const store = useAdminStore();
const route = useRoute();
const selectedReport = ref({});
const loading = ref(true);
const error = ref(null);
const activeSection = ref("personal");
const showImageModal = ref(false);
const selectedImage = ref("");
const generating = ref({});

const sections = [
  { id: "personal", name: "Personal" },
  { id: "human", name: "Human Impact" },
  { id: "property", name: "Property" },
];

// Computed property for property details
const propertyDetails = computed(() => {
  return selectedReport.value?.property_details || [];
});

// Helper to get disaster type for descriptions
const currentDisasterType = computed(() => {
  return selectedReport.value?.disaster_type?.toLowerCase() || "unknown";
});

// Get emoji for disaster type
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
  return emojiMap[type?.toLowerCase()] || "🌪️";
};

const formatDisasterType = (type) => {
  if (!type) return "Unknown";
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getStatusClasses = (status) => {
  const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  switch (status?.toLowerCase()) {
    case "verified":
      return `${baseClasses} bg-green-100 text-green-800`;
    case "pending":
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case "rejected":
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

// Updated damage level formatting with disaster type awareness
const formatDamageLevel = (level) => {
  if (!level) return "None";

  const levelMap = {
    minor: "Minor Damage",
    major: "Major Damage",
    fully_destroyed: "Fully Destroyed",
  };

  return (
    levelMap[level?.toLowerCase()] ||
    level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
  );
};

// Short version for compact displays
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

// Disaster-type-aware damage description
const getDamageDescription = (level) => {
  const disasterType = currentDisasterType.value;
  const level_lower = level?.toLowerCase();

  // Base descriptions that will be customized based on disaster type
  const descriptions = {
    minor: {
      flood:
        "Minor water accumulation and silt deposits. Structure remains standing with minimal impact.",
      earthquake:
        "Minor structural cracks and non-structural damage. Building remains safe for occupancy.",
      fire: "Minor smoke damage and localized burning. Structure remains largely intact.",
      storm: "Minor damage to roof tiles, windows, or external fixtures.",
      landslide: "Minor debris accumulation around the structure.",
      default: "Minor damage that does not compromise structural integrity.",
    },
    major: {
      flood:
        "Significant water damage to walls and foundations. Extensive silt and debris accumulation.",
      earthquake:
        "Significant structural damage including wall cracks, foundation issues. Requires major repairs.",
      fire: "Extensive fire damage to structure. Major repairs needed before reoccupancy.",
      storm:
        "Major structural damage including roof collapse, wall damage from wind/debris.",
      landslide:
        "Partial structural damage from debris flow. Significant repair work required.",
      default: "Major structural damage requiring extensive repairs.",
    },
    fully_destroyed: {
      flood:
        "Complete structural failure due to water damage. Structure is uninhabitable/unusable.",
      earthquake:
        "Complete collapse or severe structural failure. Structure is unsafe for any use.",
      fire: "Complete destruction by fire. Structure is a total loss.",
      storm:
        "Complete destruction by wind or debris. Structure is beyond repair.",
      landslide:
        "Structure completely buried or destroyed by landslide. Total loss.",
      default:
        "Complete destruction. Structure is beyond repair or reconstruction.",
    },
  };

  // Get disaster-specific description or fall back to default
  const disasterDescriptions = descriptions[level_lower];
  if (disasterDescriptions) {
    return disasterDescriptions[disasterType] || disasterDescriptions.default;
  }

  return "Damage level unknown";
};

// Damage level color classes
const getDamageLevelClasses = (level) => {
  const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
  switch (level?.toLowerCase()) {
    case "minor":
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case "major":
      return `${baseClasses} bg-orange-100 text-orange-800`;
    case "fully_destroyed":
      return `${baseClasses} bg-red-100 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

const totalHumanImpact = computed(() => {
  return (
    (selectedReport.value?.deaths_count || 0) +
    (selectedReport.value?.injured_count || 0)
  );
});

const totalAnimalDeaths = computed(() => {
  return (
    (selectedReport.value?.big_animals_death_count || 0) +
    (selectedReport.value?.small_animals_death_count || 0)
  );
});

const totalAnimalInjuries = computed(() => {
  return (
    (selectedReport.value?.big_animals_injured_count || 0) +
    (selectedReport.value?.small_animals_injured_count || 0)
  );
});

const totalAnimalImpact = computed(() => {
  return totalAnimalDeaths.value + totalAnimalInjuries.value;
});

const propertyImpact = computed(() => {
  const impactedTypes = propertyDetails.value.map((p) => p.property_type);
  if (impactedTypes.length === 0) return "None";
  return impactedTypes.join(", ");
});

const propertyImpactShort = computed(() => {
  const types = propertyDetails.value.map((p) => p.property_type);
  if (types.length === 0) return "Not Affected";
  if (types.length === 1) return types[0];
  if (types.length === 2) return `${types[0]} + ${types[1]}`;
  return `${types[0]} + ${types.length - 1} more`;
});

const openImage = (imageUrl) => {
  if (imageUrl) {
    selectedImage.value = imageUrl;
    showImageModal.value = true;
  }
};

const closeImageModal = () => {
  showImageModal.value = false;
  selectedImage.value = "";
};

const handleImageError = (event, reportId, type) => {
  console.error(`Failed to load ${type} image for report ${reportId}`);
  event.target.src = "/placeholder-image.jpg";
  event.target.onerror = null;
};

// Validate report ID parameter
const validateReportId = (id) => {
  if (!id) {
    return {
      valid: false,
      error: {
        title: "Missing Report ID",
        message:
          "No report ID was provided. Please select a report from the reports list.",
      },
    };
  }

  const numericId = Number(id);
  if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
    return {
      valid: false,
      error: {
        title: "Invalid Report ID",
        message: `"${id}" is not a valid report ID. Report IDs must be positive whole numbers. Please check the URL and try again.`,
      },
    };
  }

  return {
    valid: true,
    numericId,
  };
};

// Extract error message from API response
const extractErrorMessage = (errorResponse) => {
  // Check if it's an axios error with response data
  if (errorResponse?.response?.data) {
    const data = errorResponse.response.data;

    // Check if it has the expected structure
    if (data.status === "error" && data.message) {
      return {
        title: `Error ${data.statusCode || "Unknown"}`,
        message: data.message,
      };
    }

    // If it has a different error structure
    if (data.message) {
      return {
        title: "Error",
        message: data.message,
      };
    }
  }

  // Check for network errors
  if (errorResponse?.message === "Network Error") {
    return {
      title: "Network Error",
      message:
        "Unable to connect to the server. Please check your internet connection and try again.",
    };
  }

  // Timeout errors
  if (errorResponse?.code === "ECONNABORTED") {
    return {
      title: "Request Timeout",
      message: "The request took too long to complete. Please try again later.",
    };
  }

  // Generic fallback
  return {
    title: "Unexpected Error",
    message:
      errorResponse?.message ||
      "An unexpected error occurred while loading the report. Please try again.",
  };
};

const loadReportData = async () => {
  loading.value = true;
  error.value = null;

  // Validate the report ID first
  const validation = validateReportId(route.params.id);
  if (!validation.valid) {
    error.value = validation.error;
    loading.value = false;
    return;
  }

  try {
    const response = await store.fetchSingleReport(validation.numericId);

    // Check if response is valid
    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format from server");
    }

    // Check if response has error status
    if (response.status === "error") {
      error.value = {
        title: `Error ${response.statusCode || ""}`,
        message: response.message || "Failed to load the requested report.",
      };
      loading.value = false;
      return;
    }

    selectedReport.value = response;
    loading.value = false;
  } catch (err) {
    console.error("Error loading report:", err);

    // Extract meaningful error message
    const errorInfo = extractErrorMessage(err);

    // Handle 404 specifically
    if (
      err?.response?.status === 404 ||
      err?.response?.data?.statusCode === 404
    ) {
      errorInfo.title = "Report Not Found";
      errorInfo.message =
        err?.response?.data?.message ||
        "The requested report could not be found. It may have been deleted or the ID might be incorrect.";
    }

    error.value = errorInfo;
    loading.value = false;
  }
};

const retryLoadReport = () => {
  loadReportData();
};

const openInMaps = (report) => {
  if (!report.location) return;

  const coords = report.location.split(",").map((coord) => coord.trim());
  if (coords.length !== 2) return;

  const lat = parseFloat(coords[0]);
  const lng = parseFloat(coords[1]);

  if (
    isNaN(lat) ||
    isNaN(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    console.error("Invalid coordinates");
    return;
  }

  const encodedUrl = encodeURI(`https://www.google.com/maps?q=${lat},${lng}`);
  navigateTo(encodedUrl, "_blank", "noopener,noreferrer");
};

const saveAsPDF = async (reportId) => {
  if (!reportId) {
    console.error("No report ID provided for PDF generation");
    return;
  }

  generating.value[reportId] = true;
  try {
    const result = await store.downloadReportInPDF(reportId);

    // Check if the result indicates an error
    if (result?.status === "error") {
      throw new Error(result.message || "Failed to generate PDF");
    }
    console.log(result);
  } catch (error) {
    console.error("PDF generation error:", error);

    // Extract error message for PDF generation
    let errorMessage = "Failed to generate PDF. Please try again.";

    if (error?.response?._data?.message) {
      errorMessage = error.response._data.message;
      alert(errorMessage);
    } else if (error?.message) {
      errorMessage = error.message;
    }

    // You might want to show this error to the user via a toast or alert
    // For now, we'll log it and you can add a toast notification system
    alert("Unable to download pdf");
  } finally {
    generating.value[reportId] = false;
  }
};

onMounted(() => {
  loadReportData();
});
</script>

<style scoped>
/* Fix overflow in quick impact section */
.space-y-1\.5 > div {
  min-width: 0; /* Allow flex children to shrink */
}

/* Better text truncation */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Ensure proper spacing on mobile */
@media (max-width: 640px) {
  .space-y-1\.5 > div {
    gap: 0.5rem;
  }
}

/* Error state animations */
.error-enter-active,
.error-leave-active {
  transition: opacity 0.3s ease;
}

.error-enter-from,
.error-leave-to {
  opacity: 0;
}
</style>