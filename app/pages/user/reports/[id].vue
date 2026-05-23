<!-- src/components/victim/ReportDetail.vue -->
<template>
  <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center">
      <div
        class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
      <p class="mt-4 text-gray-600 font-medium">Loading report details...</p>
    </div>
  </div>

  <div v-else-if="!report" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-center">
      <div
        class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-10 h-10 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
      <p class="text-gray-600 mb-6">
        The requested report could not be found or you don't have access to it.
      </p>
      <button
        @click="goBack"
        aria-label="Go back to dashboard"
        @keydown.enter="goBack"
        @keydown.space="goBack"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        Back to Dashboard
      </button>
    </div>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header with Back Button -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <svg
          class="w-4 h-4 mr-1"
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
        Back to Dashboard
      </button>
    </div>

    <!-- Report Header -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">
            Damage Report #{{ report.report_id }}
          </h1>
          <p class="mt-2 text-gray-600">
            Submitted on {{ formatDateTime(report.created_at) }}
          </p>
        </div>
        <div class="mt-4 md:mt-0 flex flex-col items-end space-y-2">
          <span
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium',
              statusClasses.badge,
            ]"
          >
            {{ report.status }}
          </span>
          <span class="text-xs text-gray-500">
            Reporter ID: {{ report.reporter_id }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column - Report Details -->
      <div class="lg:col-span-2">
        <!-- Disaster Type & Location Card -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Disaster Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">
                Disaster Details
              </h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5 text-gray-400 mr-2"
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
                  <div>
                    <p class="text-sm font-medium text-gray-700">
                      Disaster Type
                    </p>
                    <p class="text-gray-900 capitalize">
                      {{ report.disaster_type }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <div>
                    <p class="text-sm font-medium text-gray-700">
                      Location Coordinates
                    </p>
                    <p class="text-gray-900 font-mono text-sm">
                      {{ report.location }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">
                Location Map
              </h3>
              <div
                class="bg-gray-100 rounded-lg h-40 flex items-center justify-center"
              >
                <div class="text-center">
                  <svg
                    class="w-10 h-10 text-gray-400 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p class="text-sm text-gray-600">Map Preview</p>
                  <button
                    @click="openInMaps"
                    class="mt-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    View in Maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Property Damage Card -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Property Damage Assessment
          </h2>

          <!-- Check if there is data -->
          <div
            v-if="report.property_details && report.property_details.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div
              v-for="(item, index) in report.property_details"
              :key="index"
              class="border-b md:border-b-0 pb-6 md:pb-0 last:border-0"
            >
              <div class="flex items-center mb-3">
                <div
                  :class="[
                    'p-2 rounded-lg mr-3',
                    item.type === 'Home'
                      ? 'bg-blue-50 text-blue-600'
                      : item.type === 'Shop'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-orange-50 text-orange-600',
                  ]"
                >
                  <svg
                    v-if="item.type === 'Home'"
                    class="w-5 h-5"
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
                  <svg
                    v-else
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">
                  {{ item.type }} Damage
                </h3>
              </div>

              <div class="space-y-3">
                <div>
                  <p class="text-sm font-medium text-gray-700">Impact Status</p>
                  <div class="flex items-center mt-1">
                    <div class="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                    <span class="text-gray-900">Impacted</span>
                  </div>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-700">Damage Level</p>
                  <span
                    :class="[
                      'inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 capitalize',
                      damageLevelClass(item.level),
                    ]"
                  >
                    {{ item.level.replace("_", " ") }}
                  </span>
                </div>

                <!-- Compact Image Preview -->
                <div
                  v-if="item.image"
                  class="mt-4 pt-4 border-t border-gray-100"
                >
                  <div
                    @click="openImage(item.image, item.type + ' Damage')"
                    class="flex items-center group cursor-pointer"
                  >
                    <div class="relative w-16 h-16 flex-shrink-0">
                      <img
                        :src="safeImageUrl(item.image)"
                        class="w-full h-full object-cover rounded-lg border border-gray-200"
                        alt="Thumbnail"
                      />
                      <div
                        class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                      >
                        <svg
                          class="w-5 h-5 text-white"
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
                      </div>
                    </div>
                    <div class="ml-3">
                      <p
                        class="text-sm font-medium text-blue-600 group-hover:text-blue-700"
                      >
                        View Damage Photo
                      </p>
                      <p class="text-xs text-gray-500">
                        Full resolution available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-else
            class="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
          >
            <svg
              class="w-12 h-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-gray-600 font-medium">No property damage reported</p>
            <p class="text-sm text-gray-400">
              All structures are safe or no assessment was provided.
            </p>
          </div>
        </div>

        <!-- Human Impact Card -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Human Impact Assessment
          </h2>

          <!-- Total Residents & Casualties -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-3xl font-bold text-gray-900">
                {{ report.human_summary.total_residents }}
              </p>
              <p class="text-sm text-gray-600 mt-1">Total Family Members</p>
            </div>

            <div class="text-center p-4 bg-red-50 rounded-lg">
              <p class="text-3xl font-bold text-red-700">
                {{ report.human_summary.total_deaths }}
              </p>
              <p class="text-sm text-red-600 mt-1">Deaths</p>
            </div>

            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <p class="text-3xl font-bold text-yellow-700">
                {{ report.human_summary.total_injured }}
              </p>
              <p class="text-sm text-yellow-600 mt-1">Injured</p>
            </div>
          </div>

          <!-- Vulnerable Groups -->
          <div v-if="true" class="pt-4 border-t border-gray-200">
            <h3 class="text-lg font-medium text-gray-900 mb-3">
              Vulnerable Groups
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-if="true" class="text-center p-3 bg-pink-50 rounded-lg">
                <p class="text-xl font-bold text-pink-700">
                  {{
                    /**'report.pregnant_women_count' */ report.human_summary
                      .total_pregnant_womens
                  }}
                </p>
                <p class="text-sm text-pink-600">Pregnant Women</p>
              </div>

              <div v-if="true" class="text-center p-3 bg-blue-50 rounded-lg">
                <p class="text-xl font-bold text-blue-700">
                  {{ report.human_summary.total_disabled_persons_count }}
                </p>
                <p class="text-sm text-blue-600">Disabled Persons</p>
              </div>

              <div v-if="true" class="text-center p-3 bg-green-50 rounded-lg">
                <p class="text-xl font-bold text-green-700">
                  {{ report.human_summary.total_school_going_children_count }}
                </p>
                <p class="text-sm text-green-600">School Children</p>
              </div>

              <div v-if="true" class="text-center p-3 bg-purple-50 rounded-lg">
                <p class="text-xl font-bold text-purple-700">
                  {{ report.human_summary.total_married_couples_count }}
                </p>
                <p class="text-sm text-purple-600">Married Couples</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Animal Impact Card -->
        <div
          v-if="true"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Animal Impact Assessment
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Big Animals -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Large Animals (Cattle, etc.)
              </h3>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span class="text-sm font-medium text-red-700">Deaths</span>
                  </div>
                  <span class="text-xl font-bold text-red-700">{{
                    report.animal_summary.big_deaths
                  }}</span>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-yellow-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                      />
                    </svg>
                    <span class="text-sm font-medium text-yellow-700"
                      >Injured</span
                    >
                  </div>
                  <span class="text-xl font-bold text-yellow-700">{{
                    report.animal_summary.big_injured
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Small Animals -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-3">
                Small Animals (Goats, Sheep, etc.)
              </h3>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-red-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span class="text-sm font-medium text-red-700">Deaths</span>
                  </div>
                  <span class="text-xl font-bold text-red-700">{{
                    report.animal_summary.small_deaths
                  }}</span>
                </div>

                <div
                  class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
                >
                  <div class="flex items-center">
                    <svg
                      class="w-5 h-5 text-yellow-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                      />
                    </svg>
                    <span class="text-sm font-medium text-yellow-700"
                      >Injured</span
                    >
                  </div>
                  <span class="text-xl font-bold text-yellow-700">{{
                    report.animal_summary.small_injured
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Status & Metadata -->
      <div>
        <!-- Status Card -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Report Status
          </h2>

          <div class="space-y-6">
            <!-- Status Indicator -->
            <div>
              <div class="flex items-center mb-3">
                <div
                  class="w-3 h-3 rounded-full mr-2"
                  :class="statusClasses.dot"
                ></div>
                <span class="text-lg font-medium text-gray-900">{{
                  formattedStatus
                }}</span>
              </div>

              <!-- Status Description -->
              <p class="text-sm text-gray-600">
                <span v-if="status === 'verified'">
                  Your report has been verified and approved for assistance.
                  Relief efforts are being coordinated.
                </span>
                <span v-else-if="status === 'pending'">
                  Your report is under review. Our team will verify the details
                  and update the status soon.
                </span>
                <span v-else-if="status === 'processed'">
                  Your report has been processed and assistance is being
                  arranged.
                </span>
                <span v-else>
                  Your report has been submitted and is awaiting initial
                  processing.
                </span>
              </p>
            </div>

            <!-- Timeline -->
            <div class="pt-4 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-700 mb-3">
                Report Timeline
              </h3>
              <div class="space-y-3">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      Report Submitted
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ formatDateTime(report.created_at) }}
                    </p>
                  </div>
                </div>

                <div v-if="status === 'verified'" class="flex">
                  <div class="flex-shrink-0">
                    <div class="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">
                      Report Verified
                    </p>
                    <p class="text-sm text-gray-500">
                      Awaiting verification timestamp
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Next Steps -->
            <div class="pt-4 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Next Steps</h3>
              <ul class="text-sm text-gray-600 space-y-2">
                <li v-if="status === 'pending'" class="flex items-start">
                  <svg
                    class="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Your report is in queue for verification</span>
                </li>
                <li v-if="status === 'verified'" class="flex items-start">
                  <svg
                    class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span
                    >Relief coordinator will contact you within 24-48
                    hours</span
                  >
                </li>
                <li class="flex items-start">
                  <svg
                    class="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Keep your phone accessible for updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Report Metadata Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Report Information
          </h2>

          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-700 mb-1">Report ID</p>
              <p class="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded">
                {{ report.report_id }}
              </p>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700 mb-1">Reporter ID</p>
              <p class="text-gray-900">{{ report.reporter_id }}</p>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700 mb-1">
                Submission Date
              </p>
              <p class="text-gray-900">
                {{ formatDateTime(report.created_at) }}
              </p>
            </div>

            <div class="pt-3 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-700 mb-2">
                Need Assistance?
              </h3>
              <p class="text-sm text-gray-600 mb-3">
                If you need to update information or have questions:
              </p>

              <div class="space-y-2">
                <a
                  href="tel:1234-567-89-1234"
                  class="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
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
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Emergency Hotline: 1234-567-89-1234
                </a>

                <p class="text-xs text-gray-500">
                  Available 24/7 for immediate assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Print/Share Section -->
    <div class="mt-8 pt-8 border-t border-gray-200">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-900">
            Report Documentation
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            Keep a copy for your records and reference
          </p>
        </div>
        <div class="mt-4 sm:mt-0 space-x-3 space-y-2 sm:space-y-0">
          <button
            @click="printReport"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Report
          </button>

          <button
            @click="downloadReport"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <ReusableModal :is-open="showImageModal" @close="closeImageModal">
      <template #icon>
        <div
          class="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto"
        >
          <svg
            class="w-10 h-10 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </template>

      <template #title>
        {{ currentImageTitle }}
      </template>

      <template #content>
        <div class="mb-4">
          <img
            :src="currentImageUrl"
            :alt="currentImageTitle"
            class="w-full h-64 object-contain rounded-lg"
          />
        </div>
        <p class="text-sm text-gray-500">Damage assessment photo</p>
      </template>

      <template #actions>
        <button
          @click="closeImageModal"
          class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </template>
    </ReusableModal>
  </div>
</template>

<script setup>
import { useReportStore } from "~/stores/reportsStore";
import ReusableModal from "~/components/reusableModal.vue";

const route = useRoute();
definePageMeta({
  middleware: "role-check",
  allowedRoles: ["user", "admin", "super_admin"],
});
useSeoMeta({
  title: `View Submitted Report ${route.params.id}`,
  description: "View full detail of your submitted report",
});
// Router

// Store
const reportStore = useReportStore();

// State
const loading = ref(true);
const report = ref(null);
const showImageModal = ref(false);
const currentImageUrl = ref("");
const currentImageTitle = ref("");

// Computed Properties
const reportId = computed(() => {
  return route.params.id;
});

const status = computed(() => {
  return report.value?.status?.toLowerCase() || "unknown";
});

const formattedStatus = computed(() => {
  const s = status.value;
  return s.charAt(0).toUpperCase() + s.slice(1);
});

const statusClasses = computed(() => {
  const s = status.value;

  const classMap = {
    verified: { badge: "bg-green-100 text-green-800", dot: "bg-green-500" },
    pending: { badge: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-500" },
    processed: { badge: "bg-blue-100 text-blue-800", dot: "bg-blue-500" },
    rejected: { badge: "bg-red-100 text-red-800", dot: "bg-red-500" },
  };

  return (
    classMap[s] || { badge: "bg-gray-100 text-gray-800", dot: "bg-gray-400" }
  );
});

const hasVulnerableGroups = computed(() => {
  if (!report.value) return false;
  return (
    report.value.pregnant_women_count > 0 ||
    report.value.disabled_persons_count > 0 ||
    report.value.school_going_children_count > 0 ||
    report.value.married_couples_count > 0
  );
});

// Methods
const loadReport = async () => {
  loading.value = true;
  try {
    if (!reportStore.reports?.all_reports?.length) {
      await reportStore.fetchReports();
    }

    if (reportStore?.reports?.all_reports) {
      const foundReport = reportStore.reports.all_reports.find(
        (r) => r.report_id.toString() === reportId.value.toString()
      );

      if (foundReport) {
        report.value = foundReport;
      } else {
        console.warn(`Report ${reportId.value} not found`);
        report.value = null;
      }
    } else {
      report.value = null;
    }
  } catch (error) {
    console.error("Failed to load report");
    report.value = null;
  } finally {
    loading.value = false;
  }
};

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";

    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.warn("Invalid date format:", dateString);
    return "Invalid Date";
  }
};

const damageLevelClass = (level) => {
  if (!level) return "bg-gray-100 text-gray-800";

  const levels = {
    minor: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800",
    severe: "bg-red-100 text-red-800",
    major: "bg-red-100 text-red-800",
    fully_destroyed: "bg-red-100 text-red-800",
  };

  return levels[level.toLowerCase()] || levels.minor;
};

const safeImageUrl = (url) => {
  if (!url) return null;

  try {
    const urlObj = new URL(url);

    // Only allow HTTPS in production
    if (process.env.NODE_ENV === "production" && urlObj.protocol !== "https:") {
      console.warn("Non-HTTPS image URL blocked:", url);
      return null;
    }

    // Validate file extensions
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const hasValidExtension = allowedExtensions.some((ext) =>
      urlObj.pathname.toLowerCase().endsWith(ext)
    );

    return hasValidExtension ? url : null;
  } catch {
    console.warn("Invalid image URL:", url);
    return null;
  }
};

const openInMaps = () => {
  if (!report.value?.location) return;

  const coords = report.value.location.split(",").map((coord) => coord.trim());
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
  window.open(encodedUrl, "_blank", "noopener,noreferrer");
};

const openImage = async (url, title) => {
  try {
    // Show loading state
    showImageModal.value = true;
    currentImageTitle.value = title + " (Loading...)";

    // Preload image with timeout
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;

      // Timeout after 10 seconds
      setTimeout(() => reject(new Error("Image load timeout")), 10000);
    });

    currentImageUrl.value = url;
    currentImageTitle.value = title;
  } catch (error) {
    console.error("Failed to load image:", error);
    showImageModal.value = false;
    // Show error to user
    alert("Failed to load image. Please try again.");
  }
};

const closeImageModal = () => {
  showImageModal.value = false;
  currentImageUrl.value = "";
  currentImageTitle.value = "";
};

const goBack = () => {
  navigateTo("/user/dashboard");
};

const printReport = () => {
  window.print();
};

const downloadReport = () => {
  // TODO: Implement actual PDF download
  alert(
    "PDF download feature would be implemented here. For now, use Print function."
  );
};

// Watch for store updates
let isLoading = false;
const unwatch = watch(
  () => reportStore.reports?.all_reports,
  async (newReports) => {
    if (!report.value && reportId.value && newReports?.length && !isLoading) {
      isLoading = true;
      try {
        await loadReport();
      } finally {
        isLoading = false;
      }
    }
  },
  { immediate: false }
);

// Lifecycle
onMounted(() => {
  if (!reportId.value) {
    navigateTo("/dashboard");
    return;
  }
  loadReport();
});
/**
 [
{
    type:"Shop", image:"https://someurl.com", level:"fully_destroyed"
},
{
    type:"Home", image:"https://someurl.com", level:"Minor"
},{
    type:"Warehouse", image:"https://someurl.com", level:"Major"
},
    ]
 */
// Cleanup
onUnmounted(() => {
  unwatch();
});
</script>

<style scoped>
/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  button,
  a[href^="tel:"] {
    display: none !important;
  }

  body {
    font-size: 12pt;
    line-height: 1.5;
  }

  .bg-white {
    background-color: white !important;
    border: 1px solid #e5e7eb !important;
  }

  .shadow-sm {
    box-shadow: none !important;
  }

  /* Ensure proper page breaks */
  .lg\:col-span-2 {
    break-inside: avoid;
  }

  /* Hide interactive elements */
  [class*="hover:"],
  [class*="group"] {
    pointer-events: none !important;
  }
}
</style>