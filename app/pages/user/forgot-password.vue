<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4"
        >
          <svg
            class="h-8 w-8 text-blue-600"
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
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">
          Forgot Password?
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <!-- Card -->
      <div
        class="mt-8 bg-white py-8 px-4 shadow-sm border border-gray-200 rounded-xl sm:px-10"
      >
        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span class="text-red-500">*</span>
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
                    d="M16 12H8m8 4h-4m-4 4h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <input
                type="email"
                v-model="formData.email"
                @input="validateEmail"
                @blur="validateEmail"
                placeholder="you@example.com"
                class="w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :class="inputClasses"
                :disabled="isSubmitting || isEmailSent"
                autocomplete="email"
                spellcheck="false"
              />

              <!-- Validation Icons -->
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <!-- Loading Spinner -->
                <svg
                  v-if="isValidating"
                  class="animate-spin h-5 w-5 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  role="status"
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

                <!-- Valid Email Icon -->
                <svg
                  v-else-if="isValidEmail && !errors.email"
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

                <!-- Error Icon -->
                <svg
                  v-else-if="errors.email"
                  class="h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <!-- Error Message -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform -translate-y-2 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform -translate-y-2 opacity-0"
            >
              <p
                v-if="errors.email"
                class="mt-2 text-sm text-red-600 flex items-start"
              >
                <svg
                  class="h-4 w-4 mr-1 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>{{ errors.email }}</span>
              </p>
            </transition>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!isFormValid || isSubmitting || isEmailSent"
            class="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="!isSubmitting && !isEmailSent"
              class="w-5 h-5 mr-2"
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
              v-else-if="isEmailSent"
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
          <div v-if="isEmailSent" class="mt-6">
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
                    Reset link sent!
                  </h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>
                      If an account exists for
                      <span class="font-medium">{{ formData.email }}</span
                      >, you'll receive password reset instructions.
                    </p>
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
          <div v-if="errorMessage" class="mt-6">
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
                <div class="ml-3">
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

        <!-- Additional Links -->
        <div class="mt-6 text-center">
          <div class="space-y-2">
            <p class="text-xs text-gray-500">
              Remember your password?
              <router-link
                to="/login"
                class="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Security Note -->
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
          We'll never share your email with anyone else.
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "~/stores/auth";

useSeoMeta({
  title: "Forgot Password Page",
  description: "Reset your password securely",
});
// store
const store = useAuthStore();

// Form State
const formData = ref({
  email: "",
});

// UI State
const isSubmitting = ref(false);
const isValidating = ref(false);
const isEmailSent = ref(false);
const errorMessage = ref("");

// Errors
const errors = ref({
  email: "",
});
// Computed Properties
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.value.email);
});

const isFormValid = computed(() => {
  return isValidEmail.value && !errors.value.email && !isSubmitting.value;
});

const inputClasses = computed(() => {
  if (errors.value.email) {
    return "border-red-300 bg-red-50";
  }
  if (isValidating.value) {
    return "border-blue-300 bg-blue-50";
  }
  if (isValidEmail.value && !errors.value.email) {
    return "border-green-300 bg-green-50";
  }
  return "border-gray-300";
});

const buttonText = computed(() => {
  if (isSubmitting.value) return "Sending...";
  if (isEmailSent.value) return "Reset Link Sent";
  return "Send Reset Link";
});

// Methods
const validateEmail = () => {
  isValidating.value = true;

  // Simulate async validation
  setTimeout(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.value.email) {
      errors.value.email = "Email is required";
    } else if (!emailRegex.test(formData.value.email)) {
      errors.value.email = "Please enter a valid email address";
    } else {
      errors.value.email = "";
    }

    isValidating.value = false;
  }, 300);
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  clearMessages();

  try {
    // Simulate API call
    await store.forgotPassword(formData.value.email);

    // Success - always show generic message for security
    isEmailSent.value = true;
    // })
  } catch (error) {
    errorMessage.value =
      error.response._data.message || "An error occurred. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

// Clear messages
const clearMessages = () => {
  errorMessage.value = "";
};

const clearError = () => {
  errorMessage.value = "";
};
</script>

<style scoped>
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
</style>