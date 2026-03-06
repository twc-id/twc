import { useEffect } from 'react'

declare global {
    interface Window {
        scrollSmootherInstance?: any
    }
}

/**
 * Hook to manage ScrollSmoother when modal opens/closes.
 * Pauses ScrollSmoother when modal is open to prevent scroll conflicts,
 * and resumes it when modal is closed.
 *
 * @param isOpen - Whether the modal is currently open
 */
export function useModalScroll(isOpen: boolean) {
    useEffect(() => {
        if (typeof window === 'undefined') return

        const smoother = window.scrollSmootherInstance
        if (!smoother) return

        if (isOpen) {
            // Pause ScrollSmoother when modal opens
            smoother.paused(true)
        } else {
            // Resume ScrollSmoother when modal closes
            smoother.paused(false)
        }
    }, [isOpen])
}
