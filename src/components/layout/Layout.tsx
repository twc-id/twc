import BaseDialog from '@components/dialog/BaseDialog'
import Footer from '@components/Footer'
import Header from '@components/Header/Header'
import { inter, overpass } from '@helpers/font'
import classNames from '@lib/classnames'
import useDialogStore from '@store/useDialogStore'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useRouter } from 'next/router'
import * as React from 'react'

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

interface LayoutProps extends React.PropsWithChildren<object> {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const smoothWrapperRef = React.useRef<HTMLDivElement>(null)
    const smoothContentRef = React.useRef<HTMLDivElement>(null)
    const smootherRef = React.useRef<ScrollSmoother | null>(null)
    const router = useRouter()

    //#region  //*=========== Store ===========
    const open = useDialogStore.useOpen()
    const state = useDialogStore.useState()
    const handleClose = useDialogStore.useHandleClose()
    const handleSubmit = useDialogStore.useHandleSubmit()
    //#endregion  //*======== Store ===========

    React.useEffect(() => {
        // Detect mobile viewport (max-width: 1279px)
        const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1279px)').matches

        const smoother = ScrollSmoother.create({
            wrapper: smoothWrapperRef.current,
            content: smoothContentRef.current,
            smooth: 2,
            effects: false,
            // Mobile: use smoothTouch and normalizeScroll to prevent pin flickering
            // Desktop: keep false to preserve ScrollTrigger pin functionality
            smoothTouch: isMobile ? 1 : false,
            normalizeScroll: false
        })

        // Store in ref AND make globally accessible via window for debugging
        smootherRef.current = smoother
        if (typeof window !== 'undefined') {
            ;(window as any).scrollSmootherInstance = smoother
        }

        // if URL contains a hash (e.g. /about-us#location), scroll after smoother is ready
        const scrollToHash = (hash?: string) => {
            const targetId = (hash || window.location.hash || '').replace('#', '')
            if (!targetId) return

            // Dispatch event to close mobile menu
            window.dispatchEvent(new CustomEvent('closeMobileMenu'))

            const tryScroll = () => {
                const el = document.getElementById(targetId)
                if (!el) return false

                // Try to get ScrollSmoother from ref first, then global, then .get()
                let smoother = smootherRef.current
                if (!smoother && typeof window !== 'undefined') {
                    smoother = (window as any).scrollSmootherInstance
                }
                if (!smoother && ScrollSmoother.get) {
                    smoother = ScrollSmoother.get() || null
                }

                if (smoother && typeof (smoother as any).scrollTo === 'function') {
                    try {
                        // Use ScrollSmoother's built-in scrollTo with element selector
                        // This is more reliable than manual offset calculation
                        ;(smoother as any).scrollTo(`#${targetId}`, true)
                        return true
                    } catch {
                        // Fallback to manual calculation
                        try {
                            // Calculate position by walking up the DOM tree
                            let offsetTop = 0
                            let currentEl: HTMLElement | null = el
                            while (currentEl && currentEl !== document.body) {
                                offsetTop += currentEl.offsetTop
                                currentEl = currentEl.offsetParent as HTMLElement
                            }
                            ;(smoother as any).scrollTo(offsetTop, true)
                            return true
                        } catch {
                            // fallback to native scroll
                        }
                    }
                }

                el.scrollIntoView({ behavior: 'smooth' })
                return true
            }

            // Get smoother instance
            let smoother = smootherRef.current
            if (!smoother && typeof window !== 'undefined') {
                smoother = (window as any).scrollSmootherInstance
            }
            if (!smoother && ScrollSmoother.get) {
                smoother = ScrollSmoother.get() || null
            }

            // Check current scroll position
            const currentScrollTop = smoother
                ? (smoother as any).scrollTop()
                : window.pageYOffset || document.documentElement.scrollTop
            const isAtTop = currentScrollTop < 50 // Consider "at top" if within 50px

            // Only scroll-to-top-first if user is at the top of the page
            // This ensures dark→light mode transition is visible when clicking from navbar
            // If user scrolled down (e.g., clicking from footer), go directly to target
            if (isAtTop) {
                // Scroll to top first (instant)
                if (smoother && typeof (smoother as any).scrollTo === 'function') {
                    try {
                        ;(smoother as any).scrollTo(0, false) // false = instant scroll
                    } catch {
                        window.scrollTo(0, 0)
                    }
                } else {
                    window.scrollTo(0, 0)
                }

                // Refresh ScrollTrigger after scrolling to top
                setTimeout(() => {
                    ScrollTrigger.refresh()
                }, 50)

                // Then scroll to target section (with animation)
                setTimeout(() => {
                    // retry a few times since content may render after navigation/animations
                    let attempts = 0
                    const maxAttempts = 20
                    const interval = setInterval(() => {
                        if (tryScroll() || ++attempts >= maxAttempts) {
                            clearInterval(interval)
                            // Refresh ScrollTrigger after reaching target
                            setTimeout(() => {
                                ScrollTrigger.refresh()
                                requestAnimationFrame(() => {
                                    ScrollTrigger.refresh()
                                })
                            }, 300)
                        }
                    }, 50)
                }, 300) // Wait 300ms after scroll to top before scrolling to section
            } else {
                // User is already scrolled down, go directly to target section
                // No need to scroll-to-top-first since they've already seen the transitions
                let attempts = 0
                const maxAttempts = 20
                const interval = setInterval(() => {
                    if (tryScroll() || ++attempts >= maxAttempts) {
                        clearInterval(interval)
                        // Refresh ScrollTrigger after reaching target
                        setTimeout(() => {
                            ScrollTrigger.refresh()
                            requestAnimationFrame(() => {
                                ScrollTrigger.refresh()
                            })
                        }, 300)
                    }
                }, 50)
            }
        }

        // initial check
        if (typeof window !== 'undefined' && window.location.hash) {
            setTimeout(() => scrollToHash(window.location.hash), 50)
        }

        // Intercept hash link clicks to prevent native scroll and use ScrollSmoother instead
        const handleHashChange = (event: HashChangeEvent) => {
            event.preventDefault()
            const hash = event.newURL?.split('#')[1] || window.location.hash?.replace('#', '')
            if (hash) {
                // Use ScrollSmoother to scroll instead of native scroll
                setTimeout(() => scrollToHash(`#${hash}`), 50)
            }
        }

        // Intercept click events on anchor links with hash
        const handleHashLinkClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const anchor = target.closest('a')

            // Handle hash links to the same page OR to the home page root (/#hash)
            // This ensures footer links like /#service work properly from any page
            const isRootHashLink = anchor && anchor.pathname === '/' && anchor.hash
            const isSamePageHashLink = anchor && anchor.hash && anchor.pathname === window.location.pathname

            if (isRootHashLink || isSamePageHashLink) {
                event.preventDefault()
                event.stopPropagation()

                // If it's a root hash link from a different page, navigate to home first
                if (isRootHashLink && window.location.pathname !== '/') {
                    const hash = anchor.hash
                    // Navigate to home page with hash - onRouteChangeComplete will handle the scroll
                    router.push(`/${hash}`, undefined, { scroll: false })
                    return
                }

                // Set the URL hash - this will trigger handleHashChange which calls scrollToHash
                const hash = anchor.hash
                if (window.location.hash !== hash) {
                    window.location.hash = hash
                } else {
                    // Hash already set, just scroll
                    scrollToHash(hash)
                }
            }
        }

        // Listen for hash changes (before browser scrolls)
        window.addEventListener('hashchange', handleHashChange)

        // Listen for clicks on hash links
        window.addEventListener('click', handleHashLinkClick, true) // Use capture phase

        // handle route changes
        const onRouteChangeComplete = (url: string) => {
            // Handle hash scrolling
            const hashIndex = url.indexOf('#')
            if (hashIndex !== -1) {
                const hash = url.substring(hashIndex)
                // Scroll to hash and then refresh ScrollTrigger after animation completes
                setTimeout(() => {
                    scrollToHash(hash)
                    // Refresh ScrollTrigger AFTER hash scroll to ensure positions are correct
                    setTimeout(() => {
                        ScrollTrigger.refresh()
                        // Force a second refresh to ensure all triggers are recalculated
                        requestAnimationFrame(() => {
                            ScrollTrigger.refresh()
                        })
                    }, 300)
                }, 100)
            } else {
                // Scroll to top for non-hash navigation
                let smoother = smootherRef.current
                if (!smoother && typeof window !== 'undefined') {
                    smoother = (window as any).scrollSmootherInstance
                }
                if (!smoother && ScrollSmoother.get) {
                    smoother = ScrollSmoother.get() || null
                }

                if (smoother && typeof (smoother as any).scrollTo === 'function') {
                    try {
                        ;(smoother as any).scrollTo(0, false) // instant scroll to top
                    } catch (e) {
                        window.scrollTo(0, 0)
                    }
                } else {
                    window.scrollTo(0, 0)
                }
                // Refresh ScrollTrigger after route change to recalculate positions
                setTimeout(() => {
                    ScrollTrigger.refresh()
                }, 50)
            }
        }

        router.events.on('routeChangeComplete', onRouteChangeComplete)

        return () => {
            router.events.off('routeChangeComplete', onRouteChangeComplete)
            window.removeEventListener('hashchange', handleHashChange)
            window.removeEventListener('click', handleHashLinkClick, true)
            // Properly kill ScrollSmoother instance
            smootherRef.current?.kill()
            if (typeof window !== 'undefined') {
                delete (window as any).scrollSmootherInstance
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ignorePath = ['/articles', '/articles/[slug]']

    const isIgnored = ignorePath.includes(router.pathname)

    return (
        <div className={`${inter.className} ${overpass.variable}`}>
            <Header />
            <div
                className={classNames('relative -mt-20 overflow-hidden', {
                    '!mt-0': isIgnored
                })}
            >
                <div ref={smoothWrapperRef} id='smooth-wrapper-home'>
                    <div ref={smoothContentRef} id='smooth-content-home'>
                        {children}
                        <Footer />
                    </div>
                </div>
            </div>
            <BaseDialog onClose={handleClose} onSubmit={handleSubmit} open={open} options={state} />
        </div>
    )
}

export default Layout
