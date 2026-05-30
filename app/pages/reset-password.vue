<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo/Brand with Animation -->
      <div class="text-center animate-fade-in-down">
        <div
          class="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200"
        >
          <svg
            class="h-10 w-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Please enter your new password below
        </p>
      </div>

      <!-- Main Card -->
      <div
        class="mt-8 bg-white py-8 px-4 shadow-xl border border-gray-200 rounded-2xl sm:px-10 transform transition-all duration-300 hover:shadow-2xl"
      >
        <!-- Reset Password Form -->
        <div>
          <!-- Email Display (Read-only) -->
          <div
            class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 overflow-auto"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-blue-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 12H8m8 4h-4m-4 4h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p class="text-xs text-blue-600 font-medium">
                  Resetting password for
                </p>
                <p class="text-sm text-blue-800 font-semibold">
                  {{ userEmail }}
                </p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleResetPassword" class="space-y-6">
            <!-- New Password Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                New Password <span class="text-red-500">*</span>
              </label>

              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>

                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="formData.password"
                  @input="validatePassword"
                  @blur="validatePassword"
                  @paste="handleSecurityEvent($event, 'password')"
                  @drop="handleSecurityEvent($event, 'password')"
                  placeholder="Enter new password"
                  class="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  :class="passwordInputClasses"
                  :disabled="isSubmitting || isSuccess"
                />

                <!-- Toggle Password Visibility -->
                <button
                  type="button"
                  @click="togglePasswordVisibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  tabindex="-1"
                >
                  <svg
                    v-if="showPassword"
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
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
                  <svg
                    v-else
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>

              <!-- Password Strength Meter -->
              <div v-if="formData.password" class="mt-2">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-medium text-gray-500"
                    >Password strength:</span
                  >
                  <span
                    class="text-xs font-medium"
                    :class="strengthColorClass"
                    >{{ strengthLabel }}</span
                  >
                </div>
                <div
                  class="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full transition-all duration-300 rounded-full"
                    :class="strengthBarClass"
                    :style="{ width: `${passwordStrength}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Confirm Password Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span class="text-red-500">*</span>
              </label>

              <div class="relative">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>

                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  v-model="formData.confirmPassword"
                  @input="validateConfirmPassword"
                  @blur="validateConfirmPassword"
                  @paste="handleSecurityEvent($event, 'confirmPassword')"
                  @drop="handleSecurityEvent($event, 'confirmPassword')"
                  placeholder="Confirm your password"
                  class="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  :class="confirmPasswordInputClasses"
                  :disabled="isSubmitting || isSuccess"
                />

                <!-- Toggle Confirm Password Visibility -->
                <button
                  type="button"
                  @click="toggleConfirmPasswordVisibility"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  tabindex="-1"
                >
                  <svg
                    v-if="showConfirmPassword"
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
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
                  <svg
                    v-else
                    class="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Error Messages -->
            <div
              v-if="errors.password || errors.confirmPassword"
              class="space-y-2"
            >
              <p
                v-if="errors.password"
                class="text-sm text-red-600 flex items-center"
              >
                <svg
                  class="h-4 w-4 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.password }}
              </p>
              <p
                v-if="errors.confirmPassword"
                class="text-sm text-red-600 flex items-center"
              >
                <svg
                  class="h-4 w-4 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ errors.confirmPassword }}
              </p>
            </div>

            <!-- Password Requirements -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <!-- Add this security notice at the top -->
              <div class="mb-3 pb-2 border-b border-gray-200">
                <div class="flex items-center text-amber-600">
                  <svg
                    class="h-4 w-4 mr-2.5 text-amber-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-xs font-bold text-amber-700"
                    >⛔ COPY & PASTE DISABLED</span
                  >
                </div>
              </div>

              <p class="text-xs font-medium text-gray-700 mb-2">
                Password must contain:
              </p>
              <ul class="space-y-1.5">
                <li
                  class="flex items-center text-xs"
                  :class="requirements.minLength.class"
                >
                  <svg
                    class="h-4 w-4 mr-2"
                    :class="requirements.minLength.iconClass"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      v-if="requirements.minLength.met"
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                    <path
                      v-else
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  At least 8 characters
                </li>
                <li
                  class="flex items-center text-xs"
                  :class="requirements.hasUppercase.class"
                >
                  <svg
                    class="h-4 w-4 mr-2"
                    :class="requirements.hasUppercase.iconClass"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      v-if="requirements.hasUppercase.met"
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                    <path
                      v-else
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  At least 1 uppercase letter
                </li>
                <li
                  class="flex items-center text-xs"
                  :class="requirements.hasLowercase.class"
                >
                  <svg
                    class="h-4 w-4 mr-2"
                    :class="requirements.hasLowercase.iconClass"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      v-if="requirements.hasLowercase.met"
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                    <path
                      v-else
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  At least 1 lowercase letter
                </li>
                <li
                  class="flex items-center text-xs"
                  :class="requirements.hasNumber.class"
                >
                  <svg
                    class="h-4 w-4 mr-2"
                    :class="requirements.hasNumber.iconClass"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      v-if="requirements.hasNumber.met"
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                    <path
                      v-else
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  At least 1 number
                </li>
                <li
                  class="flex items-center text-xs"
                  :class="requirements.hasSpecial.class"
                >
                  <svg
                    class="h-4 w-4 mr-2"
                    :class="requirements.hasSpecial.iconClass"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      v-if="requirements.hasSpecial.met"
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                    <path
                      v-else
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  At least 1 special character (!@#$%^&*)
                </li>
              </ul>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="!isFormValid || isSubmitting || isSuccess"
              class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                v-if="!isSubmitting && !isSuccess"
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <svg
                v-else-if="isSubmitting"
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
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <svg
                v-else-if="isSuccess"
                class="w-5 h-5 mr-2 text-green-200"
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
              {{ buttonText }}
            </button>
          </form>

          <!-- Success Message -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div v-if="isSuccess" class="mt-6">
              <div class="rounded-lg bg-green-50 border border-green-200 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">
                      Password reset successful!
                    </h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p>
                        Your password has been successfully reset. You can now
                        login with your new password.
                      </p>
                    </div>
                    <div class="mt-4">
                      <router-link
                        to="/login"
                        class="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        Go to Login
                        <svg
                          class="ml-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Error Banner -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div v-if="errorMessage && !isSuccess" class="mt-6">
              <div class="rounded-lg bg-red-50 border border-red-200 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      class="h-5 w-5 text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <div class="ml-3 flex-1">
                    <p class="text-sm font-medium text-red-800">
                      {{ errorMessage }}
                    </p>
                  </div>
                  <div class="ml-auto pl-3">
                    <button @click="clearError" class="inline-flex">
                      <svg
                        class="h-5 w-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Security Notice -->
      <p class="mt-6 text-center text-xs text-gray-500">
        <span class="flex items-center justify-center">
          <svg
            class="h-4 w-4 mr-1 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          This is a secure area. Your password will be encrypted.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

useSeoMeta({
  title: "Reset Password Page",
  description:
    "Provide your new Password and confirm it to reset your old password",
});
const router = useRouter();
// store
const store = useAuthStore();

// Router
const route = useRoute();

// Route params
const token = ref(route.params.token || route.query.token || "");

// State
const userEmail = ref(route.query.email);
const isSubmitting = ref(false);
const isSuccess = ref(false);
const errorMessage = ref("");
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Form Data
const formData = ref({
  password: "",
  confirmPassword: "",
});

// Errors
const errors = ref({
  password: "",
  confirmPassword: "",
});

// Password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Password strength calculation
const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  return strength;
};

const passwordStrength = computed(() => {
  if (!formData.value.password) return 0;
  return calculatePasswordStrength(formData.value.password);
});

const strengthLabel = computed(() => {
  const strength = passwordStrength.value;
  if (strength === 0) return "Enter password";
  if (strength < 40) return "Weak";
  if (strength < 60) return "Fair";
  if (strength < 80) return "Good";
  return "Strong";
});

const strengthColorClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return "text-red-600";
  if (strength < 60) return "text-orange-600";
  if (strength < 80) return "text-yellow-600";
  return "text-green-600";
});

const strengthBarClass = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return "bg-red-500";
  if (strength < 60) return "bg-orange-500";
  if (strength < 80) return "bg-yellow-500";
  return "bg-green-500";
});

// Password requirements
const requirements = computed(() => {
  const password = formData.value.password || "";
  return {
    minLength: {
      met: password.length >= 8,
      class: password.length >= 8 ? "text-green-600" : "text-gray-500",
      iconClass: password.length >= 8 ? "text-green-500" : "text-gray-400",
    },
    hasUppercase: {
      met: /[A-Z]/.test(password),
      class: /[A-Z]/.test(password) ? "text-green-600" : "text-gray-500",
      iconClass: /[A-Z]/.test(password) ? "text-green-500" : "text-gray-400",
    },
    hasLowercase: {
      met: /[a-z]/.test(password),
      class: /[a-z]/.test(password) ? "text-green-600" : "text-gray-500",
      iconClass: /[a-z]/.test(password) ? "text-green-500" : "text-gray-400",
    },
    hasNumber: {
      met: /[0-9]/.test(password),
      class: /[0-9]/.test(password) ? "text-green-600" : "text-gray-500",
      iconClass: /[0-9]/.test(password) ? "text-green-500" : "text-gray-400",
    },
    hasSpecial: {
      met: /[^A-Za-z0-9]/.test(password),
      class: /[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-gray-500",
      iconClass: /[^A-Za-z0-9]/.test(password)
        ? "text-green-500"
        : "text-gray-400",
    },
  };
});

// Input classes
const passwordInputClasses = computed(() => {
  if (errors.value.password) {
    return "border-red-300 bg-red-50";
  }
  if (formData.value.password && !errors.value.password) {
    return "border-green-300 bg-green-50";
  }
  return "border-gray-300";
});

const confirmPasswordInputClasses = computed(() => {
  if (errors.value.confirmPassword) {
    return "border-red-300 bg-red-50";
  }
  if (
    formData.value.confirmPassword &&
    formData.value.password === formData.value.confirmPassword
  ) {
    return "border-green-300 bg-green-50";
  }
  return "border-gray-300";
});

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.password &&
    formData.value.confirmPassword &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    formData.value.password === formData.value.confirmPassword &&
    passwordStrength.value >= 60 // At least "Good" strength
  );
});

const buttonText = computed(() => {
  if (isSubmitting.value) return "Resetting Password...";
  if (isSuccess.value) return "Password Reset Successful!";
  return "Reset Password";
});

// Validation methods
const validatePassword = () => {
  const password = formData.value.password;

  if (!password) {
    errors.value.password = "Password is required";
  } else if (password.length < 8) {
    errors.value.password = "Password must be at least 8 characters";
  } else if (!/[A-Z]/.test(password)) {
    errors.value.password = "Password must contain at least 1 uppercase letter";
  } else if (!/[a-z]/.test(password)) {
    errors.value.password = "Password must contain at least 1 lowercase letter";
  } else if (!/[0-9]/.test(password)) {
    errors.value.password = "Password must contain at least 1 number";
  } else if (!/[^A-Za-z0-9]/.test(password)) {
    errors.value.password =
      "Password must contain at least 1 special character";
  } else {
    errors.value.password = "";
  }

  // Also validate confirm password if it has value
  if (formData.value.confirmPassword) {
    validateConfirmPassword();
  }
};

const validateConfirmPassword = () => {
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = "Please confirm your password";
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = "Passwords do not match";
  } else {
    errors.value.confirmPassword = "";
  }
};
// handle password pase
const blockInteraction = (field) => {
  formData.value[field] = "";
  validatePassword();
};

const handleSecurityEvent = (e, field) => {
  e.preventDefault(); // Stops the text from actually appearing
  blockInteraction(field);
};

// Handle form submission
const handleResetPassword = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  errorMessage.value = "";

  try {
    // // Success
    const payload = {
      token: token.value,
      email: userEmail.value,
      reset_password: formData.value.password,
    };
    await store.reset_password(payload);

    isSuccess.value = true;
    formData.value.password = "";
    formData.value.confirmPassword = "";
    setTimeout(() => {
      router.replace("/login");
    }, 3000);
  } catch (error) {
    console.log("error occured during password reset operation");
    errorMessage.value =
      error.response._data.message ||
      "Failed to reset password. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

// Clear error
const clearError = () => {
  errorMessage.value = "";
};
</script>

<style scoped>
/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active {
  animation: slideDown 0.3s ease;
}

/* Focus styles for better accessibility */
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Improve touch targets on mobile */
@media (max-width: 640px) {
  button,
  [type="button"],
  [type="submit"] {
    min-height: 44px;
  }

  input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Password strength meter animation */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>ssss