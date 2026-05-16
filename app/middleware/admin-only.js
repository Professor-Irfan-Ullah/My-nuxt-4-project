import { useAuthStore } from "~/stores/auth";

// app/middleware/admin-only.ts
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();

  if (auth.userData?.role !== 'admin') {
    return navigateUserByRole(auth.userData); // Kick back to user dashboard
  }
});
