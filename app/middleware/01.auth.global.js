
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

// export default defineNuxtRouteMiddleware(async (to) => {
//   // Skip on server - auth pages are client-only now
//   if (process.server) return
//   if (!navigator.onLine) {
//     console.log("offline in global auth");
//     return

//   }
//   const publicPages = ['/login', '/register', '/user/forgot-password', '/reset-password']
//   if (publicPages.includes(to.path)) return
//   console.warn('running global auth middleware');

//   const auth = useAuthStore()
//   const isAuth = await auth.userAuthStatus()
//   console.warn(isAuth, 'checking isAuth on global auth');

//   if (isAuth) {
//     try {
//       await auth.userAuthStatus()
//     } catch (error) {
//       console.error('Auth check failed in global-auth:')
//     }
//   }

//   // if (!auth.userData) {
//   //   return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`, {
//   //     replace: true
//   //   })
//   // }
//   /*
//   */
// })
// middleware/01.auth.global.ts
// middleware/01.auth.global.ts

// Helper function to verify actual internet connectivity
export const hasInternet = async () => {
  // If the browser natively reports offline, it's definitely offline
  if (!navigator.onLine) return false

  try {
    // Quick ping to your API backend with a aggressive timeout (2 seconds)
    // We use a HEAD request so it transfers 0 bytes of data, making it instant.
    await useApi('/api/auth/test', {
      method: 'HEAD',
      timeout: 2000
    })
    return true
  } catch (error) {
    // If the error is a network failure (like ERR_INTERNET_DISCONNECTED)
    // the request will fail completely without a status code.
    if (!error.response) {
      console.warn('Network error or server unreachable. User is functionally offline.')
      return false
    }
    // If the server answered with 401 or 403, the internet IS working, 
    // the user is just unauthenticated. Count this as ONLINE.
    return true
  }
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return

  // Exclude auth-related screens from loops
  const publicRoutes = ['/login', '/register']
  if (publicRoutes.includes(to.path)) return

  console.log('Verifying connection stability...')
  const isReallyOnline = await hasInternet()

  if (!isReallyOnline) {
    console.warn('🚨 Intercepted! Network is dead. Blocking auth API loop.')
    // STOP everything here. Do not hit the database.
    // Optional: return navigateTo('/offline') 
    return
  }

  // ----------------------------------------------------
  // Everything below only executes if internet is fully functional
  // ----------------------------------------------------
  try {
    console.log('Running global auth middleware')
    // Put your normal auth request or store check here
    // const data = await $fetch('http://localhost:4000/api/auth/protected')
  } catch (error) {
    console.error('Auth verification failed:', error)
    // return navigateTo('/login')
  }
})


