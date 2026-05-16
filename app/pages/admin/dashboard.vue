<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Header with Navigation Tabs -->
    <div class="mb-8">
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6"
      >
        <!-- Left Section: Title + Action -->
        <div class="flex flex-col xs:flex-row xs:items-center gap-4">
          <h1
            class="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
          >
            Disaster Response Dashboard
          </h1>
          <NuxtLink
            to="/admin/reports"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full xs:w-auto"
          >
            <svg
              class="w-4 h-4"
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
            <span>View Reports</span>
          </NuxtLink>
        </div>

        <!-- Right Section: Live Status + Timestamp -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
              ></span>
            </span>
            <span
              class="text-xs font-medium text-gray-500 uppercase tracking-wider"
              >Live</span
            >
          </div>
          <div class="h-4 w-px bg-gray-200"></div>
          <div class="flex items-center gap-2">
            <svg
              class="w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="text-sm text-gray-600 font-mono">{{
              currentTime
            }}</span>
          </div>
        </div>
      </div>

      <!-- Description paragraph - responsive text -->
      <p class="text-sm sm:text-base text-gray-600 mt-1 mb-4">
        Comprehensive disaster impact analysis across all districts
      </p>

      <!-- Navigation Tabs - scrollable on mobile -->
      <div class="overflow-x-auto pb-1 -mx-2 px-2">
        <div class="flex space-x-1 border-b min-w-max">
          <button
            @click="activeTab = 'global'"
            :class="[
              'px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-colors whitespace-nowrap',
              activeTab === 'global'
                ? 'bg-white border border-gray-300 border-b-0 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ]"
            :disabled="hasError"
          >
            🌍 Global Overview
          </button>
          <button
            @click="activeTab = 'districts'"
            :class="[
              'px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-colors whitespace-nowrap',
              activeTab === 'districts'
                ? 'bg-white border border-gray-300 border-b-0 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ]"
            :disabled="hasError"
          >
            🏙️ Districts
          </button>
          <button
            @click="activeTab = 'tehsils'"
            :class="[
              'px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-colors whitespace-nowrap',
              activeTab === 'tehsils'
                ? 'bg-white border border-gray-300 border-b-0 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ]"
            :disabled="hasError"
          >
            🏘️ Tehsils
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"
        ></div>
        <p class="text-lg text-gray-500">Loading disaster data...</p>
        <p class="text-sm text-gray-400 mt-2">
          Fetching analytics from all districts
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="hasError"
      class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8"
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
          {{ error.title || "Error Loading Dashboard" }}
        </h3>
        <p class="text-sm sm:text-base text-gray-600 mb-2 max-w-md mx-auto">
          {{
            error.message ||
            "An unexpected error occurred while loading the dashboard data."
          }}
        </p>

        <!-- Error Details (if available) -->
        <div
          v-if="error.details"
          class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-w-md mx-auto"
        >
          <p class="text-xs text-gray-500 font-mono break-all">
            {{ error.details }}
          </p>
        </div>

        <!-- Resolution Suggestion -->
        <div
          v-if="error.suggestion"
          class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 max-w-md mx-auto"
        >
          <p class="text-sm text-blue-700 flex items-start">
            <svg
              class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ error.suggestion }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            @click="retryFetchData"
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
            Retry Loading
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
            Go to Reports
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Global Overview Tab -->
    <div v-else-if="activeTab === 'global' && dashboardData.length > 0">
      <!-- Global Stats -->
      <div class="mb-8">
        <!-- Stats Grid -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5"
        >
          <!-- 1. Reports Card -->
          <div
            class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 hover:-translate-y-0.5"
          >
            <div class="flex justify-between items-start mb-3">
              <div
                class="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <span
                class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider"
                >Reports</span
              >
            </div>
            <div class="text-3xl font-black text-gray-900 tracking-tight">
              {{ globalStats.totalReports.toLocaleString() }}
            </div>
            <div class="mt-3 flex items-center gap-1.5">
              <span
                class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"
              ></span>
              <span class="text-xs font-semibold text-gray-600"
                >{{ dashboardData.length }} Districts Active</span
              >
            </div>
          </div>

          <!-- 2. Human Casualties Card -->
          <div
            class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 hover:-translate-y-0.5"
          >
            <div class="flex justify-between items-start mb-3">
              <div
                class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <span
                class="text-[10px] font-bold text-red-500 uppercase tracking-wider"
                >Human</span
              >
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-red-600 tracking-tight">{{
                globalStats.totalDeaths.toLocaleString()
              }}</span>
              <span class="text-xs text-gray-400">deaths</span>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <span
                class="text-sm font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full"
              >
                + {{ globalStats.totalInjuries.toLocaleString() }} injured
              </span>
            </div>
          </div>

          <!-- 3. Vulnerable Groups Card -->
          <div
            class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 hover:-translate-y-0.5"
          >
            <div class="flex justify-between items-start mb-3">
              <div
                class="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>
              <span
                class="text-[10px] font-bold text-pink-500 uppercase tracking-wider"
                >Vulnerable</span
              >
            </div>
            <div class="space-y-2">
              <div class="flex justify-between items-baseline">
                <span class="text-xs text-gray-500">Pregnant women</span>
                <span class="text-base font-bold text-gray-800">{{
                  globalStats.totalPregnant.toLocaleString()
                }}</span>
              </div>
              <div class="flex justify-between items-baseline">
                <span class="text-xs text-gray-500">School children</span>
                <span class="text-base font-bold text-gray-800">{{
                  globalStats.totalSchoolGoingChildren.toLocaleString()
                }}</span>
              </div>
              <div
                class="flex justify-between items-baseline bg-purple-50 p-2 rounded-lg -mx-1"
              >
                <span class="text-xs font-semibold text-purple-700"
                  >Disabled persons</span
                >
                <span class="text-base font-bold text-purple-800">{{
                  globalStats.totalDisabled.toLocaleString()
                }}</span>
              </div>
            </div>
          </div>

          <!-- 4. Crisis-Affected Card -->
          <div
            class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 hover:-translate-y-0.5"
          >
            <div class="flex justify-between items-start mb-3">
              <div
                class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <span
                class="text-[10px] font-bold text-purple-500 uppercase tracking-wider"
                >Population</span
              >
            </div>
            <div class="text-3xl font-black text-purple-700 tracking-tight">
              {{ globalStats.totalResidents.toLocaleString() }}
            </div>
            <div class="mt-2">
              <span
                class="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full"
              >
                {{ globalStats.totalMerriedCouples.toLocaleString() }}
                households
              </span>
            </div>
            <div class="mt-2 text-[10px] text-gray-400">
              People in districts with reported injuries
            </div>
          </div>

          <!-- 5. Properties Destroyed Card -->
          <div
            class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 hover:-translate-y-0.5"
          >
            <div class="flex justify-between items-start mb-3">
              <div
                class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </div>
              <span
                class="text-[10px] font-bold text-sky-500 uppercase tracking-wider"
                >Properties</span
              >
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-sky-600 tracking-tight">{{
                globalStats.totalFullyDestroyedProperties.toLocaleString()
              }}</span>
              <span class="text-xs text-gray-400">fully destroyed</span>
            </div>
            <div class="mt-2 pt-2 border-t border-gray-100 space-y-1">
              <div class="flex justify-between text-xs">
                <span class="text-gray-500">Total impacted</span>
                <span class="font-bold">{{
                  globalStats.totalPropertiesImpacted.toLocaleString()
                }}</span>
              </div>
              <div class="flex justify-between text-[11px]">
                <span class="flex items-center gap-1"
                  ><span class="w-2 h-2 rounded-full bg-orange-400"></span>
                  Major</span
                >
                <span>{{
                  globalStats.totalMajorProperties.toLocaleString()
                }}</span>
              </div>
              <div class="flex justify-between text-[11px]">
                <span class="flex items-center gap-1"
                  ><span class="w-2 h-2 rounded-full bg-yellow-400"></span>
                  Minor</span
                >
                <span>{{
                  globalStats.totalMinorProperties.toLocaleString()
                }}</span>
              </div>
            </div>
          </div>

          <!-- 6. Cattle Impact Card (Global State) -->
          <div
            class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 hover:-translate-y-0.5"
          >
            <div class="flex justify-between items-start mb-3">
              <div
                class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 12c-4.4 0-8 3.6-8 8v1h16v-1c0-4.4-3.6-8-8-8z" />
                  <path d="M7 11c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                  <path
                    d="M5 8c-1.1 0-2-.9-2-2V4a2 2 0 1 1 4 0v2c0 1.1-.9 2-2 2z"
                  />
                  <path
                    d="M19 8c1.1 0 2-.9 2-2V4a2 2 0 1 0-4 0v2c0 1.1.9 2-2 2z"
                  />
                  <circle cx="9" cy="18" r="1" />
                  <circle cx="15" cy="18" r="1" />
                </svg>
              </div>
              <span
                class="text-[10px] font-bold text-green-500 uppercase tracking-wider"
                >Cattle</span
              >
            </div>

            <!-- Total (Primary Metric) -->
            <div class="mb-3">
              <div class="text-xs text-gray-400">Total affected</div>
              <div class="text-3xl font-black text-green-600 tracking-tight">
                {{
                  (
                    globalStats.totalAnimalDeaths +
                    globalStats.totalAnimalInjuries
                  ).toLocaleString()
                }}
              </div>
            </div>

            <!-- Deaths Breakdown -->
            <div class="mb-3 pt-2 border-t border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <span class="text-xs font-semibold text-gray-700"
                    >Deaths</span
                  >
                </div>
                <span class="text-lg font-bold text-red-600">{{
                  globalStats.totalAnimalDeaths.toLocaleString()
                }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 pl-5">
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Large cattle</span>
                  <span class="font-medium text-gray-700">{{
                    globalStats.totalBigAnimalsDeaths.toLocaleString() || 0
                  }}</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Small cattle</span>
                  <span class="font-medium text-gray-700">{{
                    globalStats.totalSmallAnimalsDeaths.toLocaleString() || 0
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Injuries Breakdown -->
            <div class="pt-1">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="text-xs font-semibold text-gray-700"
                    >Injuries</span
                  >
                </div>
                <span class="text-lg font-bold text-orange-600">{{
                  globalStats.totalAnimalInjuries.toLocaleString()
                }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 pl-5">
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Large cattle</span>
                  <span class="font-medium text-gray-700">{{
                    globalStats.totalBigAnimalsInjuries.toLocaleString() || 0
                  }}</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Small cattle</span>
                  <span class="font-medium text-gray-700">{{
                    globalStats.totalSmallAnimalsInjuries.toLocaleString() || 0
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Global Disaster Distribution -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          📊 Global Disaster Distribution
        </h2>
        <div class="bg-white rounded-lg shadow p-6">
          <!-- Grid automatically adjusts based on number of disaster types found -->
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <!-- Loop through the dynamic keys from your SQL/Computed object -->
            <div
              v-for="(percentage, typeName) in globalDisasterDistribution"
              :key="typeName"
              class="text-center"
            >
              <!-- Use the helper function for dynamic colors and labels -->
              <div
                class="text-2xl font-bold"
                :class="getDisasterStyle(typeName).color"
              >
                {{ percentage.toFixed(1) }}%
              </div>

              <div class="text-sm text-gray-600 mt-1">
                {{ getDisasterStyle(typeName).label }}
              </div>

              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="getDisasterStyle(typeName).bg"
                  :style="{ width: percentage + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Worst Affected District -->
      <div class="mb-8" v-if="worstAffectedDistrict">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          ⚠️ Worst Affected District
        </h2>
        <div class="bg-red-50 border border-red-200 rounded-xl p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-bold text-red-900">
                {{ worstAffectedDistrict.district_name }}
                <span class="text-sm font-normal text-red-700 ml-2">
                  Impact Score:
                  {{
                    parseInt(
                      worstAffectedDistrict.district_weighted_impact
                    ).toLocaleString()
                  }}
                </span>
              </h3>
              <p class="text-red-800 mt-1">
                {{
                  parseInt(
                    worstAffectedDistrict.district_total_reports
                  ).toLocaleString()
                }}
                reports •
                {{
                  parseInt(
                    worstAffectedDistrict.district_total_deaths
                  ).toLocaleString()
                }}
                deaths •
                {{
                  parseInt(
                    worstAffectedDistrict.district_total_injuries
                  ).toLocaleString()
                }}
                injuries
              </p>
              <div
                v-if="
                  dashboardData.length > 0 &&
                  worstAffectedDistrict.disaster_distribution_pct
                "
                class="flex flex-wrap gap-3 mt-2"
              >
                <span
                  v-for="(percentage, typeName) in dashboardData[0]
                    .disaster_distribution_pct"
                  :key="typeName"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  :class="[getMeta(typeName).bg, getMeta(typeName).text]"
                  :title="`${getMeta(typeName).label}: ${percentage}%`"
                >
                  {{ getMeta(typeName).icon }} {{ percentage }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- District Comparison Table -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          📈 District Comparison
        </h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    District
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reports
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Disaster Distribution
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Human Impact
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Animal Impact
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Impact Score
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="district in dashboardData"
                  :key="district.district_name"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ district.district_name }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ district.tehsil_breakdown?.length || 0 }} tehsils
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 font-bold">
                      {{
                        parseInt(
                          district.district_total_reports
                        ).toLocaleString()
                      }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-wrap gap-1">
                      <!-- Loop through the dynamic JSON object from the SQL result -->
                      <span
                        v-for="(
                          percentage, typeName
                        ) in district.disaster_distribution_pct"
                        :key="typeName"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="[getMeta(typeName).bg, getMeta(typeName).text]"
                        :title="`${getMeta(typeName).label}: ${percentage}%`"
                      >
                        {{ getMeta(typeName).icon }} {{ percentage }}%
                      </span>
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="text-red-600 font-bold">
                        {{
                          parseInt(
                            district.district_total_deaths
                          ).toLocaleString()
                        }}
                        deaths
                      </div>
                      <div class="text-orange-600">
                        {{
                          parseInt(
                            district.district_total_injuries
                          ).toLocaleString()
                        }}
                        injuries
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="text-gray-900 font-bold">
                        {{
                          parseInt(
                            district.district_total_animal_deaths
                          ).toLocaleString()
                        }}
                        deaths
                      </div>
                      <div class="text-gray-600">
                        {{
                          parseInt(
                            district.district_total_animal_injuries
                          ).toLocaleString()
                        }}
                        injuries
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 font-bold">
                      {{
                        parseInt(
                          district.district_weighted_impact
                        ).toLocaleString()
                      }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="viewDistrictDetails(district)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Districts Tab -->
    <div v-else-if="activeTab === 'districts' && dashboardData.length > 0">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          🏙️ District-Level Analysis
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="district in dashboardData"
            :key="district.district_name"
            class="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            :class="{
              'ring-2 ring-blue-500':
                selectedDistrict?.district_name === district.district_name,
            }"
          >
            <div class="p-6">
              <!-- District Header -->
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    {{ district.district_name }}
                  </h3>
                  <div class="flex items-center mt-1">
                    <span class="text-sm text-gray-500">
                      {{ district.tehsil_breakdown?.length || 0 }} tehsils
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-gray-900">
                    {{
                      parseInt(district.district_total_reports).toLocaleString()
                    }}
                  </div>
                  <div class="text-sm text-gray-500">reports</div>
                </div>
              </div>

              <!-- Disaster Type Distribution -->
              <div class="mb-4">
                <div class="text-sm font-medium text-gray-700 mb-2">
                  Disaster Distribution
                </div>

                <!-- The Progress Bar Container -->
                <div
                  class="flex h-2 rounded-full overflow-hidden mb-2 bg-gray-100"
                >
                  <div
                    v-for="(
                      percentage, typeName
                    ) in district.disaster_distribution_pct"
                    :key="typeName"
                    class="h-full transition-all duration-500"
                    :class="getMeta(typeName).bg.replace('-100', '-500')"
                    :style="{ width: percentage + '%' }"
                    :title="`${getMeta(typeName).label}: ${percentage}%`"
                  ></div>
                </div>

                <!-- The Legend / Labels -->
                <div
                  class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600"
                >
                  <span
                    v-for="(
                      percentage, typeName
                    ) in district.disaster_distribution_pct"
                    :key="typeName"
                    class="flex items-center gap-1"
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="getMeta(typeName).bg.replace('-100', '-500')"
                    ></span>
                    {{ getMeta(typeName).icon }} {{ percentage }}%
                  </span>
                </div>
              </div>

              <!-- Key Metrics -->
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-red-600">
                    {{
                      parseInt(district.district_total_deaths).toLocaleString()
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Deaths</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-orange-600">
                    {{
                      parseInt(
                        district.district_total_injuries
                      ).toLocaleString()
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Injuries</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-purple-600">
                    {{
                      parseInt(
                        district.district_total_residents
                      ).toLocaleString()
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Residents</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-green-600">
                    {{
                      (
                        parseInt(district.district_total_animal_deaths) +
                        parseInt(district.district_total_animal_injuries)
                      ).toLocaleString()
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Animals</div>
                </div>
              </div>

              <!-- Action Button -->
              <button
                @click="viewDistrictDetails(district)"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Detailed Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- District Details View -->
      <div v-if="selectedDistrict" class="mt-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-800">
            📊 {{ selectedDistrict.district_name }} District Details
          </h2>
          <button
            @click="selectedDistrict = null"
            class="text-gray-500 hover:text-gray-700"
          >
            ← Back to all districts
          </button>
        </div>

        <!-- District Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <!-- Human Impact -->
          <div
            class="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-5"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
              </div>
              <div>
                <div
                  class="text-xs font-bold text-blue-600 uppercase tracking-wider"
                >
                  Human Impact
                </div>
                <div class="text-[10px] text-gray-400">
                  Casualties & affected
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex justify-between items-baseline">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <span class="text-xs text-gray-500">Deaths</span>
                </div>
                <span class="text-xl font-black text-gray-900">{{
                  parseInt(
                    selectedDistrict.district_total_deaths
                  ).toLocaleString()
                }}</span>
              </div>
              <div class="flex justify-between items-baseline">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="text-xs text-gray-500">Injuries</span>
                </div>
                <span class="text-lg font-semibold text-gray-800">{{
                  parseInt(
                    selectedDistrict.district_total_injuries
                  ).toLocaleString()
                }}</span>
              </div>
              <div
                class="pt-2 border-t border-gray-100 flex justify-between items-baseline"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span class="text-xs text-gray-500">Residents affected</span>
                </div>
                <span class="text-base font-semibold text-gray-700">{{
                  parseInt(
                    selectedDistrict.district_total_residents
                  ).toLocaleString()
                }}</span>
              </div>
            </div>
          </div>

          <!-- Vulnerable Groups -->
          <div
            class="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-5"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <div
                  class="text-xs font-bold text-purple-600 uppercase tracking-wider"
                >
                  Vulnerable Groups
                </div>
                <div class="text-[10px] text-gray-400">Priority assistance</div>
              </div>
            </div>

            <div class="space-y-3">
              <!-- Pregnant Women -->
              <div class="flex justify-between items-baseline">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                  <span class="text-xs text-gray-500">Pregnant women</span>
                </div>
                <span class="text-lg font-semibold text-gray-800">
                  {{
                    parseInt(
                      selectedDistrict.district_total_pregnant
                    ).toLocaleString()
                  }}
                </span>
              </div>

              <!-- School Children -->
              <div class="flex justify-between items-baseline">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    ></path>
                  </svg>
                  <span class="text-xs text-gray-500">School children</span>
                </div>
                <span class="text-lg font-semibold text-gray-800">
                  {{
                    parseInt(
                      selectedDistrict.district_total_school_going_children
                    ).toLocaleString()
                  }}
                </span>
              </div>

              <!-- Disabled Persons (NEW - with highlight) -->
              <div
                class="flex justify-between items-baseline bg-purple-50/50 rounded-lg p-2 -mx-1"
              >
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span class="text-xs font-semibold text-purple-700"
                    >Disabled persons</span
                  >
                </div>
                <span class="text-lg font-bold text-purple-800">
                  {{
                    parseInt(
                      selectedDistrict.district_total_disabled
                    ).toLocaleString() || 0
                  }}
                </span>
              </div>

              <!-- Warning / Support Message -->
              <div class="pt-2 border-t border-gray-100">
                <div
                  class="flex items-center gap-2 text-[10px] text-purple-500"
                >
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  <span>Require immediate support</span>
                </div>
              </div>
            </div>
          </div>
          <!-- Cattle Impact -->
          <div
            class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 hover:-translate-y-0.5"
          >
            <div class="flex justify-between items-start mb-3">
              <div
                class="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-green-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M12 12c-4.4 0-8 3.6-8 8v1h16v-1c0-4.4-3.6-8-8-8z" />
                  <path d="M7 11c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                  <path
                    d="M5 8c-1.1 0-2-.9-2-2V4a2 2 0 1 1 4 0v2c0 1.1-.9 2-2 2z"
                  />
                  <path
                    d="M19 8c1.1 0 2-.9 2-2V4a2 2 0 1 0-4 0v2c0 1.1.9 2-2 2z"
                  />
                  <circle cx="9" cy="18" r="1" />
                  <circle cx="15" cy="18" r="1" />
                </svg>
              </div>
              <span
                class="text-[10px] font-bold text-green-500 uppercase tracking-wider"
                >Cattle</span
              >
            </div>

            <!-- Total (Primary Metric) -->
            <div class="mb-3">
              <div class="text-xs text-gray-400">Total affected</div>
              <div class="text-3xl font-black text-green-600 tracking-tight">
                {{
                  (
                    parseInt(selectedDistrict.district_total_animal_deaths) +
                    parseInt(selectedDistrict.district_total_animal_injuries)
                  ).toLocaleString()
                }}
              </div>
            </div>

            <!-- Deaths Breakdown -->
            <div class="mb-3 pt-2 border-t border-gray-100">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                  <span class="text-xs font-semibold text-gray-700"
                    >Deaths</span
                  >
                </div>
                <span class="text-lg font-bold text-red-600">{{
                  selectedDistrict.district_total_animal_deaths.toLocaleString()
                }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 pl-5">
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Large cattle</span>
                  <span class="font-medium text-gray-700">{{
                    selectedDistrict.district_total_big_animals_deaths.toLocaleString() ||
                    0
                  }}</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Small cattle</span>
                  <span class="font-medium text-gray-700">{{
                    selectedDistrict.district_total_small_animals_deaths.toLocaleString() ||
                    0
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Injuries Breakdown -->
            <div class="pt-1">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="text-xs font-semibold text-gray-700"
                    >Injuries</span
                  >
                </div>
                <span class="text-lg font-bold text-orange-600">{{
                  selectedDistrict.district_total_animal_injuries.toLocaleString()
                }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 pl-5">
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Large cattle</span>
                  <span class="font-medium text-gray-700">{{
                    selectedDistrict.district_total_big_animals_injuries.toLocaleString() ||
                    0
                  }}</span>
                </div>
                <div class="flex justify-between text-[11px]">
                  <span class="text-gray-500">Small cattle</span>
                  <span class="font-medium text-gray-700">{{
                    selectedDistrict.district_total_big_animals_deaths.toLocaleString() ||
                    0
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Properties Destroyed Card (Global Overview) -->
          <div
            class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-5 hover:-translate-y-0.5"
          >
            <div class="flex justify-between items-start mb-3">
              <div
                class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </div>
              <span
                class="text-[10px] font-bold text-sky-500 uppercase tracking-wider"
                >Properties</span
              >
            </div>

            <!-- Total (Primary Metric) -->
            <div class="mb-3">
              <div class="text-xs text-gray-400">Total impacted</div>
              <div class="text-3xl font-black text-sky-600 tracking-tight">
                {{
                  parseInt(
                    selectedDistrict.district_properties_fully_destroyed
                  ) +
                  parseInt(selectedDistrict.district_properties_major_damage) +
                  parseInt(selectedDistrict.district_properties_minor_damage)
                }}
              </div>
            </div>

            <!-- Fully Destroyed -->
            <div class="mb-2 pt-2 border-t border-gray-100">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  <span class="text-xs font-semibold text-gray-700"
                    >Fully Destroyed</span
                  >
                </div>
                <span class="text-base font-bold text-red-600">{{
                  selectedDistrict.district_properties_fully_destroyed.toLocaleString() ||
                  0
                }}</span>
              </div>
            </div>

            <!-- Major Damage -->
            <div class="mb-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                  <span class="text-xs font-semibold text-gray-700"
                    >Major Damage</span
                  >
                </div>
                <span class="text-base font-bold text-orange-600">{{
                  selectedDistrict.district_properties_major_damage.toLocaleString() ||
                  0
                }}</span>
              </div>
            </div>

            <!-- Minor Damage -->
            <div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg
                    class="w-3.5 h-3.5 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span class="text-xs font-semibold text-gray-700"
                    >Minor Damage</span
                  >
                </div>
                <span class="text-base font-bold text-yellow-600">{{
                  selectedDistrict.district_properties_minor_damage.toLocaleString() ||
                  0
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Tehsil Breakdown -->
        <h3
          class="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2"
        >
          <svg
            class="w-4 h-4 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
          Tehsil Breakdown
        </h3>

        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Tehsil
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Reports
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Disaster Mix
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Property Damage
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Vulnerable Groups
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Human Impact
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Animal Impact
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr
                  v-for="tehsil in selectedDistrict.tehsil_breakdown"
                  :key="tehsil.tehsil_name"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <!-- Tehsil Name -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ tehsil.tehsil_name }}
                    </div>
                  </td>

                  <!-- Reports -->
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="inline-flex items-center gap-1.5">
                      <svg
                        class="w-3.5 h-3.5 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <span class="text-sm font-bold text-gray-900">{{
                        (tehsil.total_reports || 0).toLocaleString()
                      }}</span>
                    </div>
                  </td>

                  <!-- Disaster Mix -->
                  <td class="px-4 py-3">
                    <div class="min-w-[160px] space-y-1.5">
                      <div
                        v-for="(count, typeName) in tehsil.disaster_mix"
                        :key="typeName"
                        class="flex items-center gap-2"
                      >
                        <div class="w-20 flex items-center gap-1.5">
                          <span
                            class="w-2 h-2 rounded-full"
                            :class="getMeta(typeName).dot"
                          ></span>
                          <span
                            class="text-[10px] font-medium text-black"
                            :class="getMeta(typeName).text"
                          >
                            {{ getMeta(typeName).label }}
                          </span>
                        </div>
                        <span class="text-[10px] font-bold text-gray-700 w-7">{{
                          count
                        }}</span>
                        <div
                          class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"
                        >
                          <div
                            class="h-full rounded-full transition-all duration-300"
                            :class="getMeta(typeName).bg"
                            :style="{
                              width:
                                (count / (tehsil.total_reports || 1)) * 100 +
                                '%',
                            }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Property Damage -->
                  <td class="px-4 py-3">
                    <div class="min-w-[140px] space-y-2">
                      <div
                        v-for="(details, propType) in tehsil.property_summary
                          .by_type"
                        :key="propType"
                        class="text-sm"
                      >
                        <div class="flex items-center gap-1.5 mb-0.5">
                          <svg
                            class="w-3.5 h-3.5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              v-if="propType === 'Home'"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            ></path>
                            <path
                              v-else
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            ></path>
                          </svg>
                          <span class="text-xs font-semibold text-gray-800"
                            >{{ details.total }} {{ propType
                            }}{{ details.total !== 1 ? "s" : "" }}</span
                          >
                        </div>
                        <div class="flex items-center gap-2 text-[10px]">
                          <span class="inline-flex items-center gap-1">
                            <span
                              class="w-1.5 h-1.5 rounded-full bg-red-500"
                            ></span>
                            <span class="text-gray-500">Fully:</span>
                            <span class="font-medium text-gray-700">{{
                              details.fully_destroyed || 0
                            }}</span>
                          </span>
                          <span class="inline-flex items-center gap-1">
                            <span
                              class="w-1.5 h-1.5 rounded-full bg-orange-400"
                            ></span>
                            <span class="text-gray-500">Major:</span>
                            <span class="font-medium text-gray-700">{{
                              details.major || 0
                            }}</span>
                          </span>
                          <span class="inline-flex items-center gap-1">
                            <span
                              class="w-1.5 h-1.5 rounded-full bg-yellow-400"
                            ></span>
                            <span class="text-gray-500">Minor:</span>
                            <span class="font-medium text-gray-700">{{
                              details.minor || 0
                            }}</span>
                          </span>
                        </div>
                      </div>
                      <div
                        v-if="
                          !tehsil.property_summary.by_type ||
                          Object.keys(tehsil.property_summary.by_type)
                            .length === 0
                        "
                        class="text-xs text-gray-400 italic"
                      >
                        No reported damage
                      </div>
                    </div>
                  </td>

                  <!-- Vulnerable Groups -->
                  <td class="px-4 py-3">
                    <div class="flex flex-col gap-1.5">
                      <span
                        v-if="tehsil.human_impacts.pregnant > 0"
                        class="inline-flex items-center gap-1.5 bg-pink-50 text-pink-600 px-2 py-1 rounded-lg text-[10px] font-medium w-fit"
                      >
                        <svg
                          class="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                        Pregnant: {{ tehsil.human_impacts.pregnant }}
                      </span>
                      <span
                        v-if="tehsil.human_impacts.kids > 0"
                        class="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-[10px] font-medium w-fit"
                      >
                        <svg
                          class="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          ></path>
                        </svg>
                        Children: {{ tehsil.human_impacts.kids }}
                      </span>
                      <span
                        v-if="tehsil.human_impacts.disabled > 0"
                        class="inline-flex items-center gap-1.5 bg-purple-50 text-purple-600 px-2 py-1 rounded-lg text-[10px] font-medium w-fit"
                      >
                        <svg
                          class="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                        Disabled: {{ tehsil.human_impacts.disabled }}
                      </span>
                      <span
                        v-if="tehsil.human_impacts.married > 0"
                        class="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-medium w-fit"
                      >
                        <svg
                          class="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                        Couples: {{ tehsil.human_impacts.married }}
                      </span>
                      <span
                        v-if="
                          !tehsil.human_impacts.pregnant &&
                          !tehsil.human_impacts.kids &&
                          !tehsil.human_impacts.disabled &&
                          !tehsil.human_impacts.married
                        "
                        class="text-[10px] text-gray-400 italic"
                      >
                        No vulnerable groups
                      </span>
                    </div>
                  </td>

                  <!-- Human Impact -->
                  <td class="px-4 py-3">
                    <div class="min-w-[100px]">
                      <div class="flex items-center gap-1.5">
                        <svg
                          class="w-3.5 h-3.5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                        <span class="text-sm font-bold text-red-600"
                          >{{
                            (tehsil.human_impacts.deaths || 0).toLocaleString()
                          }}
                          deaths</span
                        >
                      </div>
                      <div class="flex items-center gap-1.5 mt-0.5">
                        <svg
                          class="w-3.5 h-3.5 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span class="text-xs text-orange-600"
                          >{{
                            (tehsil.human_impacts.injured || 0).toLocaleString()
                          }}
                          injuries</span
                        >
                      </div>
                      <div
                        class="flex items-center gap-1.5 mt-1 pt-1 border-t border-gray-100"
                      >
                        <svg
                          class="w-3 h-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        <span class="text-[9px] text-gray-500"
                          >Population:
                          {{
                            (
                              tehsil.human_impacts.residents || 0
                            ).toLocaleString()
                          }}</span
                        >
                      </div>
                    </div>
                  </td>

                  <!-- Animal Impact -->
                  <td class="px-4 py-3">
                    <div class="min-w-[130px]">
                      <!-- Deaths -->
                      <div class="flex items-center gap-1.5">
                        <svg
                          class="w-3.5 h-3.5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                        <span class="text-sm font-bold text-red-600"
                          >{{
                            (
                              tehsil.animal_impacts.deaths_total || 0
                            ).toLocaleString()
                          }}
                          deaths</span
                        >
                      </div>
                      <div
                        class="flex items-center gap-2 text-[9px] text-gray-500 ml-5 mt-0.5"
                      >
                        <span
                          >🐄 Large:
                          {{ tehsil.animal_impacts.deaths_big || 0 }}</span
                        >
                        <span
                          >🐐 Small:
                          {{ tehsil.animal_impacts.deaths_small || 0 }}</span
                        >
                      </div>
                      <!-- Injuries -->
                      <div class="flex items-center gap-1.5 mt-2">
                        <svg
                          class="w-3.5 h-3.5 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span class="text-xs text-orange-600"
                          >{{
                            (
                              tehsil.animal_impacts.injuries_total || 0
                            ).toLocaleString()
                          }}
                          injuries</span
                        >
                      </div>
                      <div
                        class="flex items-center gap-2 text-[9px] text-gray-500 ml-5 mt-0.5"
                      >
                        <span
                          >🐄 Large:
                          {{ tehsil.animal_impacts.injuries_big || 0 }}</span
                        >
                        <span
                          >🐐 Small:
                          {{ tehsil.animal_impacts.injuries_small || 0 }}</span
                        >
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Tehsils Tab -->
    <div v-else-if="activeTab === 'tehsils' && dashboardData.length > 0">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          🏘️ Tehsil-Level Details
        </h2>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Filter by District</label
              >
              <select
                v-model="selectedDistrictFilter"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Districts</option>
                <option
                  v-for="district in dashboardData"
                  :key="district.district_name"
                  :value="district.district_name"
                >
                  {{ district.district_name }}
                </option>
              </select>
            </div>
            <div>
              <label
                class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2"
              >
                Active Filter
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in sortOptions"
                  :key="option.value"
                  @click="toggleSort(option.value)"
                  class="relative px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 flex items-center gap-1.5"
                  :class="
                    tehsilSortBy === option.value
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                  "
                >
                  <span>{{ option.icon }}</span>
                  {{ option.label }}

                  <!-- Show an 'X' icon only when selected to indicate it can be undone -->
                  <svg
                    v-if="tehsilSortBy === option.value"
                    class="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="3"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <!-- Global "Clear All" link (Pro Touch) -->
                <button
                  v-if="tehsilSortBy !== 'reports'"
                  @click="tehsilSortBy = 'reports'"
                  class="text-xs text-blue-600 hover:text-blue-800 font-medium underline px-2"
                >
                  Reset all
                </button>
              </div>
            </div>

            <div class="flex items-end">
              <div class="text-sm text-gray-600">
                Showing {{ filteredTehsils.length }} tehsils
                <span v-if="selectedDistrictFilter">
                  in {{ selectedDistrictFilter }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tehsils Table -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Tehsil
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    District
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Reports
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Disaster Mix
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Property Damage
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Human Impact
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                  >
                    Animal Impact
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr
                  v-for="tehsil in filteredTehsils"
                  :key="tehsil.district_name + '-' + tehsil.tehsil_name"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <!-- Tehsil Name -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ tehsil.tehsil_name }}
                    </div>
                  </td>

                  <!-- District Name -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">
                      {{ tehsil.district_name }}
                    </div>
                  </td>

                  <!-- Reports Count -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="inline-flex items-center gap-1.5">
                      <svg
                        class="w-3.5 h-3.5 text-indigo-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <span class="text-sm font-bold text-gray-900">{{
                        (tehsil.total_reports || 0).toLocaleString()
                      }}</span>
                    </div>
                  </td>

                  <!-- Disaster Mix -->
                  <td class="px-6 py-4">
                    <div class="min-w-[140px] space-y-2">
                      <div
                        v-for="(count, typeName) in tehsil.disaster_mix"
                        :key="typeName"
                        class="flex items-center gap-2"
                      >
                        <div
                          class="w-14 text-[10px] font-semibold"
                          :class="getMeta(typeName).icon"
                          :title="typeName"
                        >
                          {{ getMeta(typeName).icon }}: {{ count }}
                        </div>
                        <div
                          class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"
                        >
                          <div
                            class="h-full rounded-full transition-all duration-300"
                            :class="
                              getMeta(typeName).bg.replace('-100', '-500')
                            "
                            :style="{
                              width:
                                (count / (tehsil.total_reports || 1)) * 100 +
                                '%',
                            }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Property Damage -->
                  <td class="px-6 py-4">
                    <div class="min-w-[160px] space-y-2">
                      <div
                        v-for="(details, propType) in tehsil.property_summary
                          .by_type"
                        :key="propType"
                        class="text-sm"
                      >
                        <div class="flex items-center gap-1.5 mb-0.5">
                          <!-- Property Type Icon -->
                          <svg
                            class="w-3.5 h-3.5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              v-if="propType === 'Home'"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            ></path>
                            <path
                              v-else
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            ></path>
                          </svg>
                          <span class="text-xs font-semibold text-gray-800"
                            >{{ details.total }} {{ propType
                            }}{{ details.total !== 1 ? "s" : "" }}</span
                          >
                        </div>
                        <div class="flex items-center gap-2 text-[10px]">
                          <span class="inline-flex items-center gap-1">
                            <span
                              class="w-1.5 h-1.5 rounded-full bg-red-500"
                            ></span>
                            <span class="text-gray-500">Fully:</span>
                            <span class="font-medium text-gray-700">{{
                              details.fully_destroyed || 0
                            }}</span>
                          </span>
                          <span class="inline-flex items-center gap-1">
                            <span
                              class="w-1.5 h-1.5 rounded-full bg-orange-400"
                            ></span>
                            <span class="text-gray-500">Major:</span>
                            <span class="font-medium text-gray-700">{{
                              details.major || 0
                            }}</span>
                          </span>
                          <span class="inline-flex items-center gap-1">
                            <span
                              class="w-1.5 h-1.5 rounded-full bg-yellow-400"
                            ></span>
                            <span class="text-gray-500">Minor:</span>
                            <span class="font-medium text-gray-700">{{
                              details.minor || 0
                            }}</span>
                          </span>
                        </div>
                      </div>
                      <div
                        v-if="
                          !tehsil.property_summary.by_type ||
                          Object.keys(tehsil.property_summary.by_type)
                            .length === 0
                        "
                        class="text-xs text-gray-400 italic"
                      >
                        No reported damage
                      </div>
                    </div>
                  </td>

                  <!-- Human Impact Section -->
                  <td class="px-6 py-4">
                    <div class="min-w-[160px]">
                      <!-- Deaths -->
                      <div class="flex items-center gap-1.5">
                        <svg
                          class="w-3.5 h-3.5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                        <span class="text-sm font-bold text-red-600"
                          >{{
                            (tehsil.human_impacts.deaths || 0).toLocaleString()
                          }}
                          deaths</span
                        >
                      </div>

                      <!-- Injuries -->
                      <div class="flex items-center gap-1.5 mt-0.5">
                        <svg
                          class="w-3.5 h-3.5 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span class="text-xs text-orange-600"
                          >{{
                            (tehsil.human_impacts.injured || 0).toLocaleString()
                          }}
                          injuries</span
                        >
                      </div>

                      <!-- Total Residents & Married Couples -->
                      <div class="mt-2 pt-1 border-t border-gray-100">
                        <!-- Total Residents -->
                        <div class="flex items-center gap-1.5">
                          <svg
                            class="w-3 h-3 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          <span class="text-xs text-gray-600"
                            >Population affected:</span
                          >
                          <span class="text-xs font-semibold text-gray-800">{{
                            (
                              tehsil.human_impacts.residents || 0
                            ).toLocaleString()
                          }}</span>
                        </div>

                        <!-- Married Couples -->
                        <div class="flex items-center gap-1.5 mt-0.5">
                          <svg
                            class="w-3 h-3 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            ></path>
                          </svg>
                          <span class="text-xs text-gray-600"
                            >Married couples:</span
                          >
                          <span class="text-xs font-semibold text-gray-800">{{
                            (tehsil.human_impacts.married || 0).toLocaleString()
                          }}</span>
                        </div>
                      </div>

                      <!-- Vulnerable Groups (with title) -->
                      <div class="mt-2 pt-1 border-t border-gray-100">
                        <div
                          class="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
                        >
                          Vulnerable Groups
                        </div>
                        <div class="flex flex-wrap gap-1">
                          <span
                            v-if="tehsil.human_impacts.pregnant > 0"
                            class="inline-flex items-center gap-1 bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            title="pregnant women"
                          >
                            <svg
                              class="w-2.5 h-2.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              ></path>
                            </svg>
                            {{ tehsil.human_impacts.pregnant }}
                          </span>
                          <span
                            v-if="tehsil.human_impacts.kids > 0"
                            class="inline-flex items-center gap-1 bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            title="school going children"
                          >
                            <svg
                              class="w-2.5 h-2.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              ></path>
                            </svg>
                            {{ tehsil.human_impacts.kids }}
                          </span>
                          <span
                            v-if="tehsil.human_impacts.disabled > 0"
                            class="inline-flex items-center gap-1 bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded text-[10px] font-medium"
                            title="disabled persons count"
                          >
                            <svg
                              class="w-2.5 h-2.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              ></path>
                            </svg>
                            {{ tehsil.human_impacts.disabled }}
                          </span>
                          <span
                            v-if="
                              !tehsil.human_impacts.pregnant &&
                              !tehsil.human_impacts.kids &&
                              !tehsil.human_impacts.disabled
                            "
                            class="text-[10px] text-gray-400 italic"
                          >
                            No vulnerable groups reported
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Animal Impact -->
                  <td class="px-6 py-4">
                    <div class="min-w-[150px]">
                      <!-- Deaths -->
                      <div class="flex items-center gap-1.5">
                        <svg
                          class="w-3.5 h-3.5 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                        <span class="text-sm font-bold text-red-600"
                          >{{
                            (
                              tehsil.animal_impacts.deaths_total || 0
                            ).toLocaleString()
                          }}
                          deaths</span
                        >
                      </div>
                      <div
                        class="flex items-center gap-2 text-[10px] text-gray-500 ml-5 mt-0.5"
                      >
                        <span
                          >🐄 Large:
                          {{ tehsil.animal_impacts.deaths_big || 0 }}</span
                        >
                        <span
                          >🐐 Small:
                          {{ tehsil.animal_impacts.deaths_small || 0 }}</span
                        >
                      </div>
                      <!-- Injuries -->
                      <div class="flex items-center gap-1.5 mt-2">
                        <svg
                          class="w-3.5 h-3.5 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          ></path>
                        </svg>
                        <span class="text-xs text-orange-600"
                          >{{
                            (
                              tehsil.animal_impacts.injuries_total || 0
                            ).toLocaleString()
                          }}
                          injuries</span
                        >
                      </div>
                      <div
                        class="flex items-center gap-2 text-[10px] text-gray-500 ml-5 mt-0.5"
                      >
                        <span
                          >🐄 Large:
                          {{ tehsil.animal_impacts.injuries_big || 0 }}</span
                        >
                        <span
                          >🐐 Small:
                          {{ tehsil.animal_impacts.injuries_small || 0 }}</span
                        >
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredTehsils.length === 0"
          class="text-center py-12 bg-white rounded-lg shadow"
        >
          <div class="text-gray-400">
            <svg
              class="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              No tehsils found
            </h3>
            <p class="mt-1 text-sm text-gray-500">Try changing your filters</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400">
        <svg
          class="mx-auto h-12 w-12"
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
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          No data available
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Try refreshing the page or check your connection.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAdminStore } from "~/stores/admin";
// nuxt specific
definePageMeta({
  middleware: "role-check",
  allowedRoles: ["admin", "super_admin"],
  layout: "admin",
});

useSeoMeta({
  title: "Admin Dashboard Page",
  description:
    "Comprehensive disaster impact analysis dashboard for administrators",
});
// store
const store = useAdminStore();
// State
const dashboardData = ref([]);
const loading = ref(true);
const error = ref(null);
const activeTab = ref("global");
const selectedDistrict = ref(null);
const selectedDistrictFilter = ref("");
const tehsilSortBy = ref("reports");
const currentTime = ref("");

// Computed: Check if there's an error
const hasError = computed(() => {
  return error.value !== null && error.value !== undefined;
});

const disasterMetadata = {
  Flood: { label: "Floods", icon: "🌊", bg: "bg-sky-500", text: "text-white" },
  Fire: { label: "Fires", icon: "🔥", bg: "bg-rose-600", text: "text-white" },
  Land_slide: {
    label: "Landslide",
    icon: "⛰️",
    bg: "bg-amber-600",
    text: "text-white",
  },
  Earthquake: {
    label: "Earthquakes",
    icon: "🌋",
    bg: "bg-indigo-600",
    text: "text-white",
  },
  default: {
    label: "Other",
    icon: "📦",
    bg: "bg-gray-500",
    text: "text-white",
  },
};

const getMeta = (type) => disasterMetadata[type] || disasterMetadata["default"];

const getDisasterStyle = (type) => {
  const styles = {
    Flood: { color: "text-blue-600", bg: "bg-blue-600", label: "Floods" },
    Fire: { color: "text-red-600", bg: "bg-red-600", label: "Fires" },
    Land_slide: {
      color: "text-amber-700",
      bg: "bg-amber-700",
      label: "Landslides",
    },
    Earthquake: {
      color: "text-purple-600",
      bg: "bg-purple-600",
      label: "Earthquakes",
    },
  };
  // Default style for any new/unknown disaster types
  return (
    styles[type] || { color: "text-gray-600", bg: "bg-gray-600", label: type }
  );
};

// Extract error message from API response
const extractErrorMessage = (err) => {
  // Handle structured API error response
  if (err?.response?._data) {
    const data = err.response._data;

    if (data.status === "error" && data.message) {
      return {
        title: `Error ${data.statusCode || ""}`,
        message: data.message,
        suggestion:
          data.statusCode === 404
            ? "The requested data could not be found. Please try again later."
            : "Please try againb by refreshing the page or contact support if the issue persists.",
        details: data.statusCode ? `Status code: ${data.statusCode}` : null,
      };
    }

    if (data.message) {
      return {
        title: "Server Error",
        message: data.message,
        suggestion:
          "Please try again or contact support if the issue persists.",
      };
    }
  }

  // // Network errors
  if (err?.message === "Network Error") {
    return {
      title: "Network Error",
      message:
        "Unable to connect to the server. Please check your internet connection.",
      suggestion:
        "Verify your internet connection and ensure the server is running.",
    };
  }

  // Timeout errors
  if (err?.code === "ECONNABORTED") {
    return {
      title: "Request Timeout",
      message: "The request took too long to complete.",
      suggestion:
        "The server might be experiencing high load. Please wait and try again.",
    };
  }

  // Fallback
  return {
    title: "Unexpected Error",
    message:
      err?.message ||
      "An unexpected error occurred while loading dashboard data.",
    suggestion: "Please try refreshing the page or contact support.",
    details: err?.toString() || null,
  };
};

// Fetch data
const fetchDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Attempt to fetch analytics
    const response = await store.fetchAdminAnalytics();
    console.log("Dashboard analytics response:", response);

    // Use store analytics or fallback to empty array
    dashboardData.value = store?.analytics ?? [];

    // If we got data but it's empty, that's not necessarily an error
    // but we could show a specific message
    if (dashboardData.value.length === 0) {
      console.warn("Dashboard data is empty - no districts returned");
    }

    // Update current time
    updateCurrentTime();
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    error.value = extractErrorMessage(err);
  } finally {
    loading.value = false;
  }
};

// Update current time
const updateCurrentTime = () => {
  const now = new Date();
  currentTime.value =
    now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) +
    " • " +
    now.toLocaleDateString();
};

// Retry fetching data
const retryFetchData = () => {
  fetchDashboardData();
};

// Computed: Global Stats
const globalStats = computed(() => {
  if (dashboardData.value.length === 0) {
    return {
      totalReports: 0,
      totalDeaths: 0,
      totalInjuries: 0,
      totalResidents: 0,
      totalPropertiesImpacted: 0,
      totalMinorProperties: 0,
      totalMajorProperties: 0,
      totalFullyDestroyedProperties: 0,
      totalAnimals: 0,
      totalAnimalDeaths: 0,
      totalAnimalInjuries: 0,
      totalSmallAnimalsDeaths: 0,
      totalSmallAnimalsInjuries: 0,
      totalBigAnimalsDeaths: 0,
      totalBigAnimalsInjuries: 0,
      totalSchoolGoingChildren: 0,
      totalPregnant: 0,
      totalMerriedCouples: 0,
      totalDisabled: 0,
    };
  }

  // Take global stats from first district
  const firstDistrict = dashboardData.value[0];
  return {
    totalReports: parseInt(firstDistrict.global_total_reports),
    totalDeaths: parseInt(firstDistrict.global_total_deaths),
    totalInjuries: parseInt(firstDistrict.global_total_injuries),
    totalResidents: parseInt(firstDistrict.global_total_residents),
    totalPropertiesImpacted: parseInt(firstDistrict.global_total_properties),
    totalMinorProperties: parseInt(firstDistrict.global_total_minor_properties),
    totalMajorProperties: parseInt(firstDistrict.global_total_major_properties),
    totalFullyDestroyedProperties: parseInt(
      firstDistrict.global_total_properties_destroyed
    ),
    totalSchoolGoingChildren: parseInt(
      firstDistrict.global_total_school_going_children
    ),
    totalPregnant: parseInt(firstDistrict.global_total_pregnant),
    totalDisabled: parseInt(firstDistrict.global_total_disabled),
    totalAnimals:
      parseInt(firstDistrict.global_total_animal_deaths) +
      parseInt(firstDistrict.global_total_animal_injuries),
    totalAnimalDeaths: parseInt(firstDistrict.global_total_animal_deaths),
    totalSmallAnimalsDeaths: parseInt(
      firstDistrict.global_total_small_animals_deaths
    ),
    totalSmallAnimalsInjuries: parseInt(
      firstDistrict.global_total_small_animals_injuries
    ),
    totalBigAnimalsDeaths: parseInt(
      firstDistrict.global_total_big_animals_deaths
    ),
    totalBigAnimalsInjuries: parseInt(
      firstDistrict.global_total_big_animals_injuries
    ),
    totalAnimalInjuries: parseInt(firstDistrict.global_total_animal_injuries),
    totalMerriedCouples: parseInt(firstDistrict.global_total_married_couples),
  };
});

// Computed: Global Disaster Distribution
const globalDisasterDistribution = computed(() => {
  const distribution = {};

  if (!dashboardData.value || dashboardData.value.length === 0)
    return distribution;

  let totalReportsGlobal = 0;

  // 1. Sum up all reports across all districts to get the global weight
  dashboardData.value.forEach((district) => {
    const districtReports = parseInt(district.district_total_reports) || 0;
    totalReportsGlobal += districtReports;

    // 2. Access the dynamic JSON object from SQL
    const pctMap = district.disaster_distribution_pct || {};

    Object.entries(pctMap).forEach(([disasterType, percentage]) => {
      if (!distribution[disasterType]) distribution[disasterType] = 0;

      // Calculate weighted contribution: (District % of Disaster) * District Total Reports
      // We divide by 100 because the SQL returns whole numbers (e.g., 45.5 for 45.5%)
      distribution[disasterType] +=
        (parseFloat(percentage) / 100) * districtReports;
    });
  });

  // 3. Finalize global percentages
  Object.keys(distribution).forEach((type) => {
    distribution[type] =
      totalReportsGlobal > 0
        ? (distribution[type] / totalReportsGlobal) * 100
        : 0;
  });

  return distribution;
});

// Computed: Worst Affected District
const worstAffectedDistrict = computed(() => {
  if (dashboardData.value.length === 0) return null;

  return dashboardData.value.reduce((worst, current) => {
    const currentImpact = parseInt(current.district_weighted_impact);
    const worstImpact = parseInt(worst.district_weighted_impact);
    return currentImpact > worstImpact ? current : worst;
  }, dashboardData.value[0]);
});

// Computed: All Tehsils (flattened)
const allTehsils = computed(() => {
  const tehsils = [];
  dashboardData.value.forEach((district) => {
    district.tehsil_breakdown?.forEach((tehsil) => {
      tehsils.push({
        ...tehsil,
        district_name: district.district_name,
      });
    });
  });
  return tehsils;
});

const sortOptions = [
  { value: "reports", label: "Reports", icon: "📊" },
  { value: "deaths", label: "Casualties", icon: "💀" },
  { value: "property", label: "Property Damage", icon: "🏗️" },
  { value: "animal_deaths", label: "Animal Loss", icon: "🐾" },
  { value: "disaster_mix", label: "Severity", icon: "🔥" },
];

const toggleSort = (value) => {
  if (tehsilSortBy.value === value) {
    tehsilSortBy.value = "reports";
  } else {
    tehsilSortBy.value = value;
  }
};

// Computed: Filtered Tehsils
const filteredTehsils = computed(() => {
  let tehsils = [...allTehsils.value];

  // Filter by district
  if (selectedDistrictFilter.value) {
    tehsils = tehsils.filter(
      (t) => t.district_name === selectedDistrictFilter.value
    );
  }

  // Sort tehsils
  tehsils.sort((a, b) => {
    const getVal = (obj, path) =>
      path.split(".").reduce((acc, part) => acc && acc[part], obj) || 0;

    switch (tehsilSortBy.value) {
      case "reports":
        return (b.total_reports || 0) - (a.total_reports || 0);

      case "deaths":
        return (
          getVal(b, "human_impacts.deaths") - getVal(a, "human_impacts.deaths")
        );

      case "property": // CHANGED: Now sums ALL property types dynamically
        const sumProp = (item) =>
          Object.values(item.property_summary?.by_type || {}).reduce(
            (sum, type) => sum + (type.total || 0),
            0
          );
        return sumProp(b) - sumProp(a);

      case "animal_deaths":
        return (
          getVal(b, "animal_impacts.deaths_total") -
          getVal(a, "animal_impacts.deaths_total")
        );

      case "disaster_mix":
        const sumMix = (item) =>
          Object.values(item.disaster_mix || {}).reduce(
            (sum, val) => sum + val,
            0
          );
        return sumMix(b) - sumMix(a);

      default:
        return (b.total_reports || 0) - (a.total_reports || 0);
    }
  });

  return tehsils;
});

// Methods
const viewDistrictDetails = (district) => {
  selectedDistrict.value = district;
  activeTab.value = "districts";
};
// socket
let socket = null;

let timeInterval = null;
// Initialize
onMounted(async () => {
  await fetchDashboardData();

  // Update time every minute
  timeInterval = setInterval(() => {
    updateCurrentTime();
  }, 60000);
});
onUnmounted(() => {
  if (socket) socket.disconnect();
  if (timeInterval) clearInterval(timeInterval);
});
</script>

<style scoped>
/* Card hover effects */
.bg-white {
  transition: all 0.2s ease;
}

.bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Table styling */
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead th {
  position: sticky;
  top: 0;
  background-color: #f9fafb;
  z-index: 10;
}

tbody tr:hover {
  background-color: #f9fafb;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    gap: 1rem;
  }

  .p-5,
  .p-6 {
    padding: 1rem;
  }

  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

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
}

/* Animation for tab switching */
.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

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

/* Progress bar animations */
.bg-blue-500,
.bg-orange-500,
.bg-gray-600,
.bg-purple-500,
.bg-gray-400 {
  transition: width 0.5s ease-in-out;
}
.group {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover {
  transform: translateY(-2px);
}

@keyframes pulse-subtle {
  0% {
    opacity: 0.6;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-pulse {
  animation: pulse-subtle 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Disabled tab buttons */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>