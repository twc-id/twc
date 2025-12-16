import Footer from '@components/Footer'
import Seo from '@components/Seo'
import { useGSAP } from '@gsap/react'
import CTA from '@modules/Reserve/components/CTA'
import Hero from '@modules/Reserve/components/Hero'
import HowToReserve from '@modules/Reserve/components/HowToReserve'
import ImagePin from '@modules/Reserve/components/ImagePin'
import ReserveTimepiece from '@modules/Reserve/components/ReserveTimepiece'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'
import { useMediaQuery } from 'react-responsive'

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

const Reserve = () => {
    const { t } = useTranslation('reserve')
    const isDesktop = useMediaQuery({ minWidth: 1280 })
    const smoothWrapperRef = useRef<HTMLDivElement>(null)
    const smoothContentRef = useRef<HTMLDivElement>(null)
    const smootherRef = useRef<ScrollSmoother | null>(null)
    const createdByPage = useRef(false)

    // Cleanup on page change and breakpoint changes
    React.useEffect(() => {
        // Cleanup when isDesktop changes (responsive breakpoint)
        if (!isDesktop && smootherRef.current) {
            smootherRef.current.kill()
            smootherRef.current = null
        }

        return () => {
            if (smootherRef.current) {
                smootherRef.current.kill()
                smootherRef.current = null
            }
            // Clear all ScrollTriggers
            if (typeof window !== 'undefined') {
                ScrollTrigger?.getAll()?.forEach((trigger) => trigger.kill())
                ScrollTrigger?.refresh?.()
            }
        }
    }, [isDesktop])

    useGSAP(() => {
        if (isDesktop && typeof window !== 'undefined') {
            // Kill existing smoother if any
            if (smootherRef.current) {
                smootherRef.current.kill()
            }

            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                const globalS = (window as any).__scrollSmoother
                if (globalS) {
                    console.log('Reserve: Reusing existing window.__scrollSmoother')
                    smootherRef.current = globalS
                    createdByPage.current = false
                } else {
                    console.log('Reserve: Creating ScrollSmoother')
                    smootherRef.current = ScrollSmoother.create({
                        wrapper: smoothWrapperRef.current,
                        content: smoothContentRef.current,
                        smooth: 1.2,
                        effects: true,
                        smoothTouch: false,
                        normalizeScroll: false
                    })
                    createdByPage.current = true
                    try {
                        ;(window as any).__scrollSmoother = smootherRef.current
                        ;(window as any).__scrollSmoother.__owner = 'reserve'
                        console.log('Reserve: saved ScrollSmoother to window.__scrollSmoother')
                    } catch (e) {
                        console.warn('Reserve: cannot save smoother to window', e)
                    }
                }
                // Refresh ScrollTrigger after ScrollSmoother is created
                ScrollTrigger.refresh()
            }, 100)

            return () => {
                clearTimeout(timer)
                if (smootherRef.current && createdByPage.current) {
                    console.log('Reserve: killing ScrollSmoother on cleanup')
                    try {
                        smootherRef.current.kill()
                    } catch (e) {
                        //
                    }
                    smootherRef.current = null
                    try {
                        const ws = (window as any).__scrollSmoother
                        if (ws && ws.__owner === 'reserve') delete (window as any).__scrollSmoother
                    } catch (e) {
                        //
                    }
                }
                smootherRef.current = null
                createdByPage.current = false
            }
        }
    }, [isDesktop])

    const content = (
        <>
            <Seo title={t('title')} />
            <Hero />
            <ReserveTimepiece />
            <ImagePin />
            <HowToReserve />
            <CTA />
            <Footer />
        </>
    )

    if (isDesktop) {
        return (
            <div className='bg-grey-black relative -mt-20 overflow-hidden'>
                <div ref={smoothWrapperRef} id='smooth-wrapper-reserve'>
                    <div ref={smoothContentRef} id='smooth-content-reserve'>
                        {content}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='bg-grey-black relative -mt-20 overflow-hidden'>
            <Seo title={t('title')} />
            <Hero />
            <ReserveTimepiece />
            <ImagePin />
            <HowToReserve />
            <CTA />
            <Footer />
        </div>
    )
}

export default Reserve
