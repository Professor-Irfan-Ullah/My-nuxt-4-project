<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div
      v-if="isLoadingReport"
      class="flex items-center justify-center min-h-screen"
    >
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600 mb-4"
        ></div>
        <p class="text-lg text-gray-500">Loading report...</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="reportError"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
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
            {{ reportError.title }}
          </h3>
          <p class="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
            {{ reportError.message }}
          </p>

          <!-- Resolution Suggestion -->
          <div
            v-if="reportError.suggestion"
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
              {{ reportError.suggestion }}
            </p>
          </div>

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
            <router-link
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
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content (only shown when report is loaded successfully) -->
    <template v-else-if="reportLoaded">
      <!-- Header -->
      <div
        class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button
                @click="goBack"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <LucideChevronLeft class="w-4 h-4 mr-1" />
                Back
              </button>
              <h1 class="text-2xl font-bold text-gray-900">
                Modify Report #{{ formData.report_id }}
              </h1>
            </div>
            <div class="flex items-center space-x-3">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="verificationStatusClass"
              >
                <span
                  class="w-2 h-2 rounded-full mr-2"
                  :class="verificationDotClass"
                ></span>
                {{ formData.verification_status }}
              </span>
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-500 flex items-center">
            <LucideCalendar class="w-4 h-4 mr-1.5" />
            Submitted: {{ formatDate(formData.submission_date) }}
          </p>
        </div>
      </div>

      <!-- coordinate picker -->
      <coordinate-picker
        :isOpen="showMapPicker"
        :initialCoordinates="coordinatesToVerify"
        @close="showMapPicker = false"
        @confirm="handleCoordinatesConfirmed"
        @adjust="handleCoordinatesAdjusted"
      ></coordinate-picker>

      <!-- Main Form -->
      <form
        @submit.prevent="handleSubmit"
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <!-- admin guide -->
        <admin-form-guide class="mb-6" />
        <div class="space-y-6">
          <!-- Personal Information Section -->
          <section
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <LucideUser class="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h2>
                </div>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  Editable
                </span>
              </div>
            </div>

            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Full Name <span class="text-red-500">*</span></label
                  >
                  <input
                    id="name"
                    required
                    v-model="formData.name"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label
                    for="father_name"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Father's Name <span class="text-red-500">*</span></label
                  >
                  <input
                    id="father_name"
                    required
                    v-model="formData.father_name"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter father's name"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Email Address</label
                  >
                  <div class="relative">
                    <div
                      class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between"
                    >
                      <div class="flex items-center space-x-2">
                        <LucideMail class="w-4 h-4 text-gray-400" />
                        <span class="text-gray-700">{{ formData.email }}</span>
                      </div>
                      <LucideLock class="w-4 h-4 text-gray-400" />
                    </div>
                    <p class="mt-1 text-xs text-gray-500 flex items-center">
                      <LucideInfo class="w-3 h-3 mr-1" />
                      Email cannot be modified
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    for="cnic"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >CNIC Number <span class="text-red-500">*</span></label
                  >
                  <input
                    id="cnic"
                    required
                    v-model="formData.cnic"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="XXXXX-XXXXXXX-X"
                    @input="formatCNIC"
                  />
                </div>

                <div>
                  <label
                    for="phone"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Phone Number <span class="text-red-500">*</span></label
                  >
                  <input
                    id="phone"
                    required
                    v-model="formData.phone_number"
                    type="number"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="03XX-XXXXXXX"
                  />
                </div>

                <div>
                  <label
                    for="muhalla"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Muhalla/Street <span class="text-red-500">*</span></label
                  >
                  <input
                    id="muhalla"
                    required
                    v-model="formData.muhalla"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter muhalla"
                  />
                </div>

                <div>
                  <label
                    for="village"
                    class="block text-sm font-medium text-gray-700 mb-2"
                    >Village <span class="text-red-500">*</span></label
                  >
                  <input
                    id="village"
                    required
                    v-model="formData.village"
                    type="text"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder="Enter village"
                  />
                </div>

                <div>
                  <label
                    for="district"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    District {{ formData.district
                    }}<span class="text-red-500">*</span>
                  </label>
                  <select
                    id="district"
                    required
                    v-model="formData.district"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer"
                  >
                    <option value="" disabled selected>Select District</option>
                    <option
                      v-for="district in districts"
                      :key="district.id"
                      :value="district.id"
                    >
                      {{ district.name }}
                    </option>
                  </select>
                </div>

                <div class="mt-4">
                  <label
                    for="tehsil"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tehsil {{ formData.tehsil
                    }}<span class="text-red-500">*</span>
                  </label>
                  <select
                    id="tehsil"
                    required
                    v-model="formData.tehsil"
                    :disabled="!formData.district"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <option value="" disabled selected>Select Tehsil</option>
                    <option
                      v-for="tehsil in filteredTehsils"
                      :key="tehsil.id"
                      :value="tehsil.id"
                    >
                      {{ tehsil.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <!-- Disaster Information Section -->
          <section
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-red-100 rounded-lg">
                  <LucideAlertTriangle class="w-5 h-5 text-red-600" />
                </div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Disaster Information
                </h2>
              </div>
            </div>

            <div class="p-6">
              <div class="max-w-md">
                <label
                  for="d_type"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >Disaster Type <span class="text-red-500">*</span></label
                >
                <select
                  id="d_type"
                  required
                  v-model="formData.disaster_type"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white cursor-pointer"
                >
                  <option value="">Select Disaster Type</option>
                  <option value="Fire">🔥 Fire</option>
                  <option value="Flood">🌊 Flood</option>
                  <option value="Earthquake">🌍 Earthquake</option>
                  <option value="Land_slide">⛰️ Landslide</option>
                  <option value="Storm">🌪️ Storm</option>
                  <option value="Drought">☀️ Drought</option>
                </select>
              </div>
            </div>
          </section>

          <!-- Report Location Section -->
          <section
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <LucideMapPin class="w-5 h-5 text-green-600" />
                </div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Report Location
                </h2>
              </div>
            </div>

            <div class="p-6">
              <div>
                <label
                  for="gps"
                  class="block text-sm font-medium text-gray-700 mb-2"
                  >GPS Coordinates <span class="text-red-500">*</span></label
                >
                <div class="flex space-x-3">
                  <div class="flex-1 relative">
                    <input
                      id="gps"
                      required
                      v-model="formData.location"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors bg-white"
                      placeholder="Latitude, Longitude"
                    />
                  </div>
                  <button
                    type="button"
                    @click="openMapPicker"
                    class="inline-flex items-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <LucideMap class="w-4 h-4 mr-2" />
                    Pick on Map
                  </button>
                </div>

                <div
                  v-if="formData.location"
                  class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div class="flex items-start space-x-4">
                    <img
                      :src="getMapPreviewUrl(formData.location)"
                      alt="Location preview"
                      class="w-32 h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <div class="flex-1">
                      <p class="text-sm text-gray-600 mb-2">
                        Coordinates: {{ formData.location }}
                      </p>
                      <a
                        :href="getGoogleMapsUrl(formData.location)"
                        target="_blank"
                        class="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View on Google Maps
                        <LucideExternalLink class="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Animals Impact Section -->
          <section
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <LucideDog class="w-5 h-5 text-purple-600" />
                </div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Animals Impact Assessment
                </h2>
              </div>
            </div>

            <div class="p-6">
              <div class="mb-6">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="formData.are_animals_impacted"
                    class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  />
                  <span class="ml-3 text-sm font-medium text-gray-700">
                    Animals were impacted in this disaster
                  </span>
                </label>
              </div>

              <div v-if="formData.are_animals_impacted" class="space-y-6">
                <!-- Large Animals -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3
                    class="text-base font-semibold text-gray-900 mb-4 flex items-center"
                  >
                    <span
                      class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2"
                    >
                      <span class="text-xl">🐄</span>
                    </span>
                    Large Animals
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white rounded-lg p-4 border border-red-200">
                      <label class="block text-sm font-medium text-red-700 mb-3"
                        >Deaths</label
                      >
                      <div class="flex items-center justify-center space-x-3">
                        <button
                          type="button"
                          @click="decrementAnimal('big', 'death')"
                          class="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center text-xl font-bold"
                        >
                          −
                        </button>
                        <input
                          v-model.number="formData.big_animals_death_count"
                          type="number"
                          min="0"
                          class="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold"
                        />
                        <button
                          type="button"
                          @click="incrementAnimal('big', 'death')"
                          class="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div
                      class="bg-white rounded-lg p-4 border border-orange-200"
                    >
                      <label
                        class="block text-sm font-medium text-orange-700 mb-3"
                        >Injured</label
                      >
                      <div class="flex items-center justify-center space-x-3">
                        <button
                          type="button"
                          @click="decrementAnimal('big', 'injured')"
                          class="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center text-xl font-bold"
                        >
                          −
                        </button>
                        <input
                          v-model.number="formData.big_animals_injured_count"
                          type="number"
                          min="0"
                          class="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold"
                        />
                        <button
                          type="button"
                          @click="incrementAnimal('big', 'injured')"
                          class="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Small Animals -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h3
                    class="text-base font-semibold text-gray-900 mb-4 flex items-center"
                  >
                    <span
                      class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2"
                    >
                      <span class="text-xl">🐑</span>
                    </span>
                    Small Animals
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white rounded-lg p-4 border border-red-200">
                      <label class="block text-sm font-medium text-red-700 mb-3"
                        >Deaths</label
                      >
                      <div class="flex items-center justify-center space-x-3">
                        <button
                          type="button"
                          @click="decrementAnimal('small', 'death')"
                          class="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center text-xl font-bold"
                        >
                          −
                        </button>
                        <input
                          v-model.number="formData.small_animals_death_count"
                          type="number"
                          min="0"
                          class="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg font-semibold"
                        />
                        <button
                          type="button"
                          @click="incrementAnimal('small', 'death')"
                          class="w-10 h-10 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div
                      class="bg-white rounded-lg p-4 border border-orange-200"
                    >
                      <label
                        class="block text-sm font-medium text-orange-700 mb-3"
                        >Injured</label
                      >
                      <div class="flex items-center justify-center space-x-3">
                        <button
                          type="button"
                          @click="decrementAnimal('small', 'injured')"
                          class="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center text-xl font-bold"
                        >
                          −
                        </button>
                        <input
                          v-model.number="formData.small_animals_injured_count"
                          type="number"
                          min="0"
                          class="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold"
                        />
                        <button
                          type="button"
                          @click="incrementAnimal('small', 'injured')"
                          class="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Humans Impact Section -->
          <section
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="px-6 py-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-b border-gray-200"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-yellow-100 rounded-lg">
                  <LucideUsers class="w-5 h-5 text-yellow-600" />
                </div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Human Impact Assessment
                </h2>
              </div>
            </div>

            <div class="p-6">
              <div class="mb-6">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="formData.are_humans_impacted"
                    class="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 cursor-pointer"
                  />
                  <span class="ml-3 text-sm font-medium text-gray-700">
                    Humans were impacted in this disaster
                  </span>
                </label>
              </div>

              <div v-if="formData.are_humans_impacted">
                <div
                  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
                >
                  <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <label class="block text-xs font-medium text-gray-600 mb-1"
                      >Total Residents</label
                    >
                    <input
                      v-model.number="formData.total_residents_count"
                      type="number"
                      min="0"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg font-semibold text-center"
                    />
                  </div>
                </div>

                <div
                  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                >
                  <div
                    class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200"
                  >
                    <label class="block text-xs font-medium text-red-700 mb-2"
                      >Deaths</label
                    >
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-bold text-red-900">{{
                        formData.deaths_count
                      }}</span>
                      <div class="flex space-x-1">
                        <button
                          type="button"
                          @click="decrementHuman('deaths')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-red-200 text-red-600 text-lg font-bold"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          @click="incrementHuman('deaths')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-red-200 text-red-600 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200"
                  >
                    <label
                      class="block text-xs font-medium text-orange-700 mb-2"
                      >Injured</label
                    >
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-bold text-orange-900">{{
                        formData.injured_count
                      }}</span>
                      <div class="flex space-x-1">
                        <button
                          type="button"
                          @click="decrementHuman('injured')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-orange-200 text-orange-600 text-lg font-bold"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          @click="incrementHuman('injured')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-orange-200 text-orange-600 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200"
                  >
                    <label class="block text-xs font-medium text-pink-700 mb-2"
                      >Pregnant Women</label
                    >
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-bold text-pink-900">{{
                        formData.pregnant_women_count
                      }}</span>
                      <div class="flex space-x-1">
                        <button
                          type="button"
                          @click="decrementHuman('pregnant')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-pink-200 text-pink-600 text-lg font-bold"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          @click="incrementHuman('pregnant')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-pink-200 text-pink-600 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
                  >
                    <label class="block text-xs font-medium text-blue-700 mb-2"
                      >Disabled Persons</label
                    >
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-bold text-blue-900">{{
                        formData.disabled_persons_count
                      }}</span>
                      <div class="flex space-x-1">
                        <button
                          type="button"
                          @click="decrementHuman('disabled')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-blue-200 text-blue-600 text-lg font-bold"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          @click="incrementHuman('disabled')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-blue-200 text-blue-600 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
                  >
                    <label class="block text-xs font-medium text-green-700 mb-2"
                      >School Children</label
                    >
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-bold text-green-900">{{
                        formData.school_going_children_count
                      }}</span>
                      <div class="flex space-x-1">
                        <button
                          type="button"
                          @click="decrementHuman('children')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-green-200 text-green-600 text-lg font-bold"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          @click="incrementHuman('children')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-green-200 text-green-600 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200"
                  >
                    <label
                      class="block text-xs font-medium text-purple-700 mb-2"
                      >Married Couples</label
                    >
                    <div class="flex items-center justify-between">
                      <span class="text-2xl font-bold text-purple-900">{{
                        formData.married_couples_count
                      }}</span>
                      <div class="flex space-x-1">
                        <button
                          type="button"
                          @click="decrementHuman('couples')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-purple-200 text-purple-600 text-lg font-bold"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          @click="incrementHuman('couples')"
                          class="w-7 h-7 bg-white rounded-md hover:bg-purple-200 text-purple-600 text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Properties Impact Section -->
          <section
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div
              class="px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <LucideHome class="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Property Impact Assessment
                  </h2>
                </div>
                <span
                  v-if="propertyValidationErrors.length > 0"
                  class="text-sm text-red-600 font-medium"
                >
                  ⚠️ {{ propertyValidationErrors.length }} issue(s) found
                </span>
              </div>
            </div>

            <div class="p-6">
              <div class="mb-6">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="formData.are_properties_impacted"
                    @change="handlePropertyImpactToggle"
                    class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span class="ml-3 text-sm font-medium text-gray-700">
                    Properties were impacted in this disaster
                  </span>
                </label>
              </div>

              <div v-if="formData.are_properties_impacted" class="space-y-4">
                <!-- Show validation summary if there are errors -->
                <div
                  v-if="propertyValidationErrors.length > 0"
                  class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
                >
                  <h4 class="text-sm font-medium text-red-800 mb-2">
                    Please fix the following issues:
                  </h4>
                  <ul
                    class="list-disc list-inside text-sm text-red-700 space-y-1"
                  >
                    <li
                      v-for="(error, idx) in propertyValidationErrors"
                      :key="idx"
                    >
                      {{ error }}
                    </li>
                  </ul>
                </div>

                <div
                  v-for="(property, index) in formData.property_details"
                  :key="index"
                  class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
                  :class="{
                    'border-red-300 bg-red-50/30': hasPropertyErrors(index),
                  }"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <h3 class="text-base font-semibold text-gray-900">
                        Property #{{ index + 1 }}
                      </h3>
                      <span
                        v-if="hasPropertyErrors(index)"
                        class="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full"
                      >
                        Incomplete
                      </span>
                    </div>
                    <button
                      type="button"
                      @click="removeProperty(index)"
                      class="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LucideTrash class="w-5 h-5" />
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Property Type <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="property.property_type"
                        @change="clearPropertyError(index, 'type')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        :class="
                          propertyErrors[index]?.type
                            ? 'border-red-500'
                            : 'border-gray-300'
                        "
                      >
                        <option value="">Select Property Type</option>
                        <option value="Home">🏠 House</option>
                        <option value="Shop">🏪 Shop</option>
                        <option value="Farm/Field">🌾 Farm/Field</option>
                        <option value="Warehouse">🏭 Warehouse</option>
                      </select>
                      <p
                        v-if="propertyErrors[index]?.type"
                        class="mt-1 text-xs text-red-600"
                      >
                        {{ propertyErrors[index].type }}
                      </p>
                    </div>

                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Impact Level <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="property.impact_level"
                        @change="clearPropertyError(index, 'impact')"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        :class="
                          propertyErrors[index]?.impact
                            ? 'border-red-500'
                            : 'border-gray-300'
                        "
                      >
                        <option value="">Select Impact Level</option>
                        <option value="minor">Minor Damage</option>
                        <option value="major">Major Damage</option>
                        <option value="fully_destroyed">
                          Completely Destroyed
                        </option>
                      </select>
                      <p
                        v-if="propertyErrors[index]?.impact"
                        class="mt-1 text-xs text-red-600"
                      >
                        {{ propertyErrors[index].impact }}
                      </p>
                    </div>
                  </div>

                  <!-- IMAGE UPLOAD SECTION -->
                  <div class="mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Property Image <span class="text-red-500">*</span>
                    </label>

                    <div class="flex items-start space-x-4">
                      <!-- Image Preview -->
                      <div class="relative">
                        <img
                          v-if="
                            property.imagePreview || property.evidence_image_url
                          "
                          :src="
                            property.imagePreview || property.evidence_image_url
                          "
                          :alt="property.property_type"
                          class="w-24 h-24 object-cover rounded-lg border"
                          :class="
                            propertyErrors[index]?.image
                              ? 'border-red-400'
                              : 'border-gray-200'
                          "
                        />
                        <div
                          v-else
                          class="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed flex items-center justify-center"
                          :class="
                            propertyErrors[index]?.image
                              ? 'border-red-400 bg-red-50'
                              : 'border-gray-300'
                          "
                        >
                          <span
                            class="text-3xl"
                            :class="
                              propertyErrors[index]?.image
                                ? 'text-red-400'
                                : 'text-gray-400'
                            "
                            >🖼️</span
                          >
                        </div>
                      </div>

                      <!-- Upload Controls -->
                      <div class="flex-1">
                        <input
                          type="file"
                          :ref="
                            (el) => {
                              if (el) fileInputRefs[index] = el;
                            }
                          "
                          @change="(e) => handleImageUpload(e, index)"
                          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                          class="hidden"
                        />

                        <div class="space-y-3">
                          <div
                            v-if="
                              property.evidence_image_url &&
                              !property.imagePreview
                            "
                          >
                            <p class="text-sm text-gray-600 mb-2">
                              Current image from Cloudinary
                            </p>
                            <div class="flex space-x-2">
                              <button
                                type="button"
                                @click="triggerFileInput(index)"
                                class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                <LucideUpload class="w-4 h-4 mr-2" />
                                Change Image
                              </button>
                            </div>
                          </div>

                          <div v-else-if="property.imagePreview">
                            <p
                              class="text-sm text-green-600 mb-2 flex items-center"
                            >
                              <span
                                class="w-2 h-2 bg-green-500 rounded-full mr-2"
                              ></span>
                              New image selected
                            </p>
                            <div class="flex space-x-2">
                              <button
                                type="button"
                                @click="triggerFileInput(index)"
                                class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                              >
                                <LucideUpload class="w-4 h-4 mr-2" />
                                Choose Different
                              </button>
                              <button
                                type="button"
                                @click="clearNewImage(index)"
                                class="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                            <p
                              v-if="property.imageFile"
                              class="text-xs text-gray-500 mt-2"
                            >
                              📁 {{ property.imageFile.name }} ({{
                                formatFileSize(property.imageFile.size)
                              }})
                            </p>
                          </div>

                          <div v-else>
                            <button
                              type="button"
                              @click="triggerFileInput(index)"
                              class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              <LucideUpload class="w-4 h-4 mr-2" />
                              Upload Image
                            </button>
                            <p class="text-xs text-gray-500 mt-2">
                              Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                            </p>
                          </div>

                          <!-- Validation Messages -->
                          <p
                            v-if="property.imageError"
                            class="text-xs text-red-600 flex items-center"
                          >
                            <LucideAlertCircle class="w-3 h-3 mr-1" />
                            {{ property.imageError }}
                          </p>
                          <p
                            v-if="propertyErrors[index]?.image"
                            class="text-xs text-red-600 flex items-center"
                          >
                            <LucideAlertCircle class="w-3 h-3 mr-1" />
                            {{ propertyErrors[index].image }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  @click="addProperty"
                  class="w-full py-3 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center"
                >
                  <LucidePlus class="w-5 h-5 mr-2" />
                  Add Another Property
                </button>
              </div>
            </div>
          </section>

          <!-- Form Actions -->
          <div
            class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200"
          >
            <button
              type="button"
              @click="resetForm"
              :disabled="!reportLoaded"
              class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !reportLoaded"
              class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <LucideSave class="w-4 h-4 mr-2" />
              {{ isSubmitting ? "Saving..." : "Save Modifications" }}
            </button>
          </div>
        </div>
      </form>

      <!-- Reusable Modal Component -->
      <ReusableModal
        :isOpen="modalConfig.isOpen"
        @close="closeModal"
        :showCloseButton="modalConfig.showCloseButton"
        :preventClose="modalConfig.preventClose"
      >
        <template #icon>
          <div
            :class="[
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto',
              modalConfig.iconBgClass,
            ]"
          >
            <Icon
              :name="modalConfig.icon || 'i-lucide-info'"
              :is="modalConfig.icon || 'i-lucide-info'"
              :class="['w-10 h-10', modalConfig.iconColorClass]"
            />
          </div>
        </template>

        <template #title>
          {{ modalConfig.title }}
        </template>

        <template #content>
          <p>{{ modalConfig.message }}</p>

          <!-- Display tasks if they exist -->
          <div
            v-if="modalConfig.tasks && modalConfig.tasks.length > 0"
            class="mt-4"
          >
            <p class="text-sm font-medium text-gray-700 mb-2">
              Tasks performed:
            </p>
            <ul class="space-y-1">
              <li
                v-for="(task, idx) in modalConfig.tasks"
                :key="idx"
                class="flex items-start"
              >
                <LucideCheckCircle
                  class="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                />
                <span class="text-sm text-gray-600">{{ task }}</span>
              </li>
            </ul>
          </div>

          <!-- Validation errors display -->
          <div v-if="modalConfig.type === 'validation'" class="mt-4 text-left">
            <ul class="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li
                v-for="(error, idx) in modalConfig.validationErrors"
                :key="idx"
              >
                {{ error }}
              </li>
            </ul>
          </div>
        </template>

        <template #actions>
          <template v-if="modalConfig.type === 'success'">
            <button
              @click="handleModalConfirm"
              class="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              {{ modalConfig.confirmText || "Continue" }}
            </button>
          </template>

          <template
            v-else-if="
              modalConfig.type === 'error' || modalConfig.type === 'validation'
            "
          >
            <button
              @click="closeModal"
              class="w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              {{ modalConfig.confirmText || "OK" }}
            </button>
          </template>

          <template v-else-if="modalConfig.type === 'confirm'">
            <button
              @click="closeModal"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              {{ modalConfig.cancelText || "Cancel" }}
            </button>
            <button
              @click="handleModalConfirm"
              class="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {{ modalConfig.confirmText || "Confirm" }}
            </button>
          </template>
        </template>
      </ReusableModal>
    </template>
  </div>
</template>

<script setup>
import coordinatePicker from "~/components/coordinatesPicker.vue";
import ReusableModal from "~/components/reusableModal.vue";
import adminFormGuide from "~/components/adminFormGuide.vue";
import { useAdminStore } from "~/stores/admin";

const route = useRoute();
const router = useRouter();
// Nuxt specific
definePageMeta({
  middleware: "role-check",
  allowedRoles: ["admin", "super_admin"],
});
useSeoMeta({
  title: `Update Report ${route.params.id}`,
});

// State
const isSubmitting = ref(false);
const isLoadingReport = ref(true);
const reportLoaded = ref(false);
const reportError = ref(null);
const originalData = ref(null);
const fileInputRefs = ref([]);
const propertyErrors = ref([]);
const showMapPicker = ref(false);
const coordinatesToVerify = ref([]);

// Complete Districts of Malakand Division
const districts = ref(
  [
    { id: "Bajaur", name: "Bajaur" },
    { id: "Buner", name: "Buner" },
    { id: "Central_Dir", name: "Central Dir" },
    { id: "Lower_Chitral", name: "Lower Chitral" },
    { id: "Lower_Dir", name: "Lower Dir" },
    { id: "Malakand", name: "Malakand" },
    { id: "Shangla", name: "Shangla" },
    { id: "Swat", name: "Swat" },
    { id: "Upper_Chitral", name: "Upper Chitral" },
    { id: "Upper_Dir", name: "Upper Dir" },
  ].sort((a, b) => a.id.localeCompare(b.id))
);

const tehsils = ref([
  // Swat District
  { id: "Babuzai", districtId: "Swat", name: "Babuzai" },
  { id: "Bahrain", districtId: "Swat", name: "Bahrain" },
  { id: "Barikot", districtId: "Swat", name: "Barikot" },
  { id: "Charbagh", districtId: "Swat", name: "Charbagh" },
  { id: "Kabal", districtId: "Swat", name: "Kabal" },
  { id: "Khwazakhela", districtId: "Swat", name: "Khwazakhela" },
  { id: "Matta", districtId: "Swat", name: "Matta" },

  // Lower Dir District
  { id: "Adenzai", districtId: "Lower_Dir", name: "Adenzai" },
  { id: "Balambat", districtId: "Lower_Dir", name: "Balambat" },
  { id: "khal", districtId: "Lower_Dir", name: "Khal" },
  { id: "Lal_qila", districtId: "Lower_Dir", name: "Lal Qila" },
  { id: "Munda", districtId: "Lower_Dir", name: "Munda" },
  { id: "Samar_bagh", districtId: "Lower_Dir", name: "Samar Bagh" },
  { id: "Timergara", districtId: "Lower_Dir", name: "Timergara" },

  // Upper Dir District
  { id: "Barawal", districtId: "Upper_Dir", name: "Barawal" },
  { id: "Dir", districtId: "Upper_Dir", name: "Dir" },
  { id: "Kalkot", districtId: "Upper_Dir", name: "Kalkot" },
  { id: "Shiringal", districtId: "Upper_Dir", name: "Shiringal" },

  // Central Dir District
  { id: "Larjam", districtId: "Central_Dir", name: "Larjum" },
  { id: "Wari", districtId: "Central_Dir", name: "Wari" },
  { id: "Akhagram_karo", districtId: "Central_Dir", name: "Akhagram Karo" },
  { id: "Nehag_dara", districtId: "Central_Dir", name: "Nehag Dara" },
  { id: "Sahib_abad", districtId: "Central_Dir", name: "Sahib Abad" },

  // Lower Chitral District
  { id: "Chitral", districtId: "Lower_Chitral", name: "Chitral" },
  { id: "Drosh", districtId: "Lower_Chitral", name: "Drosh" },

  // Upper Chitral District
  { id: "Mastuj", districtId: "Upper_Chitral", name: "Mastuj" },

  // Malakand District
  { id: "Sam_ranizai", districtId: "Malakand", name: "Sam Ranizai" },
  { id: "Swat_ranizai", districtId: "Malakand", name: "Swat Ranizai" },
  { id: "Thana_baizai", districtId: "Malakand", name: "Thana Baizai" },
  { id: "Utman_khel", districtId: "Malakand", name: "Utman Khel" },

  // Buner District
  { id: "Chagharzai", districtId: "Buner", name: "Chagharzai" },
  { id: "Daggar", districtId: "Buner", name: "Daggar" },
  { id: "Gadezai", districtId: "Buner", name: "Gadezai" },
  { id: "Gagra", districtId: "Buner", name: "Gagra" },
  { id: "Khudu_Khel", districtId: "Buner", name: "Khudu Khel" },
  { id: "Mandanr", districtId: "Buner", name: "Mandanr" },

  // Shangla District
  { id: "Alpuri", districtId: "Shangla", name: "Alpuri" },
  { id: "Bisham", districtId: "Shangla", name: "Bisham" },
  { id: "Chakesar", districtId: "Shangla", name: "Chakesar" },
  { id: "Makhuzai", districtId: "Shangla", name: "Makhuzai" },
  { id: "Martung", districtId: "Shangla", name: "Martung" },
  { id: "Puran", districtId: "Shangla", name: "Puran" },
  { id: "Shahpur", districtId: "Shangla", name: "Shahpur" },

  // Bajaur District
  { id: "Bar_chamarkand", districtId: "Bajaur", name: "Bar Chamarkand" },
  { id: "Barang", districtId: "Bajaur", name: "Barang" },
  { id: "Khar_bajaur", districtId: "Bajaur", name: "Khar Bajaur" },
  { id: "Loe_Mamund", districtId: "Bajaur", name: "Loe Mamund" },
  { id: "Wara_Mamund", districtId: "Bajaur", name: "Wara Mamund" },
  { id: "Nawagai", districtId: "Bajaur", name: "Nawagai" },
  { id: "Salarzai", districtId: "Bajaur", name: "Salarzai" },
  { id: "Utmankhel_bajaur", districtId: "Bajaur", name: "Utman Khel" },
]);

const filteredTehsils = computed(() => {
  if (!formData.district) return [];

  // No more .toLowerCase() needed as keys now match your capitalized API strings
  return tehsils.value
    .filter((tehsil) => tehsil.districtId === formData.district)
    .sort((a, b) => a.name.localeCompare(b.name));
});

// Modal configuration
const modalConfig = reactive({
  isOpen: false,
  type: "info", // 'success', 'error', 'validation', 'confirm', 'info'
  title: "",
  message: "",
  icon: "i-lucide-info",
  iconBgClass: "bg-blue-100",
  iconColorClass: "text-blue-600",
  showCloseButton: true,
  preventClose: false,
  confirmText: "",
  cancelText: "",
  validationErrors: [],
  tasks: [],
  onConfirm: null,
});

// store
const store = useAdminStore();

// Form data
const formData = reactive({
  name: "",
  father_name: "",
  email: "",
  cnic: "",
  phone_number: "",
  muhalla: "",
  village: "",
  tehsil: "",
  district: "",
  report_id: null,
  disaster_type: "",
  location: "",
  submission_date: "",
  verification_status: "",
  are_animals_impacted: false,
  big_animals_death_count: 0,
  big_animals_injured_count: 0,
  small_animals_death_count: 0,
  small_animals_injured_count: 0,
  are_properties_impacted: false,
  property_details: [],
  are_humans_impacted: false,
  total_residents_count: 0,
  deaths_count: 0,
  injured_count: 0,
  pregnant_women_count: 0,
  disabled_persons_count: 0,
  school_going_children_count: 0,
  married_couples_count: 0,
});

// Computed
const verificationStatusClass = computed(() => {
  const status = formData.verification_status?.toLowerCase();
  return {
    "bg-yellow-100 text-yellow-800": status === "pending",
    "bg-green-100 text-green-800": status === "verified",
    "bg-red-100 text-red-800": status === "rejected",
    "bg-gray-100 text-gray-800": !status,
  };
});

const verificationDotClass = computed(() => {
  const status = formData.verification_status?.toLowerCase();
  return {
    "bg-yellow-500": status === "pending",
    "bg-green-500": status === "verified",
    "bg-red-500": status === "rejected",
    "bg-gray-500": !status,
  };
});

const propertyValidationErrors = computed(() => {
  const errors = [];

  if (!formData.are_properties_impacted) return errors;

  formData.property_details.forEach((property, index) => {
    if (!property.property_type) {
      errors.push(`Property #${index + 1}: Property type is required`);
    }
    if (!property.impact_level) {
      errors.push(`Property #${index + 1}: Impact level is required`);
    }
    if (!property.evidence_image_url && !property.imagePreview) {
      errors.push(`Property #${index + 1}: Property image is required`);
    }
  });

  return errors;
});

// Modal helper functions
const showSuccessModal = (message, onConfirm = null, tasks = []) => {
  modalConfig.type = "success";
  modalConfig.title = "Success!";
  modalConfig.message = message;
  modalConfig.icon = "i-lucide-check-circle";
  modalConfig.iconBgClass = "bg-green-100";
  modalConfig.iconColorClass = "text-green-600";
  modalConfig.confirmText = "Continue";
  modalConfig.showCloseButton = true;
  modalConfig.preventClose = false;
  modalConfig.tasks = tasks;
  modalConfig.onConfirm = onConfirm;
  modalConfig.isOpen = true;
};

const showErrorModal = (message) => {
  modalConfig.type = "error";
  modalConfig.title = "Error";
  modalConfig.message = message;
  modalConfig.icon = "i-lucide-circle-x"; // Fixed from check-circle to error 'X'
  modalConfig.iconBgClass = "bg-red-100";
  modalConfig.iconColorClass = "text-red-600";
  modalConfig.confirmText = "OK";
  modalConfig.showCloseButton = true;
  modalConfig.preventClose = false;
  modalConfig.tasks = [];
  modalConfig.onConfirm = null;
  modalConfig.isOpen = true;
};

const showValidationModal = (errors) => {
  modalConfig.type = "validation";
  modalConfig.title = "Validation Errors";
  modalConfig.message = "Please fix the following issues:";
  modalConfig.icon = "i-lucide-circle-alert"; // Fixed from check-circle to an alert
  modalConfig.iconBgClass = "bg-yellow-100";
  modalConfig.iconColorClass = "text-yellow-600";
  modalConfig.confirmText = "OK";
  modalConfig.showCloseButton = true;
  modalConfig.preventClose = false;
  modalConfig.validationErrors = errors;
  modalConfig.tasks = [];
  modalConfig.onConfirm = null;
  modalConfig.isOpen = true;
};

const showConfirmModal = (
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel"
) => {
  modalConfig.type = "confirm";
  modalConfig.title = title;
  modalConfig.message = message;
  modalConfig.icon = "i-lucide-circle-help"; // Updated to @nuxt/icon string format
  modalConfig.iconBgClass = "bg-blue-100";
  modalConfig.iconColorClass = "text-blue-600";
  modalConfig.confirmText = confirmText;
  modalConfig.cancelText = cancelText;
  modalConfig.showCloseButton = true;
  modalConfig.preventClose = false;
  modalConfig.tasks = [];
  modalConfig.onConfirm = onConfirm;
  modalConfig.isOpen = true;
};

const closeModal = () => {
  modalConfig.isOpen = false;
};

const handleModalConfirm = () => {
  if (modalConfig.onConfirm) {
    modalConfig.onConfirm();
  }
  closeModal();
};

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCNIC = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  if (value.length > 5) {
    value = value.slice(0, 5) + "-" + value.slice(5);
  }
  if (value.length > 13) {
    value = value.slice(0, 13) + "-" + value.slice(13);
  }
  formData.cnic = value.slice(0, 15);
};

const incrementAnimal = (size, type) => {
  const field = `${size}_animals_${type}_count`;
  formData[field]++;
};

const decrementAnimal = (size, type) => {
  const field = `${size}_animals_${type}_count`;
  if (formData[field] > 0) {
    formData[field]--;
  }
};

const incrementHuman = (type) => {
  const fieldMap = {
    deaths: "deaths_count",
    injured: "injured_count",
    pregnant: "pregnant_women_count",
    disabled: "disabled_persons_count",
    children: "school_going_children_count",
    couples: "married_couples_count",
  };
  formData[fieldMap[type]]++;
};

const decrementHuman = (type) => {
  const fieldMap = {
    deaths: "deaths_count",
    injured: "injured_count",
    pregnant: "pregnant_women_count",
    disabled: "disabled_persons_count",
    children: "school_going_children_count",
    couples: "married_couples_count",
  };
  if (formData[fieldMap[type]] > 0) {
    formData[fieldMap[type]]--;
  }
};

// Property validation methods
const hasPropertyErrors = (index) => {
  return (
    propertyErrors.value[index] &&
    Object.keys(propertyErrors.value[index]).length > 0
  );
};

const clearPropertyError = (index, field) => {
  if (propertyErrors.value[index]) {
    delete propertyErrors.value[index][field];
  }
};

const validateProperty = (index) => {
  const property = formData.property_details[index];
  const errors = {};

  if (!property.property_type) {
    errors.type = "Property type is required";
  }

  if (!property.impact_level) {
    errors.impact = "Impact level is required";
  }

  if (!property.evidence_image_url && !property.imagePreview) {
    errors.image = "Property image is required";
  }

  propertyErrors.value[index] = errors;
  return Object.keys(errors).length === 0;
};

const validateAllProperties = () => {
  if (!formData.are_properties_impacted) return true;

  let isValid = true;
  formData.property_details.forEach((_, index) => {
    if (!validateProperty(index)) {
      isValid = false;
    }
  });
  return isValid;
};

// File handling methods
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateImageFile = (file) => {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return "Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)";
  }

  if (file.size > maxSize) {
    return "File size exceeds 5MB limit";
  }

  return null;
};

const triggerFileInput = (index) => {
  fileInputRefs.value[index]?.click();
};

const handleImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (!file) return;

  const property = formData.property_details[index];

  // Validate file
  const error = validateImageFile(file);
  if (error) {
    property.imageError = error;
    event.target.value = "";
    return;
  }

  // Clear any previous errors
  property.imageError = null;
  clearPropertyError(index, "image");

  // Reset to empty URL when user wants to change image
  property.evidence_image_url = "";

  // Store file for upload
  property.imageFile = file;

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    property.imagePreview = e.target.result;
  };
  reader.readAsDataURL(file);

  event.target.value = "";
};

const clearNewImage = (index) => {
  const property = formData.property_details[index];
  const originalProperty = originalData.value?.property_details?.[index];

  if (originalProperty) {
    property.evidence_image_url = originalProperty.evidence_image_url || "";
  } else {
    property.evidence_image_url = "";
  }

  property.imageFile = null;
  property.imagePreview = null;
  property.imageError = null;

  if (fileInputRefs.value[index]) {
    fileInputRefs.value[index].value = "";
  }

  validateProperty(index);
};

const handlePropertyImpactToggle = () => {
  if (!formData.are_properties_impacted) {
    formData.property_details = [];
    propertyErrors.value = [];
  }
};

const addProperty = () => {
  formData.property_details.push({
    REPORT_ID: formData.report_id,
    impact_id: null,
    impact_level: "",
    property_type: "",
    evidence_image_url: "",
    imageFile: null,
    imagePreview: null,
    imageError: null,
  });

  propertyErrors.value.push({});
};

const removeProperty = (index) => {
  formData.property_details.splice(index, 1);
  propertyErrors.value.splice(index, 1);
};

const getMapPreviewUrl = (coordinates) => {
  const [lat, lon] = coordinates.split(",").map((c) => c.trim());
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+ff0000(${lon},${lat})/${lon},${lat},14/300x200?access_token=YOUR_MAPBOX_TOKEN`;
};

const getGoogleMapsUrl = (coordinates) => {
  return `https://www.google.com/maps?q=${coordinates}`;
};

const openMapPicker = () => {
  // Parse existing coordinates if any
  if (formData.location) {
    const [lat, lng] = formData.location
      .split(",")
      .map((c) => parseFloat(c.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      coordinatesToVerify.value = [
        {
          id: 1,
          name: "Report Location",
          lat: lat,
          lng: lng,
          confirmed: false,
        },
      ];
    } else {
      coordinatesToVerify.value = [];
    }
  } else {
    // Default coordinates if none exist
    coordinatesToVerify.value = [
      {
        id: 1,
        name: "Report Location",
        lat: 36.65544,
        lng: 72.26369,
        confirmed: false,
      },
    ];
  }

  showMapPicker.value = true;
};

// Handle confirmed coordinates
const handleCoordinatesConfirmed = (locations) => {
  if (locations.length > 0) {
    const confirmedLocation = locations[0];
    formData.location = `${confirmedLocation.lat.toFixed(
      6
    )}, ${confirmedLocation.lng.toFixed(6)}`;
  }
  showMapPicker.value = false;
};
// Handle coordinate adjustments
const handleCoordinatesAdjusted = (location) => {
  formData.location = `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`;
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
        suggestion:
          "Navigate to the reports page and select a report to modify.",
      },
    };
  }

  const numericId = Number(id);
  if (isNaN(numericId) || numericId <= 0 || !Number.isInteger(numericId)) {
    return {
      valid: false,
      error: {
        title: "Invalid Report ID",
        message: `"${id}" is not a valid report ID. Report IDs must be positive whole numbers.`,
        suggestion:
          "Please check the URL and ensure it contains a valid numeric report ID.",
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
  if (errorResponse?.response?._data) {
    const data = errorResponse.response._data;

    if (data.status === "error" && data.message) {
      return {
        title: `Error ${data.statusCode || "Unknown"}`,
        message: data.message,
        suggestion:
          data.statusCode === 404
            ? "The report may have been deleted or the URL might be incorrect. Please verify the report ID."
            : "Please try again or contact support if the issue persists.",
      };
    }

    if (data.message) {
      return {
        title: "Error",
        message: data.message,
        suggestion:
          "Please try again or contact support if the issue persists.",
      };
    }
  }

  if (errorResponse?.message === "Network Error") {
    return {
      title: "Network Error",
      message:
        "Unable to connect to the server. Please check your internet connection and try again.",
      suggestion:
        "Verify your internet connection and ensure the server is running.",
    };
  }

  if (errorResponse?.code === "ECONNABORTED") {
    return {
      title: "Request Timeout",
      message: "The request took too long to complete. Please try again later.",
      suggestion:
        "The server might be experiencing high load. Please wait a moment and try again.",
    };
  }

  return {
    title: "Unexpected Error",
    message:
      errorResponse?.message ||
      "An unexpected error occurred while loading the report.",
    suggestion: "Please try again or contact support if the issue persists.",
  };
};

const loadReportData = async () => {
  isLoadingReport.value = true;
  reportError.value = null;
  reportLoaded.value = false;

  const validation = validateReportId(route.params.id);
  if (!validation.valid) {
    reportError.value = validation.error;
    isLoadingReport.value = false;
    return;
  }

  try {
    const response = await store.fetchSingleReport(validation.numericId);

    if (!response || typeof response !== "object") {
      throw new Error("Invalid response format from server");
    }

    if (response.status === "error") {
      reportError.value = {
        title: `Error ${response.statusCode || ""}`,
        message: response.message || "Failed to load the requested report.",
        suggestion:
          "Please try again or contact support if the issue persists.",
      };
      isLoadingReport.value = false;
      return;
    }

    // if (response.property_details) {
    //   response.property_details = response.property_details.map((property) => ({
    //     ...property,
    //     imageFile: null,
    //     imagePreview: null,
    //     imageError: null,
    //   }));

    //   propertyErrors.value = response.property_details.map(() => ({}));
    // }

    Object.assign(formData, response);
    originalData.value = JSON.parse(JSON.stringify(response));
    reportLoaded.value = true;
    isLoadingReport.value = false;
  } catch (err) {
    console.error("Error loading report:", err.response);

    const errorInfo = extractErrorMessage(err);

    if (
      err?.response?.status === 404 ||
      err?.response?._data?.statusCode === 404
    ) {
      errorInfo.title = "Report Not Found";
      errorInfo.message = "The requested report could not be found.";
      errorInfo.suggestion =
        "The report may have been deleted or the URL might be incorrect. Please verify the report ID and try again.";
    }

    reportError.value = errorInfo;
    isLoadingReport.value = false;
  }
};

const retryLoadReport = () => {
  loadReportData();
};

const resetForm = () => {
  showConfirmModal(
    "Reset Changes",
    "Are you sure you want to reset all changes? This action cannot be undone.",
    () => {
      if (originalData.value) {
        Object.assign(formData, JSON.parse(JSON.stringify(originalData.value)));
        propertyErrors.value = formData.property_details.map(() => ({}));
      }
    },
    "Reset",
    "Cancel"
  );
};

const handleHumansImpactToggle = () => {
  formData.deaths_count = 0;
  formData.injured_count = 0;
  formData.total_residents_count = 0;
  formData.pregnant_women_count = 0;
  formData.disabled_persons_count = 0;
  formData.school_going_children_count = 0;
  formData.married_couples_count = 0;
};

const handleAnimalImpactToggle = () => {
  formData.big_animals_death_count = 0;
  formData.big_animals_injured_count = 0;
  formData.small_animals_death_count = 0;
  formData.small_animals_injured_count = 0;
};

const handleSubmit = async () => {
  // Validate properties first
  if (formData.are_properties_impacted) {
    if (formData.property_details.length === 0) {
      showErrorModal("Please add at least one property");
      return;
    }

    if (!validateAllProperties()) {
      showValidationModal(propertyValidationErrors.value);

      // Scroll to properties section
      document
        .querySelector(".bg-gradient-to-r.from-indigo-50")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      return;
    }
  }

  isSubmitting.value = true;

  try {
    if (!formData.are_animals_impacted) {
      handleAnimalImpactToggle();
    }

    if (!formData.are_humans_impacted) {
      handleHumansImpactToggle();
    }

    const formDataToSend = new FormData();
    const reportData = { ...formData };

    reportData.property_details = reportData.property_details.map(
      (property, index) => {
        const { imageFile, imagePreview, imageError, ...propertyMeta } =
          property;

        if (imageFile) {
          formDataToSend.append(`property_images`, imageFile);
        }

        return propertyMeta;
      }
    );

    delete reportData.email;
    delete reportData.verification_status;
    delete reportData.submission_date;

    formDataToSend.append("report_data", JSON.stringify(reportData));

    const response = await store.modifyReport(formDataToSend);
    console.log("Report updated:", response);

    let successMessage = "Report updated successfully!";
    let tasks = [];

    if (Array.isArray(response) && response.length > 0) {
      tasks = response.map((task) => task);
      successMessage = "Report updated successfully!";
    } else if (typeof response === "string") {
      successMessage = response;
    }

    showSuccessModal(
      successMessage,
      () => {
        goBack();
      },
      tasks
    );
  } catch (error) {
    console.error("Error updating report:");
    showErrorModal(error.response?._data?.message ?? "Failed to update report");
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  loadReportData();
});
</script>

<style scoped>
.stat-input::-webkit-inner-spin-button,
.stat-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stat-input {
  -moz-appearance: textfield;
}

.checkbox-input:checked {
  background-color: currentColor;
  border-color: currentColor;
}
</style>