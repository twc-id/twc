import BaseDialog from '@components/dialog/BaseDialog'
import Footer from '@components/Footer'
import Header from '@components/Header/Header'
import { inter, overpass } from '@helpers/font'
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
        smootherRef.current = ScrollSmoother.create({
            wrapper: smoothWrapperRef.current,
            content: smoothContentRef.current,
            smooth: 1.2,
            effects: false,
            smoothTouch: false,
            normalizeScroll: false
        })

        // if URL contains a hash (e.g. /about-us#location), scroll after smoother is ready
        const scrollToHash = (hash?: string) => {
            const targetId = (hash || window.location.hash || '').replace('#', '')
            if (!targetId) return

            const tryScroll = () => {
                const el = document.getElementById(targetId)
                if (!el) return false

                // prefer ScrollSmoother if available
                const smoother = smootherRef.current || (ScrollSmoother.get && ScrollSmoother.get())
                if (smoother && typeof (smoother as any).scrollTo === 'function') {
                    try {
                        ;(smoother as any).scrollTo(el)
                        return true
                    } catch {
                        // fallback to native scroll
                    }
                }

                el.scrollIntoView({ behavior: 'smooth' })
                return true
            }

            // retry a few times since content may render after navigation/animations
            let attempts = 0
            const maxAttempts = 20
            const interval = setInterval(() => {
                if (tryScroll() || ++attempts >= maxAttempts) {
                    clearInterval(interval)
                }
            }, 50)
        }

        // initial check
        if (typeof window !== 'undefined' && window.location.hash) {
            setTimeout(() => scrollToHash(window.location.hash), 50)
        }

        // handle future route changes that include a hash
        const onRouteChange = (url: string) => {
            const hashIndex = url.indexOf('#')
            if (hashIndex === -1) return
            const hash = url.substring(hashIndex)
            setTimeout(() => scrollToHash(hash), 50)
        }
        router.events.on('routeChangeComplete', onRouteChange)

        return () => {
            router.events.off('routeChangeComplete', onRouteChange)
            smootherRef.current?.kill && (smootherRef.current as any).kill()
        }
    })

    return (
        <div className={`${inter.className} ${overpass.variable}`}>
            <Header />
            <div className='relative -mt-20 overflow-hidden'>
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
