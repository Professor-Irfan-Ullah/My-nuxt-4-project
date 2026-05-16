<!-- app/pages/index.vue -->
<!-- <template>
  <div class="flex flex-col items-center justify-center min-h-screen space-y-4">
    <h1 class="text-4xl font-bold">Welcome to Nuxt 4</h1>
    <div class="flex gap-4">
      <NuxtLink to="/login" class="px-4 py-2 bg-blue-600 text-white rounded"
        >Login</NuxtLink
      >
      <NuxtLink to="/register" class="px-4 py-2 bg-green-600 text-white rounded"
        >Register</NuxtLink
      >
    </div>
  </div>
</template> -->
<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo("/login");
    },
  ],
});
</script>
