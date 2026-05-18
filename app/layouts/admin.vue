<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Bar -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <span class="text-white font-bold text-lg">A</span>
            </div>
            <span class="font-semibold text-gray-900 hidden sm:inline"
              >Admin Portal</span
            >
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink
              to="/admin/dashboard"
              class="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              active-class="text-blue-600"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/admin/reports"
              class="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              active-class="text-blue-600"
            >
              Reports
            </NuxtLink>
          </nav>

          <!-- Right Section: User Initial -->
          <div class="relative">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow"
            >
              {{ userNameFetch }}
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
            >
              <p class="p-2">
                {{ store?.userData?.name }}
              </p>
              <!-- <button
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile
              </button>
              <button
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                Settings
              </button>
              <div class="border-t border-gray-100 my-1"></div>
              <button
                @click="logout"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Bottom Navigation -->
    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
    >
      <div class="flex items-center justify-around py-2">
        <NuxtLink
          to="/admin/dashboard"
          class="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          active-class="text-blue-600"
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span class="text-xs">Home</span>
        </NuxtLink>

        <NuxtLink
          to="/admin/reports"
          class="flex flex-col items-center gap-1 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          active-class="text-blue-600"
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span class="text-xs">Reports</span>
        </NuxtLink>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pb-20 md:pb-0">
      <div class="px-4 sm:px-6 lg:px-8 py-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";

const store = useAuthStore();
const dropdownOpen = ref(false);

const userNameFetch = computed(() => {
  if (store?.userData?.name) {
    return store.userData.name[0];
  }
  return "Error";
});
// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest(".relative")) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const logout = () => {
  navigateTo("/login");
};
</script>