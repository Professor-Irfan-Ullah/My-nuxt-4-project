<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo("/user/dashboard");
    },
  ],
});
</script>