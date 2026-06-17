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
        // console.log(`[API Request] ${options.baseURL}${path}`);
      }
    },
    onResponseError({ response }) {
      // Handle global errors here (e.g., 401 unauthorized)
    }
  });

  return customFetch(path, options);
};
