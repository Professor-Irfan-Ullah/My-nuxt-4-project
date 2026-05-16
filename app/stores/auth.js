import { defineStore } from "pinia"

// app/stores/auth.ts
export const useAuthStore = defineStore('auth', () => {
    const userData = useState('user-data', () => null)

    const registerUser = async (name, father_name, email, cnic, contact, muhalla, village, tehsil, district, password) => {
        try {
            // In $fetch, the body goes inside the options object
            return await api('/api/auth/register', {
                method: 'POST',
                body: {
                    name,
                    father_name,
                    email: email || null,
                    cnic,
                    contact,
                    muhalla,
                    village,
                    tehsil,
                    district,
                    password,
                }
            })
        } catch (error) {
            throw error
        }
    }

    const verifyEmailRegistration = async (password, token) => {
        if (!password || !token) throw new Error('Password and Token are required');

        try {
            // response is the data itself
            return await api('/api/auth/verify', {
                method: 'POST',
                body: { password, token }
            })
        } catch (error) {
            throw error
        }
    }

    const login = async (email, password) => {
        try {
            const response = await api('/api/auth/login', {
                method: 'POST',
                body: { email, password }
            })
            // If your backend sets a cookie, $fetch handles it automatically 
            // if 'withCredentials' was set in your api util.
            userData.value = response.user

            return response
        } catch (error) {
            throw error
        }
    }

    // Inside useAuthStore
    const userAuthStatus = async () => {
        if (userData.value) return true;

        try {
            // useAsyncData shares state from Server -> Client payload
            const { data } = await useAsyncData('auth-check', () => api('/api/auth/protected'));

            userData.value = data.value;
            return !!userData.value;
        } catch (error) {
            userData.value = null;
            return false;
        }
    };






    const forgotPassword = async (email) => {
        return await api('/api/auth/forgot-password', {
            method: 'POST',
            body: { email }
        })
    }

    const reset_password = async (payload) => {
        return await api('/api/auth/reset-password', {
            method: 'POST',
            body: {
                token: payload.token,
                reset_password: payload.reset_password,
                email: payload.email
            }
        })
    }

    return {
        login,
        registerUser,
        userAuthStatus,
        userData,
        verifyEmailRegistration,
        forgotPassword,
        reset_password
    }
})
