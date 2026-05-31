// import { useAuthStore } from "~/stores/auth"

// export default defineNuxtRouteMiddleware(async (to) => {
//   const auth = useAuthStore()

//   // Ensure we have current status
//   if (!auth.userData) {
//     await auth.userAuthStatus()
//   }

//   // If the user IS logged in, get them out of here
//   if (auth.userData) {
//     // Only redirect if they aren't ALREADY at their destination
//     const target = getRoleBasedPath(auth.userData)

//     if (to.path !== target) {
//       return navigateTo(target, { replace: true })
//     }
//   }
// })
// middleware/guest-only.ts
// middleware/guest-only.js
// middleware/guest-only.js
import { useAuthStore } from "~/stores/auth"

// middleware/guest.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  /*
  // ✅ OFFLINE CHECK - ABSOLUTE FIRST LINE
  if (process.client && !navigator.onLine) {
    console.log('🔴 OFFLINE MODE - GUEST MIDDLEWARE BYPASSED')
    return
  }
  if (process.server) {
    console.log('🟡 Server-side - skipping guest middleware')
    return
  }

  // Rest of code only runs when online
  console.log('🚪 GUEST middleware running on:', to.fullPath)
  const token = useCookie('session_token').value
  const auth = useAuthStore()

  if (token && !auth.userData) {
    try {
      await auth.userAuthStatus()
    } catch (error) {
      console.error('Guest guard profile fetch failed:', error)
      return
    }
  }
  console.log('hi');

  if (auth.userData) {
    const target = getRoleBasedPath(auth.userData)
    const isAccessingGuestPage = ['/login', '/register'].includes(to.path)

    if (isAccessingGuestPage || to.path !== target) {
      return navigateTo({ path: target, query: {} }, { replace: true })
    }
  }
    */
  if (process.server) return
  // const isAccessingGuestPage = ['/login', '/register'].includes(to.path);
  // if (isAccessingGuestPage) return;

  const store = useAuthStore()
  console.warn('Running guest only middleware', `on ${to.fullPath}`);

  const authCheck = await store.userAuthStatus()
  if (authCheck) {
    const target = getRoleBasedPath(store.userData)


    if (to.path !== target) {
      return navigateTo({ path: target, query: {} }, { replace: true })
    }
  }


})



// ⚠️ IMPORTANT: Use replace and clear history
// return navigateTo(target, {
//   replace: true,
//   // Add this to break the bfcache
//   redirectCode: 302
// })