declare global {
    interface Window {
        CookieConsent: {
            run(config: CookieConsentConfig): void
            shown(): boolean
            hide(): void
            show(): void
            accept(category?: string, mode?: string): void
            eraseCookies(cookieNames: string | RegExp[], domain?: string): void
            validConsent(): boolean
            acceptedCategory(categoryName: string): boolean
        }
    }
}

export type CookieValue = {
    categories: string[]
    services?: {
        [category: string]: string[]
    }
    level?: number[]
    revision?: number
    data?: unknown
    consentTimestamp?: string
    consentId?: string
}

export interface CookieConsentConfig {
    root?: string
    autoShow?: boolean
    theme?: 'block' | 'edgeless' | 'classic'
    cookie?: {
        name: string
        domain?: string
        path?: string
        sameSite?: 'Lax' | 'Strict' | 'None'
        expiresAfterDays?: number
    }
    disablePageInteraction?: boolean
    hideAfterClick?: boolean
    lazyHtmlGeneration?: boolean
    guiOptions?: {
        consentModal?: {
            layout: string
            position: string
            equalWeightButtons: boolean
            flipButtons: boolean
        }
        preferencesModal?: {
            layout: string
            position?: string
            equalWeightButtons: boolean
            flipButtons: boolean
        }
    }
    categories: {
        necessary: {
            enabled: boolean
            readOnly: boolean
        }
        analytics: {
            enabled?: boolean
            autoClear?: {
                cookies: Array<{
                    name: string | RegExp
                }>
            }
        }
    }
    language: {
        default: string
        autoDetect: string
        translations: {
            [lang: string]: {
                consentModal: {
                    title: string
                    description: string
                    acceptAllBtn: string
                    acceptNecessaryBtn: string
                    showPreferencesBtn: string
                    closeIconLabel: string
                    footer: string
                }
                preferencesModal: {
                    title: string
                    acceptAllBtn: string
                    acceptNecessaryBtn: string
                    savePreferencesBtn: string
                    closeIconLabel: string
                    serviceCounterLabel: string
                    sections: Array<{
                        title?: string
                        description?: string
                        linkedCategory?: string
                    }>
                }
            }
        }
    }
    onFirstConsent?: (data: { cookie: CookieValue }) => void
    onChange?: (data: { cookie: CookieValue; changedCategories?: string[]; changedServices?: string[] }) => void
}
