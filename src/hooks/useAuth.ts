import { toast } from '@components/Toast'
import api from '@lib/api'
import { getAuth, resetAuth, setAuth } from '@utils/auth'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const useAuth = () => {
    const { isLoggedIn: authIsLoggedIn, token, hash } = getAuth()

    const isLoggedIn = authIsLoggedIn

    return {
        auth: {
            isLoggedIn: isLoggedIn,
            token: token ?? 'token',
            hash: hash ?? 'hash'
        }
    }
}

interface LoginPayload {
    email: string
    password: string
}

interface RegisterPayload {
    full_name: string
    phone_number: string
    email: string
    password: string
}

interface OtpPayload {
    otp: string
}

// export const useLogin = () => {
//     const { user } = useUser();
//     const router = useRouter();

//     const handleLogin = async () => {
//         router.push('/api/auth/login');
//     };

//     useEffect(() => {
//         const fetchToken = async () => {
//             if (user) {
//                 const response = await fetch('/api/protected');
//                 const data = await response.json();

//                 if (data.accessToken) {
//                     setAuth({ token: data.accessToken });
//                 }
//             }
//         };

//         fetchToken();
//     }, [user]);

//     return {
//         login: handleLogin,
//         isAuthenticated: !!user // Menggunakan !!user untuk memeriksa status login
//     };
// };
export const useLogin = () => {
    const router = useRouter()
    const redirect = router.query.redirect as string

    const handleLogin = async (payload: LoginPayload) => {
        try {
            const response = await api(`/auth/sign-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const res = await response.json()
            if (!res) throw new Error('Oops! Something went wrong. Please try again later')
            if (res.code === 200001001) throw new Error('Oops! Something went wrong. Password or email is incorrect')

            if (res?.token) {
                setAuth({ token: res.token })
                return res
            }

            return res
        } catch (err: any) {
            toast.error(err.message)
            return err
        }
    }

    useEffect(() => {
        if (redirect) {
            router.prefetch(redirect, redirect)
        }

        router.prefetch('/')
    }, [router, redirect])

    return {
        login: handleLogin
    }
}

export const useRegister = () => {
    const { auth } = useAuth()

    const handleRegister = async (payload: RegisterPayload) => {
        try {
            const response = await api(`/auth/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const res = await response.json()
            if (!res) throw new Error('Oops! Something went wrong. Please try again later')

            if (res.code === 200003000) throw new Error('Phone number already exists')

            if (res?.hash) {
                setAuth({ hash: res.hash })
                localStorage.setItem('email', res.email)
                return res
            }

            return res
        } catch (err: any) {
            toast.error(err.message)
            return err
        }
    }

    const handleSubmitOtp = async (payload: OtpPayload) => {
        try {
            const response = await api(`/auth/sign-up/verification/${auth.hash}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            const res = await response.json()
            if (!res) throw new Error('Oops! Something went wrong. Please try again later')

            return res
        } catch (err: any) {
            toast.error(err.message)
            return err
        }
    }

    const handleResendOtp = async () => {
        try {
            const response = await api(`/auth/sign-up/verification/${auth.hash}/resend`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const res = await response.json()
            if (!res) throw new Error('Oops! Something went wrong. Please try again later')
            if (res.hash) {
                setAuth({ hash: res.hash })
            }

            return res
        } catch (err: any) {
            toast.error(err.message)
            return err
        }
    }

    return {
        register: handleRegister,
        submitOtp: handleSubmitOtp,
        resendOtp: handleResendOtp
    }
}

export const useLogout = () => {
    const router = useRouter()

    const handleLogout = (force?: boolean) => {
        resetAuth()
        localStorage.removeItem('email')
        if (force) {
            router.push('/login')
        }
    }

    return {
        logout: handleLogout
    }
}

export const useForgotPassword = () => {
    const handleForgotPassword = async (email: string) => {
        try {
            const response = await api(`/auth/request-change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const res = await response.json()

            if (!res) throw new Error('Oops! Something went wrong. Please try again later')

            return res
        } catch (err: any) {
            toast.error(err.message)
            return err
        }
    }

    return {
        forgotPassword: handleForgotPassword
    }
}

export const useChangePassword = () => {
    const handleChangePassword = async (otp: string, password: string) => {
        try {
            const response = await api(`/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ new_password: password, otp: otp })
            })

            const res = await response.json()

            if (!res) throw new Error('Oops! Something went wrong. Please try again later')

            return res
        } catch (err: any) {
            toast.error(err.message)
            return err
        }
    }

    return {
        changePassword: handleChangePassword
    }
}

export default useAuth
