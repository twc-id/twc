import { initGAAfterConsent } from '@lib/ga'
import { useEffect } from 'react'

const CookieConsentComponent = () => {
    useEffect(() => {
        // Only run on client side
        if (typeof window === 'undefined') return

        // Dynamically import vanilla-cookieconsent only on client side
        Promise.all([import('vanilla-cookieconsent'), import('@lib/cookieConsent')])
            .then(([module, cookieConsentModule]) => {
                // Access the export (NOT default export)
                const CookieConsentLib = module

                if (!CookieConsentLib || !CookieConsentLib.run) {
                    return
                }

                // If consent already given in previous session, init GA without re-running banner
                if (CookieConsentLib.validConsent?.()) {
                    if (CookieConsentLib.acceptedCategory?.('analytics')) {
                        void initGAAfterConsent()
                    }
                    return
                }

                const config = cookieConsentModule.getCookieConsentConfig()

                // Run cookieconsent
                CookieConsentLib.run(config)
            })
            .catch(() => {
                // Silently fail
            })

        // Cleanup on unmount
        return () => {
            // CookieConsent doesn't have a destroy method
        }
    }, [])

    return null
}

export default CookieConsentComponent
