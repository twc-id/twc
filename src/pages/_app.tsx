/* eslint-disable no-console */
import DismissableToast from '@components/DismissableToast'
import Layout from '@components/layout/Layout'
import { ThemeProvider } from '@contexts/ThemeContext'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
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
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

// Route change handlers
Router.events.on('routeChangeStart', () => {
    console.log('GSAP: Route change start - cleaning up')
    nProgress.start()
    gsap.killTweensOf('*')
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    gsap.globalTimeline.clear()
    // Try to kill any existing ScrollSmoother instances to avoid leftover smoothers
    try {
        const getAll = (ScrollSmoother as any).getAll
        if (typeof getAll === 'function') {
            ;(ScrollSmoother as any).getAll().forEach((s: any) => s.kill && s.kill())
            console.log('GSAP: Killed ScrollSmoother instances')
        } else if ((ScrollSmoother as any).instance) {
            const inst = (ScrollSmoother as any).instance
            inst.kill && inst.kill()
            console.log('GSAP: Killed ScrollSmoother.instance')
        }
    } catch (err) {
        console.warn('GSAP: Error while killing ScrollSmoother', err)
    }
    console.log('GSAP: Cleanup completed')
})

Router.events.on('routeChangeError', () => {
    console.log('GSAP: Route change error - refreshing ScrollTrigger')
    nProgress.done()
    setTimeout(() => {
        ScrollTrigger.update()
        ScrollTrigger.refresh()
        console.log('GSAP: ScrollTrigger refreshed after error')
    }, 500)
})

Router.events.on('routeChangeComplete', () => {
    console.log('GSAP: Route change complete - refreshing ScrollTrigger')
    nProgress.done()
    setTimeout(() => {
        ScrollTrigger.update()
        ScrollTrigger.refresh()
        console.log('GSAP: ScrollTrigger refreshed after complete')
    }, 500)
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
