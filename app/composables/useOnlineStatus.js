// // composables/useOnlineStatus.js
// export const useOnlineStatus = () => {
//     const isOnline = ref(navigator.onLine);

//     const updateOnlineStatus = () => {
//         isOnline.value = navigator.onLine;
//     };

//     onMounted(() => {
//         window.addEventListener('online', updateOnlineStatus);
//         window.addEventListener('offline', updateOnlineStatus);
//     });

//     onUnmounted(() => {
//         window.removeEventListener('online', updateOnlineStatus);
//         window.removeEventListener('offline', updateOnlineStatus);
//     });

//     return { isOnline };
// };
// composables/useOnlineStatus.js
export const useOnlineStatus = () => {
    // Default to true on the server, then check on the client side
    const isOnline = ref(true);

    const updateOnlineStatus = () => {
        if (import.meta.client) {
            isOnline.value = navigator.onLine;
        }
    };

    onMounted(() => {
        // Initialize the actual browser status once mounted
        isOnline.value = navigator.onLine;

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
    });

    onUnmounted(() => {
        window.removeEventListener('online', updateOnlineStatus);
        window.removeEventListener('offline', updateOnlineStatus);
    });

    return { isOnline };
};
