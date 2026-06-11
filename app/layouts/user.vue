<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header with Navigation -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo/Brand -->
          <div class="flex-shrink-0">
            <p class="text-xl font-bold text-gray-800">DRMS</p>
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden md:flex items-center space-x-4">
            <NuxtLink
              to="/user/add-report"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-gray-100 text-gray-900"
            >
              Add Report
            </NuxtLink>

            <NuxtLink
              to="/login"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-gray-100 text-gray-900"
            >
              Login
            </NuxtLink>

            <NuxtLink
              to="/register"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-gray-100 text-gray-900"
            >
              Register
            </NuxtLink>
          </div>

          <!-- Right side items -->
          <div class="flex items-center space-x-4">
            <!-- Online Status Indicator -->
            <div class="flex items-center">
              <span class="relative flex h-3 w-3">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  :class="isOnline ? 'bg-green-400' : 'bg-red-400'"
                />
                <span
                  class="relative inline-flex rounded-full h-3 w-3"
                  :class="isOnline ? 'bg-green-500' : 'bg-red-500'"
                />
              </span>
              <span class="hidden sm:inline ml-2 text-sm text-gray-600">
                {{ isOnline ? "Online" : "Offline" }}
              </span>
            </div>

            <!-- Mobile menu button -->
            <button
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <span class="sr-only">Open main menu</span>
              <!-- Hamburger icon -->
              <svg
                v-if="!isMobileMenuOpen"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <!-- Close icon -->
              <svg
                v-else
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        </div>

        <!-- Mobile Navigation Menu -->
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden border-t border-gray-200 py-2"
        >
          <div class="space-y-1">
            <NuxtLink
              to="/user/add-report"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-gray-100 text-gray-900"
              @click="isMobileMenuOpen = false"
            >
              Add Report
            </NuxtLink>

            <NuxtLink
              to="/login"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-gray-100 text-gray-900"
              @click="isMobileMenuOpen = false"
            >
              Login
            </NuxtLink>

            <NuxtLink
              to="/register"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              active-class="bg-gray-100 text-gray-900"
              @click="isMobileMenuOpen = false"
            >
              Register
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>

<script setup>
// Mobile menu state
const isMobileMenuOpen = ref(false);

// Online status detection
const { isOnline, isChecking } = useOnlineStatus();

// Close mobile menu on route change
const route = useRoute();
watch(
  () => route.path,
  () => {
    isMobileMenuOpen.value = false;
  }
);

onUnmounted(() => {
  window.removeEventListener("online", () => {});
  window.removeEventListener("offline", () => {});
});
</script>