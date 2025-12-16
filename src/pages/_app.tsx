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
import { useLayoutEffect, useState } from 'react'

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
    // Fallback: check for window.__scrollSmoother set by pages
    try {
        const ws = (window as any).__scrollSmoother
        if (ws && typeof ws.kill === 'function') {
            ws.kill()
            delete (window as any).__scrollSmoother
            console.log('GSAP: Killed window.__scrollSmoother')
        }
    } catch (e) {
        //
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

    // Create ScrollSmoother early for pages that include smooth-wrapper elements.
    useLayoutEffect(() => {
        if (typeof window === 'undefined') return

        const isDesktop = window.innerWidth >= 1280
        if (!isDesktop) return

        // detect wrapper element (id starts with 'smooth-wrapper')
        const wrapper = document.querySelector("[id^='smooth-wrapper']") as HTMLElement | null
        if (!wrapper) return

        // ensure any previous smoother is killed
        try {
            const existing = (window as any).__scrollSmoother
            if (existing && typeof existing.kill === 'function') {
                existing.kill()
                delete (window as any).__scrollSmoother
                console.log('GSAP: killed existing window.__scrollSmoother before creating new')
            }
        } catch (e) {
            //
        }

        try {
            const content = wrapper.querySelector("[id^='smooth-content']") as HTMLElement | null
            const smoother = (ScrollSmoother as any).create({
                wrapper: wrapper,
                content: content || wrapper.firstElementChild,
                smooth: 1.2,
                effects: true,
                smoothTouch: false,
                normalizeScroll: false
            })
            ;(window as any).__scrollSmoother = smoother
            ScrollTrigger.refresh()
            console.log('GSAP: created ScrollSmoother in _app')
        } catch (e) {
            console.warn('GSAP: failed to create ScrollSmoother in _app', e)
        }
    }, [rest.router.asPath])

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
