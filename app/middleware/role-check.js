// middleware/role-check.ts
import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to) => {
    // ✅ Add offline check
    /*
    if (process.client && !navigator.onLine) {
        return
    }

    const auth = useAuthStore()
    const allowedRoles = to.meta.allowedRoles ?? [];
    console.log(auth.userData);


    if (!allowedRoles.includes(auth.userData?.role)) {
        console.log('hi');

        return navigateUserByRole(auth?.userData)
    }
        */
    // if (process.server) return
    // const allowedRoles = to.meta.allowedRoles ?? [];
    // if (!navigator.onLine) {
    //     console.log('Offline');
    //     return
    // }
    // const auth = useAuthStore()
    // if (!auth.userData) {
    //     try {

    //         const isAuth = await auth.userAuthStatus()
    //         console.warn(isAuth, 'from role-check middleware');
    //         if (!allowedRoles.includes(auth.userData?.role)) {
    //             return navigateUserByRole(auth?.userData)
    //         }
    //     }
    //     catch (e) {
    //         console.log('error in role check middleware');
    //     }
    // }
    const allowedRoles = to.meta.allowedRoles ?? [];

    console.log('role check middleware', to.fullPath);
    const auth = useAuthStore()
    if (!auth.userData) {
        try {

            const isAuth = await auth.userAuthStatus()
            console.warn(isAuth, 'from role-check middleware');
            if (!allowedRoles.includes(auth.userData?.role)) {
                return navigateUserByRole(auth?.userData)
            }
        }
        catch (e) {
            console.log('error in role check middleware');
        }
    }

})