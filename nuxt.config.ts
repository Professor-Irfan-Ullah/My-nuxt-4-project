// https://nuxt.com/docs/api/configuration/nuxt-config
// export default defineNuxtConfig({
//   devtools: { enabled: true },

//   css: ['./app/assets/css/main.css'],

//   postcss: {
//     plugins: {
//       tailwindcss: {},
//       autoprefixer: {},
//     },
//   },

//   runtimeConfig: {
//     public: {
//       backendUrl:'http://localhost:8000'

//     }
//   },

//   modules: ['@pinia/nuxt', '@nuxt/icon', 'nuxt-lucide-icons', '@nuxtjs/leaflet'
//   ],
//   pinia: {
//     storesDirs:['./app/stores/**']
//   },
//   vite:  {
//     server: {
//       allowedHosts: [
//         '.pinggy-free.link', // Allows any Pinggy tunnel URL
//         '.loca.lt'           // Optional: Allows Localtunnel if you switch back
//       ]
//     }
//   }
// })
// export default defineNuxtConfig({
//   devtools: { enabled: true },

//   css: ['./app/assets/css/main.css'],

//   postcss: {
//     plugins: {
//       tailwindcss: {},
//       autoprefixer: {},
//     },
//   },

//   runtimeConfig: {
//     public: {
//       backendUrl: 'http://localhost:8000'
//     }
//   },

//   modules: [
//     '@pinia/nuxt', 
//     '@nuxt/icon', 
//     'nuxt-lucide-icons', 
//     '@nuxtjs/leaflet',
//     '@vite-pwa/nuxt'
//   ],

//   pinia: {
//     storesDirs: ['./app/stores/**']
//   },

//   app: {
//     head: {
//       link: [
//         { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
//         { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
//         { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
//         { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
//       ]
//     }
//   },

//   // Added (any) casting to resolve the strict TypeScript property checking
//   ...{
//     pwa: {
//       registerType: 'autoUpdate',
//       manifest: {
//         name: 'My Dexie Nuxt App',
//         short_name: 'DexieNuxt',
//         theme_color: '#ffffff',
//         background_color: '#ffffff',
//         display: 'standalone',
//         icons: [
//           {
//             src: './public/android-chrome-192x192.png',
//             sizes: '192x192',
//             type: 'image/png'
//           },
//           {
//             src: './public/android-chrome-512x512.png',
//             sizes: '512x512',
//             type: 'image/png'
//           }
//         ]
//       },
//       workbox: {
//         globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}']
//       }
//     }
//   } as any,

//   vite: {
//     server: {
//       allowedHosts: [
//         '.pinggy-free.link', 
//         '.loca.lt'           
//       ]
//     }
//   }
// })
// export default defineNuxtConfig({
//   // Defines the custom app folder structure for Nuxt and Vite-PWA module
//   srcDir: 'app/',

//   devtools: { enabled: true },

//   // Paths are now relative to the 'app/' directory defined in srcDir
//   css: ['assets/css/main.css'],

//   postcss: {
//     plugins: {
//       tailwindcss: {},
//       autoprefixer: {},
//     },
//   },

//   runtimeConfig: {
//     public: {
//       backendUrl: 'http://localhost:8000'
//     }
//   },

//   modules: [
//     '@pinia/nuxt', 
//     '@nuxt/icon', 
//     'nuxt-lucide-icons', 
//     '@nuxtjs/leaflet',
//     '@vite-pwa/nuxt'
//   ],

//   pinia: {
//     storesDirs: ['stores/**']
//   },

//   app: {
//     head: {
//       link: [
//         { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
//         { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
//         { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
//         { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
//       ]
//     }
//   },

//   // Pre-renders the root route so Workbox can successfully cache it for offline use
//   nitro: {
//     prerender: {
//       routes: ['/'],
//       failOnError:false
//     }
//   },

//   // Native config block (removed old hacky casting spread operator)
//   pwa: {
//     registerType: 'autoUpdate',
//     manifest: {
//       name: 'My Dexie Nuxt App',
//       short_name: 'DexieNuxt',
//       theme_color: '#ffffff',
//       background_color: '#ffffff',
//       display: 'standalone',
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
//    workbox: {
//       globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
//       // Explicitly tell workbox to ignore the missing payload files
//       globIgnores: ['**/_payload.json'], 
//       navigateFallback: '/'
//     }
//   },

//   vite: {
//     server: {
//       allowedHosts: [
//         '.pinggy-free.link', 
//         '.loca.lt'           
//       ]
//     }
//   },
//   experimental: {
//     payloadExtraction:true
//   }
// })
// nuxt.com
// nuxt.com
// nuxt.com
// export default defineNuxtConfig({
//   // 1. FORCE CLIENT-SIDE RENDERING (Generates the index.html required by Workbox)
//   ssr: false,

//   devtools: { enabled: true },

//   css: ['./app/assets/css/main.css'],

//   postcss: {
//     plugins: {
//       tailwindcss: {},
//       autoprefixer: {},
//     },
//   },

//   runtimeConfig: {
//     public: {
//       backendUrl: 'http://localhost:8000'
//     }
//   },

//   modules: [
//     '@pinia/nuxt', 
//     '@nuxt/icon', 
//     'nuxt-lucide-icons', 
//     '@nuxtjs/leaflet',
//     '@vite-pwa/nuxt'
//   ],

//   pinia: {
//     storesDirs: ['./app/stores/**']
//   },

//   vite: {
//     server: {
//       allowedHosts: [
//         '.pinggy-free.link',
//         '.loca.lt'
//       ]
//     }
//   },

//   pwa: {
//     registerType: 'autoUpdate',
//     manifest: {
//       name: 'My Offline App',
//       short_name: 'OfflineApp',
//       theme_color: '#ffffff',
//       background_color: '#ffffff',
//       display: 'standalone',
//       icons: [
//         { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
//         { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
//         { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
//         { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
//       ]
//     },
//     workbox: {
//       // 2. Point directly to the generated app shell file
//       navigateFallback: '/index.html',
//       // 3. Match all JS, CSS, and structural image assets automatically
//       globPatterns: ['**/*.{js,css,html,png,svg,ico,json,woff,woff2}']
//     },
//     client: {
//       installPrompt: true
//     }
//   }
// })

export default defineNuxtConfig({
  devtools: { enabled: true },

    compatibilityDate: '2026-05-15',

  // Enable Nuxt 4 structure
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
      backendUrl:'http://localhost:8000'

    }
  },
  nitro:{
    prerender : {
      routes:['/']
    }
  },

  modules: ['@pinia/nuxt', '@nuxt/icon', 'nuxt-lucide-icons', '@nuxtjs/leaflet','@vite-pwa/nuxt'
  ],
  //  pwa: {
  //   registerType: 'autoUpdate',
  //   manifest: {
  //     name: 'My Nuxt 4 PWA',
  //     short_name: 'Nuxt4PWA',
  //     description: 'An amazing PWA built with Nuxt 4',
  //     theme_color: '#ffffff',
  //     background_color: '#ffffff',
  //     display: 'standalone',
  //     orientation: 'portrait',
  //     scope: '/',
  //     start_url: '/?utm_source=homescreen',
  //     icons:  [
  //       {
  //         // ⚠️ FIX: Removed "./public" prefix
  //         src: '/android-chrome-192x192.png', 
  //         sizes: '192x192',
  //         type: 'image/png',
  //         purpose: 'any maskable' // 💡 Added purpose to maximize PWA compatibility
  //       },
  //       {
  //         // ⚠️ FIX: Removed "./public" prefix
  //         src: '/android-chrome-512x512.png',
  //         sizes: '512x512',
  //         type: 'image/png',
  //         purpose: 'any'
  //       }
  //     ]
  //   },
  //   workbox: {
  //     navigateFallback: '/',
  //     // ⚠️ FIX 2: Restrict the fallback strictly to the root page.
  //     // This stops Workbox from trying to control or refresh /login.
  //     navigateFallbackAllowlist: [/^\/$/],
  //     globPatterns: ['**/*.{js,css,html,png,svg,ico}']
  //   },
  //   devOptions: {
  //     enabled: true,
  //     type: 'module'
  //   }
  // },

   pwa: {
    useCredentials:true,
    registerType: 'autoUpdate',
    manifest: {
      name: 'Disaster Reporting and Management System',
      short_name: 'DRMS',
      description: 'File and Manage Disaster Reports Using DRMS',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      scope:'/',
      icons:  [
        {
          // ⚠️ FIX: Removed "./public" prefix
          src: '/android-chrome-192x192.png', 
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable' // 💡 Added purpose to maximize PWA compatibility
        },
        {
          // ⚠️ FIX: Removed "./public" prefix
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      // ⚠️ FIX 2: Restrict the fallback strictly to the root page.
      // This stops Workbox from trying to control or refresh /login.
      // navigateFallbackAllowlist: [/^\/$/],
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      globIgnores: [
        'server/**',
        '**/node_modules/**',
        '**/*.map',
        '.nuxt/**',
        'dist/server/**'
      ],
      maximumFileSizeToCacheInBytes:4000000 
    },
    client:{
      registerPlugin:true
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },
  pinia: {
    storesDirs:['./app/stores/**']
  },
  vite:  {
    server: {
      allowedHosts: [
        '.pinggy-free.link', // Allows any Pinggy tunnel URL
        '.loca.lt',     // Optional: Allows Localtunnel if you switch back
        '.ngrok-free.app',
        'monodic-alix-dolorously.ngrok-free.dev'
      ]
    }
  },
})