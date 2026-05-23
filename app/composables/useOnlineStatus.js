export const useOnlineStatus = () => {
    // Start with null (unknown) instead of true
    const isOnline = ref(null)
    const isChecking = ref(true)

    const checkConnection = async () => {
        if (!import.meta.client) return true

        try {
            // Try to fetch a small resource
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 3000)

            const response = await fetch('/favicon.ico', {
                method: 'HEAD',
                cache: 'no-cache',
                headers: { 'Pragma': 'no-cache' }
            })

            clearTimeout(timeoutId)
            return response.ok || response.status === 404
        } catch (error) {
            return false
        }
    }

    const updateOnlineStatus = async () => {
        if (import.meta.client) {
            isChecking.value = true
            const status = await checkConnection()
            isOnline.value = status
            isChecking.value = false
        }
    }

    // Force a manual check
    const forceCheck = async () => {
        await updateOnlineStatus()
        return isOnline.value
    }

    onMounted(() => {
        // Initial check
        updateOnlineStatus()

        // Listen to browser events
        window.addEventListener('online', () => {
            updateOnlineStatus()
        })

        window.addEventListener('offline', () => {
            isOnline.value = false
            isChecking.value = false
        })

        // Re-check when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                updateOnlineStatus()
            }
        })

        // Periodic check every 30 seconds
        const interval = setInterval(updateOnlineStatus, 30000)

        onUnmounted(() => {
            clearInterval(interval)
            window.removeEventListener('online', updateOnlineStatus)
            window.removeEventListener('offline', () => { })
            document.removeEventListener('visibilitychange', updateOnlineStatus)
        })
    })

    return {
        isOnline,      // null = unknown, true = online, false = offline
        isChecking,    // true = checking connection
        forceCheck,    // manual check function
        updateOnlineStatus
    }
}