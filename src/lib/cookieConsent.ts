import type { CookieConsentConfig } from 'vanilla-cookieconsent'

import { denyConsent, grantConsent } from './ga'

// Detect language from URL path
const detectLanguage = (): string => {
    if (typeof window === 'undefined') return 'en'

    const path = window.location.pathname
    // Check if path starts with /id
    if (path.startsWith('/id')) {
        return 'id'
    }

    return 'en'
}

export const getCookieConsentConfig = (): CookieConsentConfig => ({
    root: 'body',
    autoShow: true,
    cookie: {
        name: 'cc_cookie',
        domain: typeof window !== 'undefined' ? window.location.hostname : '',
        path: '/',
        sameSite: 'Lax',
        expiresAfterDays: 3
    },
    disablePageInteraction: false,

    guiOptions: {
        consentModal: {
            layout: 'bar inline',
            position: 'bottom',
            equalWeightButtons: true,
            flipButtons: false
        },
        preferencesModal: {
            layout: 'box',
            position: 'right',
            equalWeightButtons: true,
            flipButtons: false
        }
    },
    categories: {
        necessary: {
            enabled: true,
            readOnly: true
        },
        analytics: {
            enabled: false,
            autoClear: {
                cookies: [
                    {
                        name: /^_ga/
                    },
                    {
                        name: '_gid'
                    }
                ]
            }
        }
    },
    language: {
        default: detectLanguage(),
        translations: {
            en: {
                consentModal: {
                    title: 'Hello there, we use cookies!',
                    description:
                        'We use cookies to provide you with the best possible experience on our website. You can learn more about the cookies we use and manage your preferences in the cookie settings.',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    showPreferencesBtn: 'Manage preferences',
                    footer: `
                        <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                        <a href="/terms-of-service" target="_blank">Terms of Service</a>
                    `
                },
                preferencesModal: {
                    title: 'Cookie Preferences',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    savePreferencesBtn: 'Save preferences',
                    closeIconLabel: 'Close',
                    serviceCounterLabel: 'Service',
                    sections: [
                        {
                            title: 'Your Privacy Choices',
                            description:
                                'We use cookies to improve your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.'
                        },
                        {
                            title: 'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
                            description:
                                'These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.',
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Analytics Cookies',
                            description:
                                'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.',
                            linkedCategory: 'analytics'
                        },
                        {
                            title: 'More Information',
                            description:
                                'For any queries regarding our cookie policy and your choices, please contact us.'
                        }
                    ]
                }
            },
            id: {
                consentModal: {
                    title: 'Halo, kami menggunakan cookie!',
                    description:
                        'Kami menggunakan cookie untuk memberikan pengalaman terbaik di situs web kami. Anda dapat mempelajari lebih lanjut tentang cookie yang kami gunakan dan mengelola preferensi Anda di pengaturan cookie.',
                    acceptAllBtn: 'Terima semua',
                    acceptNecessaryBtn: 'Tolak semua',
                    showPreferencesBtn: 'Kelola preferensi',
                    closeIconLabel: 'Tutup',
                    footer: `
                        <a href="/privacy-policy" target="_blank">Kebijakan Privasi</a>
                        <a href="/terms-of-service" target="_blank">Syarat & Ketentuan</a>
                    `
                },
                preferencesModal: {
                    title: 'Preferensi Cookie',
                    acceptAllBtn: 'Terima semua',
                    acceptNecessaryBtn: 'Tolak semua',
                    savePreferencesBtn: 'Simpan preferensi',
                    closeIconLabel: 'Tutup',
                    serviceCounterLabel: 'Layanan',
                    sections: [
                        {
                            title: 'Pilihan Privasi Anda',
                            description:
                                'Kami menggunakan cookie untuk meningkatkan pengalaman browsing Anda, menyajikan iklan atau konten yang dipersonalisasi, dan menganalisis traffic kami. Dengan mengklik "Terima semua", Anda menyetujui penggunaan cookie kami.'
                        },
                        {
                            title: 'Cookie yang Secara Ketat Diperlukan <span class="pm__badge">Selalu Aktif</span>',
                            description:
                                'Cookie ini diperlukan agar situs web dapat berfungsi dan tidak dapat dimatikan dalam sistem kami. Cookie biasanya hanya diatur sebagai respons terhadap tindakan yang Anda lakukan yang merupakan permintaan layanan.',
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Cookie Analitik',
                            description:
                                'Cookie ini memungkinkan kami untuk menghitung kunjungan dan sumber traffic sehingga kami dapat mengukur dan meningkatkan kinerja situs kami. Mereka membantu kami untuk mengetahui halaman mana yang paling dan paling sedikit populer dan melihat bagaimana pengunjung bergerak di situs.',
                            linkedCategory: 'analytics'
                        },
                        {
                            title: 'Informasi Lebih Lanjut',
                            description:
                                'Untuk pertanyaan apa pun mengenai kebijakan cookie kami dan pilihan Anda, silakan hubungi kami.'
                        }
                    ]
                }
            }
        }
    },
    onFirstConsent: ({ cookie }) => {
        if (cookie.categories.includes('analytics')) {
            grantConsent()
        } else {
            denyConsent()
        }
    },
    onChange: ({ cookie }) => {
        if (cookie.categories.includes('analytics')) {
            grantConsent()
        } else {
            denyConsent()
            // Clear GA cookies as extra safety
            if (typeof window !== 'undefined') {
                document.cookie.split(';').forEach((c) => {
                    const cookieName = c.split('=')[0].trim()
                    if (cookieName.match(/^_ga/) || cookieName === '_gid') {
                        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
                    }
                })
            }
        }
    }
})
