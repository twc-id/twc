import DismissableToast from '@components/DismissableToast'
import Layout from '@components/layout/Layout'
import { ThemeProvider } from '@contexts/ThemeContext'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
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
    gsap.registerPlugin(ScrollTrigger)
}

// Route change handlers
Router.events.on('routeChangeStart', () => {
    nProgress.start()
    gsap.killTweensOf('*')
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    gsap.globalTimeline.clear()
})

Router.events.on('routeChangeError', () => {
    nProgress.done()
    setTimeout(() => ScrollTrigger.refresh(), 100)
})

Router.events.on('routeChangeComplete', () => {
    nProgress.done()
    setTimeout(() => ScrollTrigger.refresh(), 100)
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
