<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div
          class="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            class="h-6 w-6 text-blue-600"
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
        <h2 class="text-3xl font-bold text-gray-900">Verify Your Email</h2>
        <p class="mt-2 text-gray-600">
          Enter your password to complete verification
        </p>
      </div>

      <!-- Main Card -->
      <div class="bg-white p-8 rounded-xl shadow-lg">
        <!-- Success State -->
        <div v-if="verificationSuccess" class="text-center py-8">
          <div
            class="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              class="h-8 w-8 text-green-600"
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
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            Email Verified!
          </h3>
          <p class="text-gray-600 mb-6">
            Your email has been successfully verified.
          </p>
          <button
            @click="goToLogin"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Go to Login Page
          </button>
        </div>

        <!-- Verification Form -->
        <form v-else @submit.prevent="handleVerification" class="space-y-6">
          <!-- Token Info -->
          <div
            v-if="verificationData.token"
            class="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-blue-500 mr-2"
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
              <span class="text-sm text-blue-700"
                >Verifying:
                {{ verificationData.email || "your email address" }}</span
              >
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Enter your password
            </label>
            <div class="relative">
              <input
                v-model="verificationData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Your account password"
                required
                :disabled="loading"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-400"
              >
                <svg
                  v-if="showPassword"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
                <svg
                  v-else
                  class="h-5 w-5"
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
              </button>
            </div>
            <p class="mt-2 text-sm text-gray-500">
              Enter the password you used when creating your account
            </p>
          </div>

          <!-- Error Message -->
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5 text-red-500 mr-2"
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
              <span class="text-sm text-red-700">{{ error }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading || !verificationData.token"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
          >
            <svg
              v-if="loading"
              class="animate-spin h-5 w-5 mr-2 text-white"
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
            {{ loading ? "Verifying..." : "Verify Email" }}
          </button>

          <!-- Help Text -->
          <div class="text-center pt-4 border-t">
            <p class="text-sm text-gray-600">
              Need help?
              <button
                disabled
                type="button"
                @click="resendEmail"
                class="text-blue-600 hover:text-blue-800 font-medium disabled:cursor-not-allowed disabled:opacity-50 transition"
              >
                Resend verification email
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

useSeoMeta({
  title: "Email Verification Page",
});

// Store
const store = useAuthStore();
// Router
const route = useRoute();

// State
const verificationSuccess = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const error = ref("");

// Verification Data
const verificationData = reactive({
  token: "",
  email: "",
  password: "",
});

// Demo credentials
const validPassword = "SecurePass123!";

// Extract token from route
const extractToken = () => {
  // Get token from URL query parameter
  const token = route.query.token || "";
  const email = route.query.email || "";

  verificationData.token = token;
  verificationData.email = email;

  // If no token, show error
  if (!token) {
    error.value =
      "Invalid verification link. Please check your email for the correct link.";
  }
};

// Handle verification
const handleVerification = async () => {
  if (!verificationData.password) {
    error.value = "Please enter your password";
    return;
  }

  loading.value = true;
  error.value = "";

  // Simulate API delay
  //   await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    await store.verifyEmailRegistration(
      verificationData.password,
      verificationData.token
    );
    verificationSuccess.value = true;
  } catch (err) {
    console.log(err);
    error.value = err.response._data.message ?? err.response._data.msg;
  } finally {
    loading.value = false;
  }
};

// Resend email
const resendEmail = () => {
  alert(
    "A new verification email will be sent to your email address in future."
  );
};

// Go to dashboard
const goToLogin = () => {
  router.replace("/login");

  // In real app: router.push('/dashboard')
};

// On component mount
onMounted(() => {
  extractToken();
});
</script>

<style scoped>
/* Smooth transitions */
button,
input {
  transition: all 0.2s ease;
}
</style>