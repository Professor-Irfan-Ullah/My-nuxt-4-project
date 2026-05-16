<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <!-- Toast/Snackbar Error -->
    <div
      v-if="showErrorToast"
      class="fixed top-4 right-4 left-4 z-50 animate-slideDown"
    >
      <div class="bg-red-50 border border-red-200 rounded-xl shadow-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              class="h-6 w-6 text-red-600"
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
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-semibold text-red-800">
              Please fix the following errors:
            </h3>
            <div class="mt-2">
              <ul class="text-sm text-red-700 space-y-1">
                <li
                  v-for="error in errorSummary"
                  :key="error.field"
                  class="flex items-start"
                >
                  <svg
                    class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="2" />
                  </svg>
                  <span>
                    <span class="font-medium capitalize"
                      >{{ error.field }}:</span
                    >
                    {{ error.message }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <button
            @click="showErrorToast = false"
            class="ml-3 flex-shrink-0 text-red-500 hover:text-red-700"
          >
            <svg
              class="h-5 w-5"
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
        <!-- Auto-close timer bar -->
        <div
          v-if="toastTimer > 0"
          class="mt-3 h-1 bg-red-200 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-red-500 transition-all duration-300"
            :style="{ width: `${(toastTimer / 5000) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Card Container -->
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
      <!-- Header Section with Blue Gradient -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div class="flex items-center justify-center mb-3">
          <div class="bg-white/20 p-3 rounded-full">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-center">Create Account</h1>
        <p class="text-center text-blue-100 mt-1 text-sm">
          Flood Relief Affected Registration
        </p>
      </div>

      <!-- Form Section -->
      <div class="p-6">
        <!-- Form -->
        <form @submit.prevent="register" class="space-y-4">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(پورا نام)</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
                nameError ? 'border-red-300 bg-red-50' : 'border-gray-300',
              ]"
              placeholder="Enter your full name"
              @blur="validateName"
              :dir="form.name ? 'ltr' : 'auto'"
            />
          </div>

          <!-- Father's Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Father's Name <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(والد کا نام)</span>
            </label>
            <input
              v-model="form.father"
              type="text"
              required
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
                fatherError ? 'border-red-300 bg-red-50' : 'border-gray-300',
              ]"
              placeholder="Enter father's name"
              @blur="validateFatherName"
              :dir="form.father ? 'ltr' : 'auto'"
            />
          </div>

          <!-- Email Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
              <span class="text-xs text-gray-500 mr-2">(ای میل)</span>
            </label>
            <div class="relative">
              <input
                v-model="form.email"
                type="email"
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
                  emailError ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ]"
                placeholder="Enter your email address"
                @blur="validateEmail"
                :dir="form.email ? 'ltr' : 'auto'"
              />
              <div class="absolute right-3 top-3.5">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- CNIC -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              CNIC Number <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(قومی شناختی کارڈ)</span>
            </label>
            <div class="relative">
              <input
                v-model="form.cnic"
                @input="formatCNIC"
                type="text"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
                  cnicError ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ]"
                placeholder="XXXXX-XXXXXXX-X"
                maxlength="15"
                :dir="form.cnic ? 'ltr' : 'auto'"
              />
              <div class="absolute right-3 top-3.5">
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
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(فون نمبر)</span>
            </label>
            <div class="relative">
              <input
                v-model="form.phone"
                @input="formatPhoneNumber"
                type="tel"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
                  phoneError ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ]"
                placeholder="03XXXXXXXXX"
                maxlength="12"
                :dir="form.phone ? 'ltr' : 'auto'"
              />
              <div class="absolute right-3 top-3.5">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- District Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              District <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(ضلع)</span>
            </label>
            <div class="relative">
              <select
                v-model="form.district"
                @change="updateTehsils"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none',
                  districtError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white',
                ]"
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
              <div class="absolute right-3 top-3.5 pointer-events-none">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Tehsil Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tehsil <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(تحصیل)</span>
            </label>
            <div class="relative">
              <select
                v-model="form.tehsil"
                :disabled="!form.district"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none',
                  tehsilError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed',
                ]"
              >
                <option value="" disabled selected>
                  {{
                    form.district ? "Select Tehsil" : "Select District First"
                  }}
                </option>
                <option
                  v-for="tehsil in filteredTehsils"
                  :key="tehsil.id"
                  :value="tehsil.id"
                >
                  {{ tehsil.name }}
                </option>
              </select>
              <div class="absolute right-3 top-3.5 pointer-events-none">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Village (Separated) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Village <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(گاؤں)</span>
            </label>
            <div class="relative">
              <input
                v-model="form.village"
                type="text"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
                  villageError ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ]"
                placeholder="Enter village name"
                @blur="validateVillage"
                :dir="form.village ? 'ltr' : 'auto'"
              />
              <div class="absolute right-3 top-3.5">
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
            </div>
          </div>

          <!-- Muhalla (Separated) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Muhalla <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(محلہ)</span>
            </label>
            <div class="relative">
              <input
                v-model="form.muhalla"
                type="text"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
                  muhallaError ? 'border-red-300 bg-red-50' : 'border-gray-300',
                ]"
                placeholder="Enter muhalla name"
                @blur="validateMuhalla"
                :dir="form.muhalla ? 'ltr' : 'auto'"
              />
              <div class="absolute right-3 top-3.5">
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
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Password <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(پاس ورڈ)</span>
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPass ? 'text' : 'password'"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10',
                  passwordError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300',
                ]"
                placeholder="Create a strong password"
                @blur="validatePassword"
                :dir="form.password ? 'ltr' : 'auto'"
              />
              <button
                type="button"
                @click="showPass = !showPass"
                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="showPass"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span class="text-red-500">*</span>
              <span class="text-xs text-gray-500 mr-2">(پاس ورڈ کی تصدیق)</span>
            </label>
            <div class="relative">
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPass ? 'text' : 'password'"
                required
                :class="[
                  'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10',
                  confirmPasswordError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300',
                ]"
                placeholder="Confirm your password"
                @blur="validateConfirmPassword"
                :dir="form.confirmPassword ? 'ltr' : 'auto'"
              />
              <button
                type="button"
                @click="showConfirmPass = !showConfirmPass"
                class="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="showConfirmPass"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start pt-2">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.terms"
                type="checkbox"
                required
                :class="[
                  'h-4 w-4 rounded focus:ring-blue-500',
                  termsError
                    ? 'text-red-600 border-red-300'
                    : 'text-blue-600 border-gray-300',
                ]"
              />
            </div>
            <div class="ml-3">
              <label for="terms" class="text-sm text-gray-700">
                I agree to the
                <a
                  href="#"
                  class="text-blue-600 hover:text-blue-500 font-medium"
                  >Terms of Service</a
                >
                and
                <a
                  href="#"
                  class="text-blue-600 hover:text-blue-500 font-medium"
                  >Privacy Policy</a
                >
                <span class="text-red-500">*</span>
                <span class="text-xs text-gray-500 mr-2 block mt-1">
                  (میں خدمات کی شرائط اور رازداری کی پالیسی سے اتفاق کرتا/کرتی
                  ہوں)
                </span>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            :class="[
              'w-full py-3 px-4 text-white font-medium rounded-lg transition-all shadow-md',
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5',
            ]"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Creating Account...
            </span>
            <span v-else class="flex items-center justify-center">
              Create Account
              <span class="mr-2 text-xs opacity-90">(اکاؤنٹ بنائیں)</span>
            </span>
          </button>
        </form>
        <div
          v-if="responseMessage"
          class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
        >
          {{ responseMessage }}
        </div>

        <!-- Login Link -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-center text-sm text-gray-600">
            Already have an account?
            <nuxt-link
              to="/login"
              class="font-medium text-blue-600 hover:text-blue-500 ml-1"
              >Sign in</nuxt-link
            >
            <span class="block text-xs text-gray-500 mt-1">
              (پہلے سے اکاؤنٹ ہے؟ سائن ان کریں)
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

// router
const router = useRouter();
// nuxt specific
definePageMeta({
  middleware: "guest-only",
});
useSeoMeta({
  title: "Register Page",
  description: "Create an account for Flood Relief Victim Portal",
});
const store = useAuthStore();

// Form data
const form = reactive({
  name: "",
  father: "",
  email: "",
  cnic: "",
  phone: "",
  district: "",
  tehsil: "",
  village: "", // Added village field
  muhalla: "", // Added muhalla field
  password: "",
  confirmPassword: "",
  terms: false,
});

// State
const showPass = ref(false);
const showConfirmPass = ref(false);
const loading = ref(false);
const showErrorToast = ref(false);
const toastTimer = ref(0);
let toastInterval = null;

// Validation errors
const nameError = ref("");
const fatherError = ref("");
const emailError = ref("");
const cnicError = ref("");
const phoneError = ref("");
const districtError = ref("");
const tehsilError = ref("");
const villageError = ref(""); // Added village error
const muhallaError = ref(""); // Added muhalla error
const passwordError = ref("");
const confirmPasswordError = ref("");
const termsError = ref("");
const responseMessage = ref("");

// District and Tehsil data (with Swat as the main district)
const districts = ref([
  { id: "swat", name: "Swat" },
  // { id: 'lower_dir', name: 'Lower Dir' },
  // { id: 'upper_dir', name: 'Upper Dir' },
  // { id: 'chitral', name: 'Chitral' },
  // { id: 'malakand', name: 'Malakand' },
  // { id: 'buner', name: 'Buner' },
  // { id: 'shangla', name: 'Shangla' },
]);

const tehsils = ref([
  // Swat District Tehsils
  { id: "matta", districtId: "swat", name: "Matta" },
  { id: "khwazakhela", districtId: "swat", name: "Khwazakhela" },
  { id: "bahrain", districtId: "swat", name: "Bahrain" },
  { id: "kabal", districtId: "swat", name: "Kabal" },
  { id: "barikot", districtId: "swat", name: "Barikot" },
  { id: "babuzai", districtId: "swat", name: "Babuzai" },
  { id: "charbagh", districtId: "swat", name: "Charbagh" },

  // Lower Dir Tehsils
  { id: "timergara", districtId: "lower_dir", name: "Timergara" },
  { id: "samar_bag", districtId: "lower_dir", name: "Samar Bag" },
  { id: "lal_qila", districtId: "lower_dir", name: "Lal Qila" },
  { id: "maidan", districtId: "lower_dir", name: "Maidan" },

  // Upper Dir Tehsils
  { id: "dir", districtId: "upper_dir", name: "Dir" },
  { id: "wari", districtId: "upper_dir", name: "Wari" },
  { id: "shiringal", districtId: "upper_dir", name: "Shiringal" },

  // Chitral Tehsils
  { id: "chitral", districtId: "chitral", name: "Chitral" },
  { id: "mastuj", districtId: "chitral", name: "Mastuj" },
  { id: "torkhow", districtId: "chitral", name: "Torkhow" },

  // Malakand Tehsils
  { id: "batkhela", districtId: "malakand", name: "Batkhela" },
  { id: "dargai", districtId: "malakand", name: "Dargai" },

  // Buner Tehsils
  { id: "daggar", districtId: "buner", name: "Daggar" },
  { id: "gagra", districtId: "buner", name: "Gagra" },
  { id: "khudu_khel", districtId: "buner", name: "Khudu Khel" },

  // Shangla Tehsils
  { id: "alar", districtId: "shangla", name: "Alar" },
  { id: "bisham", districtId: "shangla", name: "Bisham" },
  { id: "chakesar", districtId: "shangla", name: "Chakesar" },
  { id: "martung", districtId: "shangla", name: "Martung" },
  { id: "puran", districtId: "shangla", name: "Puran" },
]);

// Computed properties
const filteredTehsils = computed(() => {
  if (!form.district) return [];
  return tehsils.value.filter((tehsil) => tehsil.districtId === form.district);
});

const errorSummary = computed(() => {
  const errors = [];
  if (nameError.value) errors.push({ field: "name", message: nameError.value });
  if (fatherError.value)
    errors.push({ field: "father's name", message: fatherError.value });
  if (emailError.value)
    errors.push({ field: "email", message: emailError.value });
  if (cnicError.value) errors.push({ field: "cnic", message: cnicError.value });
  if (phoneError.value)
    errors.push({ field: "phone", message: phoneError.value });
  if (districtError.value)
    errors.push({ field: "district", message: districtError.value });
  if (tehsilError.value)
    errors.push({ field: "tehsil", message: tehsilError.value });
  if (villageError.value)
    errors.push({ field: "village", message: villageError.value });
  if (muhallaError.value)
    errors.push({ field: "muhalla", message: muhallaError.value });
  if (passwordError.value)
    errors.push({ field: "password", message: passwordError.value });
  if (confirmPasswordError.value)
    errors.push({
      field: "confirm password",
      message: confirmPasswordError.value,
    });
  if (termsError.value)
    errors.push({ field: "terms", message: termsError.value });
  return errors;
});

const hasErrors = computed(() => {
  return errorSummary.value.length > 0;
});

// Toast management
const showToast = () => {
  showErrorToast.value = true;
  toastTimer.value = 5000; // 5 seconds

  // Clear any existing interval
  if (toastInterval) clearInterval(toastInterval);

  // Start countdown
  toastInterval = setInterval(() => {
    toastTimer.value -= 100;
    if (toastTimer.value <= 0) {
      clearInterval(toastInterval);
      showErrorToast.value = false;
    }
  }, 100);
};

// Watch for toast changes to reset timer when closed
watch(showErrorToast, (newVal) => {
  if (!newVal && toastInterval) {
    clearInterval(toastInterval);
    toastTimer.value = 0;
  }
});

// Validation methods
const validateName = () => {
  if (!form.name.trim()) {
    nameError.value = "Full name is required";
  } else if (form.name.length < 3) {
    nameError.value = "Name must be at least 3 characters";
  } else {
    nameError.value = "";
  }
};

const validateFatherName = () => {
  if (!form.father.trim()) {
    fatherError.value = "Father's name is required";
  } else if (form.father.length < 3) {
    fatherError.value = "Father's name must be at least 3 characters";
  } else {
    fatherError.value = "";
  }
};

// Added email validation
const validateEmail = () => {
  if (form.email.trim() === "") {
    emailError.value = ""; // Email is optional
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      emailError.value = "Please enter a valid email address";
    } else {
      emailError.value = "";
    }
  }
};

const validateCNIC = () => {
  const cnicPattern = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
  if (!form.cnic) {
    cnicError.value = "CNIC is required";
  } else if (!cnicPattern.test(form.cnic)) {
    cnicError.value = "CNIC format must be XXXXX-XXXXXXX-X";
  } else {
    cnicError.value = "";
  }
};

const validatePhoneNumber = () => {
  const phonePattern = /^03\d{9}$/;
  if (!form.phone) {
    phoneError.value = "Phone number is required";
  } else if (!phonePattern.test(form.phone)) {
    phoneError.value = "Phone format must be 03XXXXXXXXX";
  } else {
    phoneError.value = "";
  }
};

const validateDistrict = () => {
  if (!form.district) {
    districtError.value = "District is required";
  } else {
    districtError.value = "";
  }
};

const validateTehsil = () => {
  if (!form.tehsil) {
    tehsilError.value = "Tehsil is required";
  } else {
    tehsilError.value = "";
  }
};

// Added village validation
const validateVillage = () => {
  if (!form.village.trim()) {
    villageError.value = "Village is required";
  } else if (form.village.length < 3) {
    villageError.value = "Please enter a valid village name";
  } else {
    villageError.value = "";
  }
};

// Updated muhalla validation
const validateMuhalla = () => {
  if (!form.muhalla.trim()) {
    muhallaError.value = "Muhalla is required";
  } else if (form.muhalla.length < 3) {
    muhallaError.value = "Please enter a valid muhalla name";
  } else {
    muhallaError.value = "";
  }
};

const validatePassword = () => {
  if (!form.password) {
    passwordError.value = "Password is required";
  } else if (form.password.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
  } else {
    passwordError.value = "";
  }
};

const validateConfirmPassword = () => {
  if (!form.confirmPassword) {
    confirmPasswordError.value = "Please confirm your password";
  } else if (form.password !== form.confirmPassword) {
    confirmPasswordError.value = "Passwords do not match";
  } else {
    confirmPasswordError.value = "";
  }
};

const validateTerms = () => {
  if (!form.terms) {
    termsError.value = "You must agree to the terms and conditions";
  } else {
    termsError.value = "";
  }
};

// Formatting methods
const formatCNIC = () => {
  let value = form.cnic.replace(/[^\d]/g, "");

  if (value.length > 13) {
    value = value.substring(0, 13);
  }

  if (value.length > 5) {
    value = value.substring(0, 5) + "-" + value.substring(5);
  }
  if (value.length > 13) {
    value = value.substring(0, 13) + "-" + value.substring(13);
  }

  form.cnic = value;
  validateCNIC();
};

const formatPhoneNumber = () => {
  let value = form.phone.replace(/[^\d]/g, "");

  if (value.length > 11) {
    value = value.substring(0, 11);
  }

  form.phone = value;
  validatePhoneNumber();
};

// Update tehsils when district changes
const updateTehsils = () => {
  form.tehsil = "";
  validateDistrict();
};

// Validate all fields
const validateAllFields = () => {
  validateName();
  validateFatherName();
  validateEmail();
  validateCNIC();
  validatePhoneNumber();
  validateDistrict();
  validateTehsil();
  validateVillage(); // Added village validation
  validateMuhalla(); // Added muhalla validation
  validatePassword();
  validateConfirmPassword();
  validateTerms();
};

// Register function
const register = async () => {
  // Validate all fields
  validateAllFields();

  if (hasErrors.value) {
    showToast();
    return;
  }

  loading.value = true;

  try {
    // Get district and tehsil names from IDs
    const districtName =
      districts.value.find((d) => d.id === form.district)?.name || "";
    const tehsilName =
      tehsils.value.find((t) => t.id === form.tehsil)?.name || "";

    const response = await store.registerUser(
      form.name,
      form.father,
      form.email,
      form.cnic,
      form.phone,
      form.village, // Send village
      form.muhalla, // Send muhalla
      tehsilName,
      districtName,
      form.password
    );
    responseMessage.value = response.data.msg;
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err) {
    console.error("Registration error:", err);
    responseMessage.value = "";
    // Show server errors in toast
    if (err.response?.data?.message) {
      nameError.value = err.response.data.message;
      showToast();
    } else if (err.response?.data?.errors) {
      // Handle validation errors from server
      const serverErrors = err.response.data.errors;
      // You could map server errors to your error states here
      nameError.value = Object.values(serverErrors).flat().join(", ");
      showToast();
    } else {
      nameError.value = "Registration failed. Please try again.";
      showToast();
    }
  } finally {
    loading.value = false;
  }
};

// Auto-select Swat on mount
onMounted(() => {
  form.district = "swat";
});
onUnmounted(() => {
  if (toastInterval) clearInterval(toastInterval);
});
</script>

<style scoped>
/* Custom styles */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Hide default dropdown arrow in IE */
select::-ms-expand {
  display: none;
}

/* Focus styles */
input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

/* Transition for all interactive elements */
input,
select,
button {
  transition: all 0.2s ease-in-out;
}

/* Button hover effect */
button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Toast animation */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .fixed.top-4.right-4.left-4 {
    margin: 0 1rem;
  }
}
</style>