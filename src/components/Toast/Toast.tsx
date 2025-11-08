import React from 'react'
import { toast as toasts, Toaster, ToastOptions } from 'react-hot-toast'

const successClassName = '!bg-[#08AA54] xl:text-[16xp]'

const errorClassName = '!bg-[#C9353F] xl:text-[16xp]'

const infoClassName = '!bg-primary-300 xl:text-[16xp]'

const defaultOptions: ToastOptions = {
    duration: 3000,
    className: `${successClassName} xl:leading-6 text-sm !text-white !rounded-2xl`
}

const toast = {
    success: (message: string, options?: ToastOptions) =>
        toasts(message, {
            ...defaultOptions,
            ...options,
            className: `${successClassName} ${defaultOptions.className}`
        }),
    error: (message: string, options?: ToastOptions) =>
        toasts(message, {
            ...defaultOptions,
            ...options,
            className: `${errorClassName} ${defaultOptions.className} `
        }),
    info: (message: string, options?: ToastOptions) =>
        toasts(message, {
            ...defaultOptions,
            ...options,
            className: `${infoClassName} ${defaultOptions.className}`
        }),

    promise: (
        promise: Promise<any>,
        message: { loading: string; success: string; error: string },
        options?: ToastOptions
    ) => {
        toasts.promise(
            promise,
            {
                loading: message.loading,
                success: message.success,
                error: message.error
            },
            {
                ...defaultOptions,
                ...options,
                loading: {
                    className: `${successClassName} ${defaultOptions.className}`
                },
                error: {
                    className: `${errorClassName} ${defaultOptions.className}`
                },
                success: {
                    className: `${successClassName} ${defaultOptions.className}`
                }
            }
        )
    }
}

const Toast = () => <Toaster />

export { toast }
export default Toast
