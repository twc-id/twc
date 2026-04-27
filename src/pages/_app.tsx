/* eslint-disable no-console */
import CookieConsent from '@components/CookieConsent'
import Layout from '@components/layout/Layout'
import Toast from '@components/Toast'
import { ThemeProvider } from '@contexts/ThemeContext'
import { useGATracking } from '@lib/useGATracking'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { appWithTranslation } from 'next-i18next'
import nProgress from 'nprogress'
import { useState } from 'react'

import 'vanilla-cookieconsent/dist/cookieconsent.css'
// Updated imports to use alias format
import '@styles/globals.css'
import '@styles/nprogress.css'

// Route change handlers — skip NProgress for shallow transitions (e.g. filter URL sync)
Router.events.on('routeChangeStart', (_url, { shallow }) => {
    if (!shallow) nProgress.start()
})

Router.events.on('routeChangeError', (_url, { shallow }) => {
    if (!shallow) nProgress.done()
})

Router.events.on('routeChangeComplete', (_url, { shallow }) => {
    if (!shallow) nProgress.done()
})

type AppPropsWithLayout = AppProps & {
    Component: AppProps['Component'] & { noLayout?: boolean }
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
    const [queryClient] = useState(() => new QueryClient())

    // Initialize Google Analytics tracking
    useGATracking()

    if (Component.noLayout) {
        return (
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        )
    }

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <Head>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                </Head>
                <HydrationBoundary state={pageProps.dehydratedState}>
                    <Toast />
                    <CookieConsent />
                    <Layout>
                        {/* <CustomCursor /> */}
                        <Component {...pageProps} />
                    </Layout>
                </HydrationBoundary>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default appWithTranslation(MyApp)
