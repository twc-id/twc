import Footer from '@components/Footer'
import Seo from '@components/Seo'
import CTA from '@modules/AboutUs/components/CTA'
import Hero from '@modules/AboutUs/components/Hero'
import Journey from '@modules/AboutUs/components/Journey'
import Location from '@modules/AboutUs/components/Location'
import Service from '@modules/AboutUs/components/Service'
import WhiteSpace from '@modules/AboutUs/components/WhiteSpace'
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

const About = () => {
    const { t } = useTranslation('about')
    const isDesktop = useMediaQuery({ minWidth: 1280 })
    const smoothWrapperRef = useRef<HTMLDivElement>(null)
    const smoothContentRef = useRef<HTMLDivElement>(null)
    // const smootherRef = useRef<ScrollSmoother | null>(null)

    // // Cleanup on page change and breakpoint changes
    // React.useEffect(() => {
    //     // Cleanup when isDesktop changes (responsive breakpoint)
    //     if (!isDesktop && smootherRef.current) {
    //         smootherRef.current.kill()
    //         smootherRef.current = null
    //     }

    //     return () => {
    //         if (smootherRef.current) {
    //             smootherRef.current.kill()
    //             smootherRef.current = null
    //         }
    //         // Clear all ScrollTriggers
    //         if (typeof window !== 'undefined') {
    //             ScrollTrigger?.getAll()?.forEach((trigger) => trigger.kill())
    //             ScrollTrigger?.refresh?.()
    //         }
    //     }
    // }, [isDesktop])

    // useGSAP(() => {
    //     if (isDesktop && typeof window !== 'undefined') {
    //         // Kill existing smoother if any
    //         if (smootherRef.current) {
    //             smootherRef.current.kill()
    //         }

    //         // Small delay to ensure DOM is ready
    //         const timer = setTimeout(() => {
    //             smootherRef.current = ScrollSmoother.create({
    //                 wrapper: smoothWrapperRef.current,
    //                 content: smoothContentRef.current,
    //                 smooth: 1.2,
    //                 effects: true,
    //                 smoothTouch: false,
    //                 normalizeScroll: false
    //             })
    //             // Refresh ScrollTrigger after ScrollSmoother is created
    //             ScrollTrigger.refresh()
    //         }, 100)

    //         return () => {
    //             clearTimeout(timer)
    //             if (smootherRef.current) {
    //                 smootherRef.current.kill()
    //                 smootherRef.current = null
    //             }
    //         }
    //     }
    // }, [isDesktop])

    const content = (
        <>
            <Seo title={t('title')} />
            <Hero />
            <WhiteSpace />
            <Journey />
            <Service />
            <Location />
            <CTA />
            <Footer />
        </>
    )

    if (isDesktop) {
        return (
            <div className='relative -mt-20 overflow-hidden'>
                <div ref={smoothWrapperRef} id='smooth-wrapper-about'>
                    <div ref={smoothContentRef} id='smooth-content-about'>
                        {content}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='relative -mt-20 overflow-hidden'>
            <Seo title={t('title')} />
            <Hero />
            <WhiteSpace />
            <Journey />
            <Service />
            <Location />
            <CTA />
            <Footer />
        </div>
    )
}

export default About
