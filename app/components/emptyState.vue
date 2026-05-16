<template>
  <section>
    <div class="p-8 text-center">
      <svg
        class="w-16 h-16 text-gray-400 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">No reports found</h3>
      <p class="mt-2 text-gray-500">
        Try adjusting your filters or check back later.
      </p>
      <button
        @click="clearFilters"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  </section>
</template>
<script setup>
const emits = defineEmits(["clearFilters"]);
const clearFilters = () => {
  emits("clearFilters");
};
</script>