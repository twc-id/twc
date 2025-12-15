import DismissableToast from '@components/DismissableToast'
import Layout from '@components/layout/Layout'
import { ThemeProvider } from '@contexts/ThemeContext'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { handleRouteChangeGSAP, initGSAP } from '@utils/gsap'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { appWithTranslation } from 'next-i18next'
import nProgress from 'nprogress'
import { useState } from 'react'

// Updated imports to use alias format
import '@styles/globals.css'
import '@styles/nprogress.css'

// Initialize GSAP on client-side
if (typeof window !== 'undefined') {
    initGSAP()
}

// Route change handlers
Router.events.on('routeChangeStart', () => {
    nProgress.start()
    handleRouteChangeGSAP.start()
})

Router.events.on('routeChangeError', () => {
    nProgress.done()
    handleRouteChangeGSAP.error()
})

Router.events.on('routeChangeComplete', () => {
    nProgress.done()
    handleRouteChangeGSAP.complete()
})

const MyApp = ({ Component, pageProps, ...rest }: AppProps) => {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <Head>
                    <meta name='viewport' content='width=device-width, initial-scale=1' />
                </Head>
                <HydrationBoundary state={pageProps.dehydratedState}>
                    <Layout currentPath={rest.router.asPath}>
                        {/* <CustomCursor /> */}
                        <DismissableToast />
                        <Component {...pageProps} />
                    </Layout>
                </HydrationBoundary>
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default appWithTranslation(MyApp)
