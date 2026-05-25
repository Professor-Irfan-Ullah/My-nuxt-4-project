<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
    <!-- Floating Action Buttons -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <!-- Manual Sync Button (Enhanced) -->
      <button
        v-if="pendingCount > 0 && isOnline && !isSyncing && !hasSubmitted"
        @click="syncPendingReports"
        class="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium group"
      >
        <span class="group-hover:animate-pulse">🔄</span>
        <span>Sync Now</span>
        <span
          class="bg-white text-green-600 rounded-full px-2 py-0.5 text-xs font-bold ml-1"
        >
          {{ pendingCount }}
        </span>
      </button>

      <!-- Retry Failed Reports Button (if you implement failed reports) -->
      <button
        v-if="failedCount > 0 && isOnline && !hasSubmitted"
        @click="retryFailedReports"
        class="bg-orange-500 text-white px-5 py-2.5 rounded-lg shadow-lg hover:bg-orange-600 transition-all duration-200 flex items-center gap-2"
      >
        <span>⚠️</span>
        <span>Retry Failed ({{ failedCount }})</span>
      </button>
    </div>

    <!-- Toast Notification for Sync Status -->
    <div
      v-if="showSyncToast"
      class="fixed bottom-20 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
      :class="{ 'animate-fade-in': showSyncToast }"
    >
      <div class="flex items-center gap-2">
        <span>{{ syncToastIcon }}</span>
        <span>{{ syncToastMessage }}</span>
      </div>
    </div>
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <header class="mb-10 text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          File a New Disaster Report
        </h1>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Provide accurate information to enable rapid response and effective
          aid distribution.
          <span class="text-red-500">* Required fields</span>
        </p>
      </header>

      <!-- Progress Indicator -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Form Progress</span>
          <span class="text-sm font-medium text-blue-600"
            >{{ calculateProgress() }}% Complete</span
          >
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            :style="{ width: calculateProgress() + '%' }"
          ></div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="space-y-8 overflow-hidde">
        <!-- Section 1: Disaster Details -->
        <section class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div class="flex items-center mb-6">
            <div
              class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4"
            >
              <span class="text-blue-600 font-bold">1</span>
            </div>
            <h2 class="text-xl font-bold text-gray-800">Disaster Details</h2>
          </div>

          <div class="space-y-6">
            <!-- Disaster Type -->
            <div>
              <label class="block text-gray-700 font-medium mb-2">
                Type of Disaster <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  v-for="type in disasterTypes"
                  :key="type.value"
                  type="button"
                  @click="disasterType = type.value"
                  :class="[
                    'p-4 rounded-xl border-2 transition-all duration-200',
                    disasterType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300',
                  ]"
                >
                  <div class="text-center">
                    <div class="text-2xl mb-2">{{ type.emoji }}</div>
                    <p class="font-medium">{{ type.label }}</p>
                  </div>
                </button>
              </div>
              <p v-if="disasterTypeError" class="mt-2 text-sm text-red-600">
                {{ disasterTypeError }}
              </p>
            </div>

            <!-- Location -->
            <div class="relative flex items-center">
              <input
                v-if="!locationError"
                type="text"
                v-model="location"
                readonly
                class="w-full px-4 py-3 pl-12 pr-36 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                :placeholder="locationLoading ? 'Getting...' : 'Click button'"
              />
              <p
                v-else
                class="border w-full px-4 py-3 pl-12 pr-36 rounded-lg border-gray-300 bg-gray-50 cursor-not-allowed text-red-600 text-xs sm:text-base"
              >
                {{ locationError }}
              </p>

              <!-- Icon -->
              <div
                class="absolute left-4 inset-y-0 flex items-center pointer-events-none"
              >
                <svg
                  class="w-5 h-5 text-gray-400"
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
              </div>

              <!-- Button -->
              <button
                type="button"
                @click="getCurrentLocation"
                :disabled="locationLoading"
                class="absolute right-3 inset-y-0 flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
              >
                <ClientOnly>
                  {{ locationLoading ? "Getting..." : "Get Location" }}
                </ClientOnly>
              </button>
            </div>
          </div>
        </section>

        <!-- Section 2: Impact Assessment -->
        <section class="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div class="flex items-center mb-6">
            <div
              class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4"
            >
              <span class="text-red-600 font-bold">2</span>
            </div>
            <h2 class="text-xl font-bold text-gray-800">Impact Assessment</h2>
            <p class="text-sm text-gray-500 ml-4">
              (At least one impact category must be reported)
            </p>
          </div>

          <div class="space-y-8">
            <!-- Properties Impact Category -->
            <div
              class="bg-gray-50 rounded-xl p-6 border border-gray-200 overflow-hidden"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-800 text-lg flex items-center">
                  <svg
                    class="w-6 h-6 mr-2 text-gray-600"
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
                  Properties Impacted
                </h3>
                <label class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input
                      type="checkbox"
                      v-model="arePropertiesImpacted"
                      class="sr-only"
                    />
                    <div
                      class="w-10 h-6 rounded-full shadow-inner transition-colors"
                      :class="
                        arePropertiesImpacted ? 'bg-blue-600' : 'bg-gray-300'
                      "
                    ></div>
                    <div
                      class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform"
                      :class="arePropertiesImpacted ? 'translate-x-4' : ''"
                    ></div>
                  </div>
                  <span class="ml-3 font-medium">Properties Affected</span>
                </label>
              </div>

              <div v-if="arePropertiesImpacted" class="mt-6">
                <div class="mb-4 flex justify-between items-center">
                  <p class="text-sm text-gray-600">
                    Add all affected properties with their damage details
                  </p>
                  <button
                    type="button"
                    @click="addProperty"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Another Property
                  </button>
                </div>

                <div
                  v-for="(property, index) in properties"
                  :key="property.id"
                  class="mb-8 p-4 bg-white rounded-lg border border-gray-200 relative"
                >
                  <div class="flex justify-between items-start mb-4">
                    <h4 class="font-semibold text-gray-700">
                      Property #{{ index + 1 }}
                    </h4>
                    <button
                      v-if="properties.length > 1"
                      type="button"
                      @click="removeProperty(index)"
                      class="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="space-y-4">
                    <!-- Property Type -->
                    <div>
                      <label class="block text-gray-700 font-medium mb-2">
                        Property Type <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="property.propertyType"
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select property type</option>
                        <option value="Home">Home</option>
                        <option value="Shop">Shop</option>
                        <option value="Warehouse">Warehouse</option>
                        <option value="Farm/Field">Form/Field</option>
                        <option value="School/Mosque">School/Mosque</option>
                        <option value="Road/Bridge">Road/Bridge</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <!-- Damage Level -->
                    <div>
                      <label class="block text-gray-700 font-medium mb-4">
                        Property Damage Level
                        <span class="text-red-500">*</span>
                      </label>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          v-for="level in damageLevels"
                          :key="level.value"
                          type="button"
                          @click="property.damageLevel = level.value"
                          :class="[
                            'p-4 rounded-lg border-2 transition-all',
                            property.damageLevel === level.value
                              ? level.selectedClass
                              : 'border-gray-200 hover:border-blue-300',
                          ]"
                        >
                          <div class="text-center">
                            <div class="text-2xl mb-2">{{ level.emoji }}</div>
                            <p class="font-medium">{{ level.label }}</p>
                            <p class="text-sm text-gray-500 mt-1">
                              {{ level.description }}
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <!-- Property Images Upload -->
                    <div>
                      <label class="block text-gray-700 font-medium mb-4">
                        Upload Evidence of Property Damage
                        <span class="text-red-500">*</span>
                      </label>
                      <p class="text-sm text-gray-600 mb-4">
                        Please provide a clear photo showing the
                        {{ getDamageLevelLabel(property.damageLevel) }}. Maximum
                        1 photo allowed.
                      </p>

                      <div
                        v-if="!property.image"
                        class="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                        @click="triggerPropertyUpload(index)"
                      >
                        <input
                          type="file"
                          :ref="(el) => setPropertyInputRef(el, index)"
                          accept="image/*"
                          class="hidden"
                          @change="(e) => handlePropertyImages(e, index)"
                        />
                        <div>
                          <div
                            class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                          >
                            <svg
                              class="w-8 h-8 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                              />
                            </svg>
                          </div>
                          <p class="font-medium text-gray-700 mb-2">
                            Click to upload property damage evidence
                          </p>
                          <p class="text-sm text-gray-500">
                            Only 1 photo required
                          </p>
                        </div>
                      </div>

                      <div v-else class="mt-4">
                        <div class="flex items-start gap-4">
                          <div class="relative group">
                            <div
                              class="w-48 h-48 rounded-lg overflow-hidden bg-gray-100"
                            >
                              <img
                                :src="property.image.preview"
                                :alt="property.image.name"
                                class="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              @click="removePropertyImage(index)"
                              class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div class="flex-1">
                            <p
                              class="text-sm font-medium text-gray-700 mb-1 truncate"
                            >
                              {{ property.image.name }}
                            </p>
                            <p class="text-sm text-gray-500">
                              {{ formatFileSize(property.image.size) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Human Impact Category (with Total Residents inside) -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-800 text-lg flex items-center">
                  <svg
                    class="w-6 h-6 mr-2 text-purple-600"
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
                  Human Impact
                </h3>
                <label class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input
                      type="checkbox"
                      v-model="areHumansImpacted"
                      class="sr-only"
                    />
                    <div
                      class="w-10 h-6 rounded-full shadow-inner transition-colors"
                      :class="areHumansImpacted ? 'bg-blue-600' : 'bg-gray-300'"
                    ></div>
                    <div
                      class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform"
                      :class="areHumansImpacted ? 'translate-x-4' : ''"
                    ></div>
                  </div>
                  <span class="ml-3 font-medium">Humans Affected</span>
                </label>
              </div>

              <div v-if="areHumansImpacted" class="mt-6">
                <!-- Total Residents (moved here) -->
                <div
                  class="mb-6 bg-white rounded-lg p-4 border border-gray-200"
                >
                  <label class="block text-gray-700 font-medium mb-2">
                    Total Residents in Affected Area
                    <span class="text-red-500">*</span>
                  </label>
                  <p class="text-sm text-gray-500 mb-4">
                    Total number of people in the affected area
                  </p>
                  <div
                    class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white max-w-xs"
                  >
                    <button
                      type="button"
                      @click="decrementTotalResidents"
                      class="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50"
                      :disabled="totalResidentsCount <= 0"
                    >
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <input
                      type="number"
                      v-model="totalResidentsCount"
                      min="0"
                      class="w-full px-4 py-3 text-center border-0 focus:ring-0 bg-transparent text-lg font-medium"
                      @input="validateTotalResidents"
                    />
                    <button
                      type="button"
                      @click="incrementTotalResidents"
                      class="px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                    >
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <div
                    v-for="field in humanImpactFields"
                    :key="field.id"
                    class="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <label
                      class="block text-sm font-medium text-gray-700 mb-2"
                      >{{ field.label }}</label
                    >
                    <div
                      class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                    >
                      <button
                        type="button"
                        @click="decrementHumanImpact(field.model)"
                        class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        :disabled="field.value <= 0"
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
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <input
                        type="number"
                        v-model="field.value"
                        min="0"
                        :max="
                          field.model === 'deathsCount'
                            ? totalResidentsCount
                            : field.model === 'injuredCount'
                            ? totalResidentsCount - deathsCount
                            : undefined
                        "
                        class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                        @input="
                          (e) =>
                            validateHumanImpact(field.model, e.target.value)
                        "
                      />
                      <button
                        type="button"
                        @click="incrementHumanImpact(field.model)"
                        class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        :disabled="
                          (field.model === 'deathsCount' &&
                            field.value >= totalResidentsCount) ||
                          (field.model === 'injuredCount' &&
                            field.value >= totalResidentsCount - deathsCount)
                        "
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                    <p v-if="field.hint" class="text-xs text-gray-500 mt-1">
                      {{ field.hint }}
                    </p>
                  </div>
                </div>
                <div
                  class="mt-6 flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <svg
                    class="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <div>
                    <p class="text-sm text-blue-800 font-medium">
                      Why provide this information?
                    </p>
                    <p class="text-xs text-blue-700 mt-1">
                      Providing details about pregnant women, disabled persons,
                      and children helps relief teams prioritize specialized
                      medical kits, accessibility aids, and educational support
                      for this specific location.
                    </p>
                  </div>
                </div>

                <div class="bg-purple-50 rounded-lg p-4 mt-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-800">
                        Human Impact Summary
                      </p>
                      <p class="text-sm text-gray-600">
                        Deaths: {{ deathsCount }} | Injured: {{ injuredCount }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-purple-600">
                        {{ totalHumanImpact }}
                      </p>
                      <p class="text-sm text-gray-500">total affected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cattle Impact Category (unchanged) -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-gray-800 text-lg flex items-center">
                  <svg
                    class="w-6 h-6 mr-2 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Cattle Impact
                </h3>
                <label class="flex items-center cursor-pointer">
                  <div class="relative">
                    <input
                      type="checkbox"
                      v-model="areAnimalsImpacted"
                      class="sr-only"
                    />
                    <div
                      class="w-10 h-6 rounded-full shadow-inner transition-colors"
                      :class="
                        areAnimalsImpacted ? 'bg-blue-600' : 'bg-gray-300'
                      "
                    ></div>
                    <div
                      class="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform"
                      :class="areAnimalsImpacted ? 'translate-x-4' : ''"
                    ></div>
                  </div>
                  <span class="ml-3 font-medium">Cattle Affected</span>
                </label>
              </div>

              <div v-if="areAnimalsImpacted" class="mt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Small Animals -->
                  <div class="bg-white rounded-lg p-6 border border-gray-200">
                    <h4
                      class="font-bold text-gray-800 text-lg mb-4 flex items-center"
                    >
                      <svg
                        class="w-5 h-5 mr-2 text-green-500"
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
                      Small Cattle
                    </h4>
                    <p class="text-sm text-gray-500 mb-4">
                      Chickens, goats, sheep, rabbits, birds, etc.
                    </p>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-gray-700 font-medium mb-2"
                          >Deaths</label
                        >
                        <div
                          class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            @click="decrementAnimals('smallDeaths')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            :disabled="smallAnimalsDeathCount <= 0"
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
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            v-model="smallAnimalsDeathCount"
                            min="0"
                            class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                            @input="
                              validateCount(
                                'smallAnimalsDeathCount',
                                $event.target.value
                              )
                            "
                          />
                          <button
                            type="button"
                            @click="incrementAnimals('smallDeaths')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label class="block text-gray-700 font-medium mb-2"
                          >Injured</label
                        >
                        <div
                          class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            @click="decrementAnimals('smallInjured')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            :disabled="smallAnimalsInjuredCount <= 0"
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
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            v-model="smallAnimalsInjuredCount"
                            min="0"
                            class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                            @input="
                              validateCount(
                                'smallAnimalsInjuredCount',
                                $event.target.value
                              )
                            "
                          />
                          <button
                            type="button"
                            @click="incrementAnimals('smallInjured')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Big Animals -->
                  <div class="bg-white rounded-lg p-6 border border-gray-200">
                    <h4
                      class="font-bold text-gray-800 text-lg mb-4 flex items-center"
                    >
                      <svg
                        class="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Big Cattle
                    </h4>
                    <p class="text-sm text-gray-500 mb-4">
                      Cows, buffaloes, horses, camels, donkeys, etc.
                    </p>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-gray-700 font-medium mb-2"
                          >Deaths</label
                        >
                        <div
                          class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            @click="decrementAnimals('bigDeaths')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            :disabled="bigAnimalsDeathCount <= 0"
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
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            v-model="bigAnimalsDeathCount"
                            min="0"
                            class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                            @input="
                              validateCount(
                                'bigAnimalsDeathCount',
                                $event.target.value
                              )
                            "
                          />
                          <button
                            type="button"
                            @click="incrementAnimals('bigDeaths')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label class="block text-gray-700 font-medium mb-2"
                          >Injured</label
                        >
                        <div
                          class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white"
                        >
                          <button
                            type="button"
                            @click="decrementAnimals('bigInjured')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            :disabled="bigAnimalsInjuredCount <= 0"
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
                                d="M20 12H4"
                              />
                            </svg>
                          </button>
                          <input
                            type="number"
                            v-model="bigAnimalsInjuredCount"
                            min="0"
                            class="w-full px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                            @input="
                              validateCount(
                                'bigAnimalsInjuredCount',
                                $event.target.value
                              )
                            "
                          />
                          <button
                            type="button"
                            @click="incrementAnimals('bigInjured')"
                            class="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
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
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Animal Impact Summary -->
                <div
                  v-if="areAnimalsImpacted && totalAnimalImpact > 0"
                  class="mt-6 bg-green-50 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="font-medium text-gray-800">
                        Total Cattle Impact
                      </p>
                      <p class="text-sm text-gray-600">
                        Deaths: {{ totalAnimalDeaths }}, Injured:
                        {{ totalAnimalInjured }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-green-600">
                        {{ totalAnimalImpact }}
                      </p>
                      <p class="text-sm text-gray-500">Cattle affected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Submit Section -->
        <div
          class="bg-white rounded-2xl shadow-xl p-6 mt-8 border border-gray-200"
        >
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div class="flex-1">
              <div class="flex items-start">
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4"
                  >
                    <svg
                      class="w-6 h-6 text-blue-600"
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
                  </div>
                </div>
                <div>
                  <p class="font-medium text-gray-800">Review and Submit</p>
                  <p class="text-sm text-gray-500 mt-1">
                    Please ensure all information is accurate.
                    <span
                      v-if="missingRequiredFields.length > 0"
                      class="text-red-500 block mt-1"
                    >
                      Missing required fields:
                      {{ missingRequiredFields.join(", ") }}
                    </span>
                    <span
                      v-if="validationErrors.length > 0"
                      class="text-red-500 block mt-1"
                    >
                      Validation errors: {{ validationErrors.join(", ") }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                :disabled="
                  isSubmitting ||
                  missingRequiredFields.length > 0 ||
                  validationErrors.length > 0
                "
                :class="[
                  'px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 transition-all shadow-lg',
                  isSubmitting ||
                  missingRequiredFields.length > 0 ||
                  validationErrors.length > 0
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transform hover:-translate-y-0.5',
                ]"
              >
                <div class="flex items-center justify-center">
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ isSubmitting ? "Submitting..." : "Submit Report" }}
                </div>
              </button>
            </div>
          </div>
        </div>
      </form>

      <status-indicators
        :has-submitted="hasSubmitted"
        :is-online="isOnline === true"
        :pending-count="pendingCount"
        :is-syncing="isSyncing"
        :synced-count="syncedCount"
        :failed-count="failedCount"
        @sync="syncPendingReports"
        @retry-failed="retryFailedReports"
        ref="statusIndicators"
      />
      <!-- Show loading state while checking -->
      <div
        v-if="isOnline === null && isChecking"
        class="fixed top-4 right-4 z-50"
      >
        <div class="bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
          🔄 Checking connection...
        </div>
      </div>
    </div>

    <modal-vue :is-open="showSuccessModal" @close="resetForm">
      <template #icon>
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
        >
          <svg
            class="w-10 h-10 text-green-600"
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
        </div>
      </template>
      <template #title> {{ responseMsg }}! </template>
      <template #content>
        <p>
          Your disaster report has been received. Our team will review it and
          contact you if additional information is needed.
        </p>
      </template>
      <template #actions>
        <button
          @click="resetForm"
          class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Another Report
        </button>
      </template>
    </modal-vue>

    <modal-vue :is-open="showErrorModal" @close="showErrorModal = false">
      <template #icon>
        <div
          class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto"
        >
          <svg
            class="w-10 h-10 text-red-600"
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
      </template>
      <template #title> Submission Failed </template>
      <template #content>
        <p>
          {{
            errorMessage ||
            "There was an error submitting your report. Please try again."
          }}
        </p>
      </template>
      <template #actions>
        <button
          @click="showErrorModal = false"
          class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
        <button
          @click="handleRetry"
          class="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </template>
    </modal-vue>
  </div>
</template>

<script setup>
import modalVue from "~/components/reusableModal.vue";
import { useReportStore } from "~/stores/reportsStore";
import { reportDB } from "~/services/reportDatabase";
import { useOnlineStatus } from "~/composables/useOnlineStatus";
import { useReportSync } from "~/composables/useReportSync";

definePageMeta({
  middleware: "role-check",
  allowedRoles: ["user", "admin"],
});
useSeoMeta({
  title: "Add Report Page",
  description: "Add a detailed disaster report",
});

const store = useReportStore();
const { isOnline, isChecking } = useOnlineStatus();
const {
  isSyncing,
  pendingCount,
  hasSubmitted,
  syncPendingReports,
  failedCount = ref(0), // Add if you track failed reports
  retryFailedReports = () => {},
  loadPendingCount,
  checkSubmissionStatus,
} = useReportSync();

// Response message
const responseMsg = ref("");
// Section 1: Disaster Details
const disasterType = ref("");
const location = ref("");
const locationLoading = ref(false);
const locationError = ref("");
const disasterTypeError = ref("");

const disasterTypes = [
  { value: "Flood", label: "Flood", emoji: "🌊" },
  { value: "Earthquake", label: "Earthquake", emoji: "🌋" },
  { value: "Fire", label: "Fire", emoji: "🔥" },
  { value: "Land_slide", label: "Landslide", emoji: "🏔️" },
];

// Section 2: Impact Assessment
const arePropertiesImpacted = ref(false);
const areHumansImpacted = ref(false);
const areAnimalsImpacted = ref(false);

// Properties
const properties = ref([
  {
    id: Date.now(),
    propertyType: "",
    damageLevel: null,
    image: null,
  },
]);

// Human Impact (with total residents moved inside)
const totalResidentsCount = ref(0);
const deathsCount = ref(0);
const injuredCount = ref(0);
const pregnantWomenCount = ref(0);
const disabledPersonsCount = ref(0);
const schoolGoingChildrenCount = ref(0);
const marriedCouplesCount = ref(0);

// Animal counts (unchanged)
const bigAnimalsDeathCount = ref(0);
const bigAnimalsInjuredCount = ref(0);
const smallAnimalsDeathCount = ref(0);
const smallAnimalsInjuredCount = ref(0);

// Toast notification state
const showSyncToast = ref(false);
const syncToastMessage = ref("");
const syncToastIcon = ref("");
let toastTimeout = null;

// Track synced count (you can get this from your sync manager)
const syncedCount = ref(0);

// Show toast notification
const showToast = (message, type = "success") => {
  syncToastMessage.value = message;
  syncToastIcon.value =
    type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";
  showSyncToast.value = true;

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    showSyncToast.value = false;
  }, 3000);
};

// Clear local reports (debug only)
const clearLocalReports = async () => {
  if (
    confirm(
      "Are you sure you want to clear all pending reports? This cannot be undone."
    )
  ) {
    const { reportDB } = await import("~/services/reportDatabase");
    const pendingReports = await reportDB.getPendingReports();
    for (const report of pendingReports) {
      await reportDB.deleteReport(report.id);
    }
    await loadPendingCount();
    showToast("Cleared all pending reports", "info");
  }
};
// Watch for sync completion (you can emit this from useReportSync)
watch(isSyncing, (newVal, oldVal) => {
  if (oldVal === true && newVal === false && pendingCount.value === 0) {
    showToast("All reports synced successfully!", "success");
  }
});

// Watch for pending count changes
watch(pendingCount, (newCount, oldCount) => {
  if (oldCount > 0 && newCount === 0 && isOnline.value) {
    showToast("All caught up! No pending reports.", "success");
  }
});

// Refs for file inputs
const propertyInputRefs = ref([]);

const damageLevels = [
  {
    value: "minor",
    label: "Only Water & Silt",
    emoji: "🟡",
    description: "Repairable damage",
    selectedClass: "border-yellow-500 bg-yellow-50",
  },
  {
    value: "major",
    label: "Partial Damage",
    emoji: "🟠",
    description: "1 room or boundary wall or both",
    selectedClass: "border-orange-500 bg-orange-50",
  },
  {
    value: "fully_destroyed",
    label: "Complete Damage",
    emoji: "🔴",
    description: "2 rooms or above",
    selectedClass: "border-red-500 bg-red-50",
  },
];

// Human Impact Fields
const humanImpactFields = computed(() => [
  {
    id: "deaths",
    label: "Deaths",
    model: "deathsCount",
    value: deathsCount.value,
    hint: `Cannot exceed total residents (${totalResidentsCount.value})`,
  },
  {
    id: "injured",
    label: "Injured",
    model: "injuredCount",
    value: injuredCount.value,
    hint: `Cannot exceed residents minus deaths (${
      totalResidentsCount.value - deathsCount.value
    })`,
  },
  {
    id: "pregnantWomen",
    label: "Pregnant Women",
    model: "pregnantWomenCount",
    value: pregnantWomenCount.value,
    hint: "For specialized medical care",
  },
  {
    id: "disabledPersons",
    label: "Disabled Persons",
    model: "disabledPersonsCount",
    value: disabledPersonsCount.value,
    hint: "For accessibility support",
  },
  {
    id: "schoolChildren",
    label: "School Going Children",
    model: "schoolGoingChildrenCount",
    value: schoolGoingChildrenCount.value,
    hint: "For educational relief",
  },
  {
    id: "marriedCouples",
    label: "Married Couples",
    model: "marriedCouplesCount",
    value: marriedCouplesCount.value,
    hint: `Max ${Math.floor(
      totalResidentsCount.value / 2
    )} couples, For family-based housing`,
  },
]);

// Submission State
const isSubmitting = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref("");

// Computed Properties
const missingRequiredFields = computed(() => {
  const missing = [];

  if (!disasterType.value) missing.push("Disaster Type");
  if (!location.value) missing.push("Location");

  // Properties validation
  if (arePropertiesImpacted.value) {
    properties.value.forEach((property, index) => {
      if (!property.propertyType) {
        missing.push(`Property #${index + 1} Type`);
      }
      if (!property.damageLevel) {
        missing.push(`Property #${index + 1} Damage Level`);
      }
      if (!property.image) {
        missing.push(`Property #${index + 1} Evidence Photo`);
      }
    });
  }

  // Human Impact validation - only require total residents if human impact is toggled ON
  if (areHumansImpacted.value) {
    if (deathsCount.value <= 0 && injuredCount.value <= 0) {
      missing.push(
        "At least once catagory must be reported(deaths, injured) with total residents"
      );
    }
  }

  return missing;
});

const validationErrors = computed(() => {
  const errors = [];

  // Human Impact validation (only if toggled on)
  if (areHumansImpacted.value) {
    if (totalResidentsCount.value > 0) {
      if (deathsCount.value > totalResidentsCount.value) {
        errors.push("Deaths cannot exceed total residents");
      }

      if (injuredCount.value > totalResidentsCount.value - deathsCount.value) {
        errors.push("Injuries cannot exceed residents minus deaths");
      }

      if (pregnantWomenCount.value > totalResidentsCount.value) {
        errors.push("Pregnant women count cannot exceed total residents");
      }

      if (disabledPersonsCount.value > totalResidentsCount.value) {
        errors.push("Disabled persons count cannot exceed total residents");
      }

      if (schoolGoingChildrenCount.value > totalResidentsCount.value) {
        errors.push("School children count cannot exceed total residents");
      }

      if (marriedCouplesCount.value * 2 > totalResidentsCount.value) {
        errors.push("Too many married couples for total residents");
      }
    }
  } else {
    // If human impact toggle is off, ensure all counts are 0
    if (
      totalResidentsCount.value > 0 ||
      deathsCount.value > 0 ||
      injuredCount.value > 0 ||
      pregnantWomenCount.value > 0 ||
      disabledPersonsCount.value > 0 ||
      schoolGoingChildrenCount.value > 0 ||
      marriedCouplesCount.value > 0
    ) {
      errors.push("Human impact counts must be 0 when humans not impacted");
    }
  }

  // Animal validation (unchanged)
  if (areAnimalsImpacted.value) {
    const totalAnimals =
      bigAnimalsDeathCount.value +
      bigAnimalsInjuredCount.value +
      smallAnimalsDeathCount.value +
      smallAnimalsInjuredCount.value;
    if (totalAnimals <= 0) {
      errors.push("If cattle impacted, total animal count must be > 0");
    }
  } else {
    if (
      bigAnimalsDeathCount.value > 0 ||
      bigAnimalsInjuredCount.value > 0 ||
      smallAnimalsDeathCount.value > 0 ||
      smallAnimalsInjuredCount.value > 0
    ) {
      errors.push("Animal counts must be 0 when cattle not impacted");
    }
  }

  // Check at least one impact category
  const hasImpact =
    arePropertiesImpacted.value ||
    areHumansImpacted.value ||
    areAnimalsImpacted.value;
  if (!hasImpact) {
    errors.push("At least one impact category must be reported");
  }

  return errors;
});

const totalAnimalDeaths = computed(
  () => bigAnimalsDeathCount.value + smallAnimalsDeathCount.value
);
const totalAnimalInjured = computed(
  () => bigAnimalsInjuredCount.value + smallAnimalsInjuredCount.value
);
const totalAnimalImpact = computed(
  () => totalAnimalDeaths.value + totalAnimalInjured.value
);
const totalHumanImpact = computed(() => deathsCount.value + injuredCount.value);

// Helper methods

// Helper to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getDamageLevelLabel = (level) => {
  const damageLevel = damageLevels.find((dl) => dl.value === level);
  return damageLevel ? damageLevel.label.toLowerCase() : "damage";
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const calculateProgress = () => {
  let completed = 0;
  let totalFields = 0;

  // 1. MANDATORY CORE FIELDS (Required for 100%)
  totalFields += 2;
  if (disasterType.value) completed++;
  if (location.value) completed++;

  // 2. PROPERTIES (Dynamic)
  totalFields += 1; // The toggle itself
  completed++;
  if (arePropertiesImpacted.value) {
    properties.value.forEach((prop) => {
      totalFields += 3;
      if (prop.propertyType) completed++;
      if (prop.damageLevel) completed++;
      if (prop.image) completed++;
    });
  }

  // 3. HUMAN IMPACT (Dynamic)
  totalFields += 1; // The toggle itself
  completed++;
  if (areHumansImpacted.value) {
    const humanFields = [
      totalResidentsCount,
      deathsCount,
      injuredCount,
      pregnantWomenCount,
      disabledPersonsCount,
      schoolGoingChildrenCount,
      marriedCouplesCount,
    ];
    totalFields += humanFields.length;
    humanFields.forEach((field) => {
      if (field.value > 0) completed++;
    });
  }

  // 4. ANIMALS
  totalFields += 1; // The toggle itself
  completed++;
  if (areAnimalsImpacted.value) {
    totalFields += 1;
    if (totalAnimalImpact.value > 0) completed++;
  }

  // Calculate final percentage
  const rawPercentage = Math.round((completed / totalFields) * 100);

  // STRICT RULE: Must have Core Category and Location to reach 100%
  const hasCoreData = disasterType.value && location.value;
  if (!hasCoreData && rawPercentage >= 100) {
    return 99; // Cap at 99 if core fields are missing
  }

  return Math.min(rawPercentage, 100);
};

// Location Methods
const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    locationError.value = "Geolocation is not supported by your browser.";
    return;
  }

  locationLoading.value = true;
  locationError.value = "";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      location.value = `${position.coords.latitude.toFixed(
        6
      )}, ${position.coords.longitude.toFixed(6)}`;
      locationLoading.value = false;
    },
    (error) => {
      console.error("Error getting location:", error);
      locationError.value =
        error.message ||
        "Unable to get current location. Please enable location services.";
      locationLoading.value = false;
    },
    {
      enableHighAccuracy: true,
      timeout: 35000,
      maximumAge: 0,
    }
  );
};

// Total Residents Methods
const incrementTotalResidents = () => {
  totalResidentsCount.value += 1;
};

const decrementTotalResidents = () => {
  if (totalResidentsCount.value > 0) {
    totalResidentsCount.value -= 1;
  }
};

const validateTotalResidents = () => {
  if (totalResidentsCount.value < 0) {
    totalResidentsCount.value = 0;
  }
};

// Property Methods
const addProperty = () => {
  properties.value.push({
    id: Date.now(),
    propertyType: "",
    damageLevel: null,
    image: null,
  });
};

const removeProperty = (index) => {
  properties.value.splice(index, 1);
};

const setPropertyInputRef = (el, index) => {
  if (el) {
    propertyInputRefs.value[index] = el;
  }
};

const triggerPropertyUpload = (index) => {
  propertyInputRefs.value[index]?.click();
};

const handlePropertyImages = (event, index) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

  const file = files[0];
  if (file.size > 10 * 1024 * 1024) {
    alert(`File ${file.name} exceeds 10MB limit`);
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert(`File ${file.name} is not an image`);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    properties.value[index].image = {
      file: file,
      name: file.name,
      size: file.size,
      preview: e.target.result,
    };
  };
  reader.readAsDataURL(file);
};

const removePropertyImage = (index) => {
  properties.value[index].image = null;
  if (propertyInputRefs.value[index]) {
    propertyInputRefs.value[index].value = "";
  }
};

// Human Impact Methods
const incrementHumanImpact = (field) => {
  const fieldRef = getHumanFieldRef(field);
  if (field === "deathsCount" && fieldRef.value >= totalResidentsCount.value)
    return;
  if (
    field === "injuredCount" &&
    fieldRef.value >= totalResidentsCount.value - deathsCount.value
  )
    return;
  if (
    field === "marriedCouplesCount" &&
    fieldRef.value >= Math.floor(totalResidentsCount.value / 2)
  )
    return;
  fieldRef.value += 1;
};

const decrementHumanImpact = (field) => {
  const fieldRef = getHumanFieldRef(field);
  if (fieldRef.value > 0) fieldRef.value -= 1;
};

const validateHumanImpact = (field, value) => {
  const fieldRef = getHumanFieldRef(field);
  const num = parseInt(value);
  if (isNaN(num) || num < 0) {
    fieldRef.value = 0;
    return;
  }
  if (field === "deathsCount" && num > totalResidentsCount.value) {
    fieldRef.value = totalResidentsCount.value;
    return;
  }
  if (
    field === "injuredCount" &&
    num > totalResidentsCount.value - deathsCount.value
  ) {
    fieldRef.value = totalResidentsCount.value - deathsCount.value;
    return;
  }
  if (
    field === "marriedCouplesCount" &&
    num > Math.floor(totalResidentsCount.value / 2)
  ) {
    fieldRef.value = Math.floor(totalResidentsCount.value / 2);
    return;
  }
  fieldRef.value = num;
};

const getHumanFieldRef = (field) => {
  switch (field) {
    case "deathsCount":
      return deathsCount;
    case "injuredCount":
      return injuredCount;
    case "pregnantWomenCount":
      return pregnantWomenCount;
    case "disabledPersonsCount":
      return disabledPersonsCount;
    case "schoolGoingChildrenCount":
      return schoolGoingChildrenCount;
    case "marriedCouplesCount":
      return marriedCouplesCount;
    default:
      return deathsCount;
  }
};

// Animal Methods (unchanged)
const incrementAnimals = (type) => {
  switch (type) {
    case "smallDeaths":
      smallAnimalsDeathCount.value += 1;
      break;
    case "smallInjured":
      smallAnimalsInjuredCount.value += 1;
      break;
    case "bigDeaths":
      bigAnimalsDeathCount.value += 1;
      break;
    case "bigInjured":
      bigAnimalsInjuredCount.value += 1;
      break;
  }
};

const decrementAnimals = (type) => {
  switch (type) {
    case "smallDeaths":
      if (smallAnimalsDeathCount.value > 0) smallAnimalsDeathCount.value -= 1;
      break;
    case "smallInjured":
      if (smallAnimalsInjuredCount.value > 0)
        smallAnimalsInjuredCount.value -= 1;
      break;
    case "bigDeaths":
      if (bigAnimalsDeathCount.value > 0) bigAnimalsDeathCount.value -= 1;
      break;
    case "bigInjured":
      if (bigAnimalsInjuredCount.value > 0) bigAnimalsInjuredCount.value -= 1;
      break;
  }
};

const validateCount = (field, value) => {
  const fieldRef = getFieldRef(field);
  const num = parseInt(value);
  if (isNaN(num) || num < 0) {
    fieldRef.value = 0;
    return;
  }
  fieldRef.value = num;
};

const getFieldRef = (field) => {
  switch (field) {
    case "smallAnimalsDeathCount":
      return smallAnimalsDeathCount;
    case "smallAnimalsInjuredCount":
      return smallAnimalsInjuredCount;
    case "bigAnimalsDeathCount":
      return bigAnimalsDeathCount;
    case "bigAnimalsInjuredCount":
      return bigAnimalsInjuredCount;
    default:
      return smallAnimalsDeathCount;
  }
};

// Reset functions
const resetHumanCounts = () => {
  if (!areHumansImpacted.value) {
    totalResidentsCount.value = 0;
    deathsCount.value = 0;
    injuredCount.value = 0;
    pregnantWomenCount.value = 0;
    disabledPersonsCount.value = 0;
    schoolGoingChildrenCount.value = 0;
    marriedCouplesCount.value = 0;
  }
};

const resetAnimalCounts = () => {
  if (!areAnimalsImpacted.value) {
    bigAnimalsDeathCount.value = 0;
    bigAnimalsInjuredCount.value = 0;
    smallAnimalsDeathCount.value = 0;
    smallAnimalsInjuredCount.value = 0;
  }
};

// handle try again
const handleRetry = () => {
  const route = useRoute();
  showErrorModal.value = false;
  if (
    errorMessage.value ===
    "Token not Found please log in. Please perform a hard refresh for a fresh start."
  )
    return navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`, {
      replace: true,
    });
};

// Watch for changes
watch(areHumansImpacted, (newVal) => {
  if (!newVal) resetHumanCounts();
});

watch(areAnimalsImpacted, (newVal) => {
  if (!newVal) resetAnimalCounts();
});

// Form Submission

const submitForm = async () => {
  // NEW: Check if already submitted
  if (hasSubmitted.value) {
    showErrorModal.value = true;
    errorMessage.value =
      "You have already submitted a disaster report. Only one report per user is allowed.";
    return;
  }

  // NEW: Check if pending report exists
  if (pendingCount.value > 0) {
    showErrorModal.value = true;
    errorMessage.value =
      "You already have a pending report. Please wait for it to sync or try again later.";
    return;
  }

  if (missingRequiredFields.value.length > 0) {
    showErrorModal.value = true;
    errorMessage.value = `Please fill in all required fields:\n${missingRequiredFields.value.join(
      "\n"
    )}`;
    return;
  }

  if (validationErrors.value.length > 0) {
    showErrorModal.value = true;
    errorMessage.value = `Please fix the following errors:\n${validationErrors.value.join(
      "\n"
    )}`;
    return;
  }

  isSubmitting.value = true;

  try {
    // Prepare report data
    const reportData = {
      disaster_type: disasterType.value,
      location: location.value,
      are_properties_impacted: arePropertiesImpacted.value,
      properties: arePropertiesImpacted.value
        ? properties.value.map((property) => ({
            property_type: property.propertyType,
            damage_level: property.damageLevel,
          }))
        : [],
      are_humans_impacted: areHumansImpacted.value,
      total_residents_count: areHumansImpacted.value
        ? totalResidentsCount.value
        : 0,
      deaths_count: deathsCount.value,
      injured_count: injuredCount.value,
      pregnant_women_count: pregnantWomenCount.value,
      disabled_persons_count: disabledPersonsCount.value,
      school_going_children_count: schoolGoingChildrenCount.value,
      married_couples_count: marriedCouplesCount.value,
      are_animals_impacted: areAnimalsImpacted.value,
      big_animals_death_count: bigAnimalsDeathCount.value,
      big_animals_injured_count: bigAnimalsInjuredCount.value,
      small_animals_death_count: smallAnimalsDeathCount.value,
      small_animals_injured_count: smallAnimalsInjuredCount.value,
      submitted_at: new Date().toISOString(),
    };

    // Collect images as base64
    const images = [];
    if (arePropertiesImpacted.value) {
      for (const property of properties.value) {
        if (property.image && property.image.file) {
          const base64 = await fileToBase64(property.image.file);
          images.push({
            name: property.image.name,
            size: property.image.size,
            type: property.image.type,
            base64: base64,
          });
        }
      }
    }

    // Check if offline
    if (!isOnline.value) {
      // Save to Dexie when offline (will throw error if duplicate)
      await reportDB.savePendingReport(reportData, images);
      await loadPendingCount();
      await checkSubmissionStatus();

      responseMsg.value = `📱 Report saved locally! Will submit when online.`;
      showSuccessModal.value = true;
      resetForm();
    } else {
      // Submit normally when online
      const formData = new FormData();
      formData.append("data", JSON.stringify(reportData));

      if (arePropertiesImpacted.value) {
        properties.value.forEach((property) => {
          if (property.image && property.image.file) {
            formData.append("property_images", property.image.file);
          }
        });
      }
      const response = await store.addReport(formData);

      // Mark as submitted locally
      const userId = await reportDB.getUserId();
      await reportDB.markUserAsSubmitted(userId, response.reportId);
      await checkSubmissionStatus();

      console.log("Report created successfully:", response);
      responseMsg.value = response.msg;
      showSuccessModal.value = true;
      showErrorModal.value = false;
    }

    showErrorModal.value = false;
  } catch (error) {
    console.warn(error.response._data.message);
    if (error.response._data.statusCode === 401) {
      showSuccessModal.value = false;
      showErrorModal.value = true;
      errorMessage.value =
        error.response._data.message +
        ". Please perform a hard refresh for a fresh start.";
      return;
    }
    // Handle duplicate submission errors
    if (error.message === "ONLY_ONE_REPORT_ALLOWED") {
      alert(
        "You have already submitted a disaster report. Only one report is allowed."
      );
      await checkSubmissionStatus();
    } else if (error.message === "PENDING_REPORT_EXISTS") {
      alert("You already have a pending report. Please wait for it to sync.");
    } else if (isOnline.value) {
      // If online submission fails, save offline as backup
      try {
        await reportDB.savePendingReport(reportData, images);
        await loadPendingCount();
        responseMsg.value =
          "⚠️ Server error. Report saved locally and will be submitted later.";
        showSuccessModal.value = true;
        showErrorModal.value = false;
        resetForm();
      } catch (offlineError) {
        if (offlineError.message === "ONLY_ONE_REPORT_ALLOWED") {
          alert("You have already submitted a report.");
        } else {
          showSuccessModal.value = false;
          showErrorModal.value = true;
          errorMessage.value = error.response?.data?.message || error.message;
        }
      }
    } else {
      showSuccessModal.value = false;
      showErrorModal.value = true;
      errorMessage.value = "📴 You're offline. Report has been saved locally.";
    }
  } finally {
    isSubmitting.value = false;
  }
};
const resetForm = () => {
  /*
  disasterType.value = ''
  location.value = ''
  disasterTypeError.value = ''
  locationError.value = ''

  arePropertiesImpacted.value = false
  areHumansImpacted.value = false
  areAnimalsImpacted.value = false

  properties.value = [
    {
      id: Date.now(),
      propertyType: '',
      damageLevel: null,
      image: null,
    },
  ]

  totalResidentsCount.value = 0
  deathsCount.value = 0
  injuredCount.value = 0
  pregnantWomenCount.value = 0
  disabledPersonsCount.value = 0
  schoolGoingChildrenCount.value = 0
  marriedCouplesCount.value = 0

  bigAnimalsDeathCount.value = 0
  bigAnimalsInjuredCount.value = 0
  smallAnimalsDeathCount.value = 0
  smallAnimalsInjuredCount.value = 0

  propertyInputRefs.value = []

  */
  isSubmitting.value = false;
  showSuccessModal.value = false;
};

onMounted(() => {
  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        getCurrentLocation();
      }
    });
  }
});
// Clean up toast timeout
onUnmounted(() => {
  if (toastTimeout) clearTimeout(toastTimeout);
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Number input hide arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Focus styles */
:focus {
  outline: none;
}

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

.form-section {
  animation: fadeIn 0.5s ease-out;
}
</style>