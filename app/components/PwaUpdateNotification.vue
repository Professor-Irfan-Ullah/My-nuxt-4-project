<script setup>
// Nuxt PWA module injects $pwa directly into your runtime utilities
const { $pwa } = useNuxtApp();
</script>

<template>
  <!-- Show banner only when a new service worker is waiting to take over -->
  <div
    v-if="$pwa?.needRefresh"
    class="fixed top-4 right-4 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 z-50 max-w-sm flex flex-col gap-2 animate-bounce"
  >
    <p class="text-sm font-semibold">A new application update is available!</p>
    <div class="flex gap-2 justify-end">
      <button
        @click="$pwa.updateServiceWorker()"
        class="bg-emerald-600 hover:bg-emerald-500 text-xs px-3 py-1.5 rounded font-medium transition"
      >
        Reload & Update
      </button>
    </div>
  </div>
</template>
