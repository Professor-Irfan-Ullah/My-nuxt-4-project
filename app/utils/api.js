// app/utils/api.js
// app/utils/api.js
// export const api = (path, options = {}) => {
//   const config = useRuntimeConfig();
//   console.log('Current Backend URL:', config.public.backendUrl);
//   const requestFetch = useRequestFetch();

//   // 1. Get current headers
//   const headers = useRequestHeaders(['cookie']);

//   // 2. Dynamically get the current site's full origin (auto-detects 3000 or 5173)
//   const currentUrl = useRequestURL();
//   const currentOrigin = currentUrl.origin;

//   return requestFetch(path, {
//     baseURL: config.public.backendUrl,
//     credentials: 'include',
//     headers: {
//       ...headers,
//       // origin: currentOrigin,
//       // DYNAMIC ORIGIN: Resolves to either 5173 or 3000 depending on where the app is running
//       ...options.headers,
//     },
//     ...options,
//   });
// };

// export const api = (path, options = {}) => {
//   const config = useRuntimeConfig();
//   const requestFetch = useRequestFetch();

//   // 1. Get the current request headers (including the host/origin)
//   const headers = useRequestHeaders(['cookie', 'host', 'referer']);

//   return requestFetch(path, {
//     baseURL: config.public.backendUrl,
//     credentials: 'include',
//     headers: {
//       ...headers,
//       // 2. Manually set Origin for the backend's CORS check during SSR
//       // Replace 'http://localhost:3000' with your actual frontend URL
//       'Origin': 'http://localhost:3000',
//       ...options.headers,
//     },
//     ...options,
//   });
// };

// export const api = (path, options = {}) => {
//   const config = useRuntimeConfig();

//   // useRequestFetch() automatically proxies headers/cookies from browser -> Nuxt -> Backend
//   const requestFetch = useRequestFetch();

//   return requestFetch(path, {
//     baseURL: config.public.backendUrl,
//     credentials: 'include',
//     ...options,
//   });
// };



// app/utils/api.ts
// export const api = async (path, options = {}) => {
//   const config = useRuntimeConfig()

//   // unique key based on path so Nuxt can track the data
//   const key = `api-${path}`

//   const { data, error } = await useAsyncData(key, () => $fetch(path, {
//     baseURL: config.public.backendUrl,
//     credentials: 'include',
//     ...options,
//   }))

//   if (error.value) throw error.value
//   return data.value
// }

// composables/useApi.js
export const useApi = (path, options = {}) => {
  const config = useRuntimeConfig();
  const requestFetch = useRequestFetch();
  const headers = useRequestHeaders(['cookie']);

  // Create a contextualized fetch instance
  const customFetch = $fetch.create({
    baseURL: config.public.backendUrl,
    credentials: 'include',
    headers: {
      ...headers,
    },
    // Nuxt 4 native lifecycle hooks
    onRequest({ request, options }) {
      if (import.meta.dev) {
        console.log(`[API Request] ${options.baseURL}${path}`);
      }
    },
    onResponseError({ response }) {
      // Handle global errors here (e.g., 401 unauthorized)
    }
  });

  return customFetch(path, options);
};
