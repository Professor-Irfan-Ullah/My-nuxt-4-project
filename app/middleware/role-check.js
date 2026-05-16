import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
    const auth = useAuthStore()
    const allowedRoles = to.meta.allowedRoles ?? [];

    if (!allowedRoles.includes(auth.userData?.role)) {
        return navigateUserByRole(auth?.userData)
    }
})