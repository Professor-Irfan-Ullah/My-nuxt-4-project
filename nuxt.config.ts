
export default defineNuxtConfig({
  devtools: { enabled: true },

  compatibilityDate: '2026-05-15',

  future: {
    compatibilityVersion: 4,
  },

  css: ['./app/assets/css/main.css'],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      backendUrl: 'http://localhost:4000'
    }
  },

  modules: [
    '@pinia/nuxt', 
    '@nuxt/icon', 
    'nuxt-lucide-icons', 
    '@nuxtjs/leaflet',
    // '@vite-pwa/nuxt'
  ],

//   pwa: {
//     // Start with minimal config - NO navigateFallback yet
//     registerType: 'autoUpdate',
//     injectRegister: 'auto',
    
//     manifest: {
//       name: 'Disaster Reporting and Management System',
//       short_name: 'DRMS',
//       description: 'File and Manage Disaster Reports Using DRMS',
//       theme_color: '#ffffff',
//       background_color: '#ffffff',
//       display: 'standalone',
//       start_url: '/',
//       icons: [
//         {
//           src: '/android-chrome-192x192.png',
//           sizes: '192x192',
//           type: 'image/png'
//         },
//         {
//           src: '/android-chrome-512x512.png',
//           sizes: '512x512',
//           type: 'image/png'
//         }
//       ]
//     },
// workbox: {
//   navigateFallback: null,
//   navigateFallbackDenylist: [/^\/api/, /^\/_nuxt/],
  
//   runtimeCaching: [
//     {
//       // Cache the add-report page (ONLY clean URLs, no login)
//       urlPattern: ({ url, request }) => {
//         const isReportPage = url.pathname === '/user/add-report'
//         const isNavigation = request.mode === 'navigate'
//         const isNotLogin = !url.pathname.includes('/login')
//         const hasNoRedirect = !url.searchParams.has('redirect')
        
//         return isReportPage && isNavigation && isNotLogin && hasNoRedirect
//       },
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'report-pages',
//         cacheableResponse: {
//           statuses: [200]
//         },
//         expiration: {
//           maxEntries: 1,
//           maxAgeSeconds: 30 * 24 * 60 * 60
//         }
//       }
//     },
//     {
//       // Cache dashboard (NO login)
//       urlPattern: ({ url, request }) => {
//         const isDashboard = url.pathname === '/dashboard'
//         const isNavigation = request.mode === 'navigate'
//         const isNotLogin = !url.pathname.includes('/login')
        
//         return isDashboard && isNavigation && isNotLogin
//       },
//       handler: 'StaleWhileRevalidate',
//       options: {
//         cacheName: 'dashboard-pages',
//         cacheableResponse: {
//           statuses: [200]
//         },
//         expiration: {
//           maxEntries: 1,
//           maxAgeSeconds: 7 * 24 * 60 * 60
//         }
//       }
//     },
//     {
//       // Cache other pages (EXPLICITLY EXCLUDE login)
//       urlPattern: ({ request, url }) => {
//         const isNavigation = request.mode === 'navigate'
//         // ❌ EXCLUDE any URL with /login in it
//         const isNotLogin = !url.pathname.includes('/login')
//         // ❌ EXCLUDE any URL with redirect param
//         const hasNoRedirect = !url.searchParams.has('redirect')
//         const isNotApi = !url.pathname.startsWith('/api')
//         const isNotNuxt = !url.pathname.startsWith('/_nuxt')
        
//         return isNavigation && isNotLogin && hasNoRedirect && isNotApi && isNotNuxt
//       },
//       handler: 'NetworkFirst',
//       options: {
//         cacheName: 'page-cache',
//         cacheableResponse: {
//           statuses: [200]  // Only cache successful responses (not redirects)
//         },
//         expiration: {
//           maxEntries: 20,
//           maxAgeSeconds: 7 * 24 * 60 * 60
//         }
//       }
//     }
//   ]
// }
//   },

  pinia: {
    storesDirs: ['./app/stores/**']
  }
})