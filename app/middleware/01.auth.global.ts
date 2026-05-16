import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  const publicPages = ['/login', '/register', '/']

  // CRITICAL: If the target page is public, stop immediately.
  if (publicPages.includes(to.path)) return

  // Check auth status (this must use forward headers in the store!)
  if (!auth.userData) {
    await auth.userAuthStatus()
  }

  // If still no user, only then redirect to login
 if(!auth.userData) {
  return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, {
    replace:true,
  })
 }
})
