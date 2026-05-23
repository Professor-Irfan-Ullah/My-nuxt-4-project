// // plugins/auto-cache.client.ts
// export default defineNuxtPlugin((nuxtApp) => {
//   if (!process.client) return

//   nuxtApp.hook('page:finish', async () => {
//     const route = useRoute()
//     const path = route.fullPath

//     if (path.includes('/login') || path.includes('/api')) return
//     if (route.query.redirect) return

//     // Don't try to fetch when offline - waste of time
//     if (!navigator.onLine) return

//     try {
//       const cache = await caches.open('page-cache')
//       const response = await fetch(path, {
//         headers: { 'Accept': 'text/html' }
//       })

//       if (response.ok) {
//         await cache.put(path, response.clone())
//         console.log(`✅ Cached: ${path}`)
//       }
//     } catch (error) {
//       // Only log in development
//       if (process.dev) {
//         console.warn(`Couldn't update cache for ${path}`)
//       }
//     }
//   })
// })

// plugins/auto-cache.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return

  nuxtApp.hook('page:finish', async () => {
    const route = useRoute()
    const path = route.fullPath

    if (path.includes('/login') || path.includes('/api')) return
    if (route.query.redirect) return
    if (!navigator.onLine) return

    try {
      // 🔑 Determine which cache to use based on the route
      let cacheName = 'page-cache' // default

      if (path === '/user/add-report') {
        cacheName = 'report-pages'
      } else if (path === '/dashboard') {
        cacheName = 'dashboard-pages'
      }

      const cache = await caches.open(cacheName)
      const response = await fetch(path, {
        headers: { 'Accept': 'text/html' }
      })

      if (response.ok) {
        await cache.put(path, response.clone())
        console.log(`✅ Cached in ${cacheName}: ${path}`)
      }
    } catch (error) {
      if (process.dev) {
        console.warn(`Couldn't update cache for ${path}`)
      }
    }
  })
})