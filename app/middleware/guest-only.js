import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  // Ensure we have current status
  if (!auth.userData) {
    await auth.userAuthStatus()
  }

  // If the user IS logged in, get them out of here
  if (auth.userData) {
    // Only redirect if they aren't ALREADY at their destination
    const target = getRoleBasedPath(auth.userData)

    if (to.path !== target) {
      return navigateTo(target, { replace: true })
    }
  }
})
