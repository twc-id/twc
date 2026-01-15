import googleAnalytics from '@analytics/google-analytics'
import { Analytics } from 'analytics'

// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

// Analytics instance (will be initialized after consent)
let analyticsInstance: ReturnType<typeof Analytics> | null = null

// Initialize Analytics with GA4
export const initGA = (): void => {
    if (typeof window === 'undefined' || analyticsInstance) return

    analyticsInstance = Analytics({
        app: 'twc',
        plugins: [
            googleAnalytics({
                measurementIds: [GA_MEASUREMENT_ID]
            })
        ]
    })
}

// Initialize GA4 after consent
export const initGAAfterConsent = (): void => {
    if (typeof window === 'undefined') return

    initGA()

    if (analyticsInstance) {
        analyticsInstance.page()
    }
}

// Track page view
export const trackPageView = (url: string): void => {
    if (typeof window === 'undefined' || !analyticsInstance) return

    analyticsInstance.page({
        url
    })
}

// Track custom event
export const trackEvent = (action: string, category: string, label?: string, value?: number): void => {
    if (typeof window === 'undefined' || !analyticsInstance) return

    analyticsInstance.track(action, {
        category,
        label,
        value
    })
}

// Check if GA is initialized
export const isGAInitialized = (): boolean => {
    return analyticsInstance !== null
}
