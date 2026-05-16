<template>admin index.vue page</template>
<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo("/login");
    },
  ],
});
</script>