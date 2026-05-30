
// import { useAuthStore } from "~/stores/auth"

// export default defineNuxtRouteMiddleware(async (to) => {
//   // 1. SAFEGUARD: Check for PWA isolated background service worker scopes
//   if (import.meta.client && typeof window === 'undefined') return

//   // 2. FIXED: Catch the Nitro Prerender phase safely using modern Nuxt 4 syntax
//   if (import.meta.server) {
//     const nuxtApp = useNuxtApp()
//     // If we are currently prerendering the fallback file shell, skip auth entirely
//     if (to.path === '/200.html' || nuxtApp.ssrContext?.islandContext) {
//       return
//     }
//   }

//   // 3. Skip restriction rules for public paths
//   const publicPages = ['/login', '/register', '/']
//   if (publicPages.includes(to.path)) return

//   const auth = useAuthStore()

//   // 4. Run your async authentication routines
//   if (!auth.userData) {
//     try {
//       await auth.userAuthStatus()
//     } catch (error) {
//       console.error('SSR Auth validation failed:', error)
//     }
//   }

//   // 5. Explicit navigation route redirection guard
//   if (!auth.userData) {
//     return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, {
//       replace: true,
//     })
//   }
// })

// middleware/auth.ts
import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip on server - auth pages are client-only now
  if (process.server) return

  const publicPages = ['/login', '/register', '/user/forgot-password', '/reset-password']
  if (publicPages.includes(to.path)) return

  const auth = useAuthStore()

  if (!auth.isAuthChecked) {
    try {
      await auth.userAuthStatus()
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }

  if (!auth.userData) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, {
      replace: true
    })
  }
})