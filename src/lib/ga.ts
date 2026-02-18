// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

// Analytics instance (will be initialized after consent)
let analyticsInstance: any = null

// Initialize Analytics with GA4
export const initGA = async (): Promise<void> => {
    if (typeof window === 'undefined' || analyticsInstance) return

    // Dynamically import analytics libraries only after consent
    const [{ default: googleAnalytics }, { Analytics }] = await Promise.all([
        import('@analytics/google-analytics'),
        import('analytics')
    ])

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
export const initGAAfterConsent = async (): Promise<void> => {
    if (typeof window === 'undefined') return

    await initGA()

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

// Track custom event with dynamic parameters
export const trackEvent = (eventName: string, parameters?: Record<string, any>): void => {
    if (typeof window === 'undefined' || !analyticsInstance) return

    analyticsInstance.track(eventName, parameters)
}

// Check if GA is initialized
export const isGAInitialized = (): boolean => {
    return analyticsInstance !== null
}
