// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'

declare global {
    interface Window {
        gtag: (...args: any[]) => void
        dataLayer: any[]
    }
}

// Track page view
export const trackPageView = (url: string): void => {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: url
    })
}

// Track custom event with dynamic parameters
export const trackEvent = (eventName: string, parameters?: Record<string, any>): void => {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('event', eventName, parameters)
}

// Grant analytics consent via Consent Mode v2
export const grantConsent = (): void => {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('consent', 'update', {
        analytics_storage: 'granted'
    })

    // Track initial page view after consent is granted
    trackPageView(window.location.pathname)
}

// Deny analytics consent via Consent Mode v2
export const denyConsent = (): void => {
    if (typeof window === 'undefined' || !window.gtag) return

    window.gtag('consent', 'update', {
        analytics_storage: 'denied'
    })
}
