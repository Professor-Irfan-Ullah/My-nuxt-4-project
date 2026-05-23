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
            <h3 class="text-sm font-semibold text-red-800">Login Failed</h3>
            <div class="mt-2">
              <ul class="text-sm text-red-700 space-y-1">
                <li
                  v-for="error in errorSummary"
                  :key="error"
                  class="flex items-start"
                >
                  <svg
                    class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="2" />
                  </svg>
                  <span>{{ error }}</span>
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

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed top-4 right-4 left-4 z-50 animate-slideDown"
    >
      <div class="bg-green-50 border border-green-200 rounded-xl shadow-lg p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg
              class="h-6 w-6 text-green-600"
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
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-semibold text-green-800">
              Login Successful
            </h3>
            <div class="mt-1">
              <p class="text-sm text-green-700">{{ successMessage }}</p>
            </div>
          </div>
          <button
            @click="showSuccessToast = false"
            class="ml-3 flex-shrink-0 text-green-500 hover:text-green-700"
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
          v-if="successToastTimer > 0"
          class="mt-3 h-1 bg-green-200 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-green-500 transition-all duration-300"
            :style="{ width: `${(successToastTimer / 3000) * 100}%` }"
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-center">Welcome Back</h1>
        <p class="text-center text-blue-100 mt-1 text-sm">
          Flood Relief Affected Portal
        </p>
      </div>

      <!-- Form Section -->
      <div class="p-6">
        <!-- Form -->
        <client-only>
          <form @submit.prevent="login" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="form.email"
                  type="email"
                  required
                  :class="[
                    'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all',
                    emailError ? 'border-red-300 bg-red-50' : 'border-gray-300',
                  ]"
                  placeholder="Enter your email address"
                  @blur="validateEmail"
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
              <!-- <p v-if="emailHelpText" class="text-xs text-gray-500 mt-1">
              {{ emailHelpText }}
            </p> -->
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Password <span class="text-red-500">*</span>
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
                  placeholder="Enter your password"
                  @blur="validatePassword"
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
              <div class="flex justify-between items-center mt-1">
                <p v-if="passwordError" class="text-sm text-red-600">
                  {{ passwordError }}
                </p>
                <button
                  type="button"
                  @click="goToForgotPassword"
                  class="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="flex items-center">
              <input
                id="remember"
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="remember" class="ml-2 text-sm text-gray-700">
                Remember me
              </label>
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
                Signing In...
              </span>
              <span v-else>Sign In</span>
            </button>
          </form>
        </client-only>

        <!-- Register Link -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-center text-sm text-gray-600">
            Don't have an account?
            <nuxt-link
              to="/register"
              class="font-medium text-blue-600 hover:text-blue-500 ml-1"
            >
              Create account
            </nuxt-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
const store = useAuthStore();
const router = useRouter();
const route = useRoute();
// nuxt specific
definePageMeta({
  middleware: "guest-only",
});
useSeoMeta({
  title: "Login Page",
});
// Form data
const form = reactive({
  email: "",
  password: "",
  remember: true,
});

// State
const showPass = ref(false);
const loading = ref(false);
const showErrorToast = ref(false);
const showSuccessToast = ref(false);
const toastTimer = ref(0);
const successToastTimer = ref(0);
const successMessage = ref("");
let toastInterval = null;
let successToastInterval = null;

// Validation errors
const emailError = ref("");
const passwordError = ref("");

const errorSummary = computed(() => {
  const errors = [];
  if (emailError.value) errors.push(emailError.value);
  if (passwordError.value) errors.push(passwordError.value);
  return errors;
});

const hasErrors = computed(() => {
  return errorSummary.value.length > 0;
});

// Toast management
const showErrorToastMessage = (errors = []) => {
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

const showSuccessToastMessage = (
  message = "Login successful! Redirecting..."
) => {
  successMessage.value = message;
  showSuccessToast.value = true;
  successToastTimer.value = 3000; // 3 seconds

  // Clear any existing interval
  if (successToastInterval) clearInterval(successToastInterval);

  // Start countdown
  successToastInterval = setInterval(() => {
    successToastTimer.value -= 100;
    if (successToastTimer.value <= 0) {
      clearInterval(successToastInterval);
      showSuccessToast.value = false;
    }
  }, 100);
};

// Validation methods
const validateEmail = () => {
  if (!form.email.trim()) {
    emailError.value = "Email address is required";
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      emailError.value = "Please enter a valid email address";
    } else {
      emailError.value = "";
    }
  }
};

const validatePassword = () => {
  if (!form.password) {
    passwordError.value = "Password is required";
  } else {
    passwordError.value = "";
  }
};

// Validate all fields
const validateAllFields = () => {
  validateEmail();
  validatePassword();
};

// Login function
const login = async () => {
  // Validate all fields
  validateAllFields();

  if (hasErrors.value) {
    showErrorToastMessage();
    return;
  }

  loading.value = true;

  try {
    // Prepare login data
    const loginData = {
      email: form.email,
      password: form.password,
      remember: form.remember,
    };

    // const response = await api.post('/api/auth/login', loginData)
    const response = await store.login(loginData.email, loginData.password);

    console.log("Login successful:", response.user);

    // Show success message
    let redirectPath = route.query.redirect;
    const userName =
      response.user?.name || response.user?.email?.split("@")[0] || "User";
    showSuccessToastMessage(
      `Welcome back, ${userName}! Redirecting to ${
        redirectPath ? redirectPath : "Dashboard"
      }...`
    );

    if (redirectPath) {
      setTimeout(() => {
        redirectPath = decodeURIComponent(redirectPath);
        router.push(redirectPath);
      }, 1000);
    } else {
      setTimeout(() => {
        navigateUserByRole(response.user);
      }, 2000);
    }
    // Wait a moment to show the success message, then redirect
  } catch (err) {
    // Handle different error types
    if (err.response?.status === 401) {
      emailError.value = "Invalid credentials";
      passwordError.value = "Please check your password and email";
      showErrorToastMessage(["Invalid email or password"]);
    } else if (err.response?.status === 404) {
      emailError.value = "Account not found";
      showErrorToastMessage([
        "Account not found. Please check your credentials or create an account.",
      ]);
    } else if (err.response?._data?.message) {
      emailError.value = err.response.data.message;
      showErrorToastMessage([err.response.data.message]);
    } else {
      console.error("Login error:", err.message);
      errorSummary.value.push(
        "Looks like server is disconneced, Please try again."
      );
      showErrorToastMessage();
    }
  } finally {
    loading.value = false;
  }
};

const goToForgotPassword = () => {
  router.push("/forgot-password");
};

// Auto-focus email field on mount
onMounted(() => {
  setTimeout(() => {
    document.querySelector('input[type="email"]')?.focus();
  }, 100);
});
onUnmounted(() => {
  if (toastInterval) clearInterval(toastInterval);
  if (successToastInterval) clearInterval(successToastInterval);
});
</script>

<style scoped>
/* Custom styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

/* Transition for all interactive elements */
input,
button {
  transition: all 0.2s ease-in-out;
}

/* Button hover effect */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

/* Loading button effect */
button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

/* Demo info toggle */
@media (max-width: 768px) {
  .demo-info-toggle {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
  }
}
</style>