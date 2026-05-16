<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo("/admin/reports");
    },
  ],
});
</script>