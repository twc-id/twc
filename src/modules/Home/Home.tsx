/* eslint-disable no-console */
import Footer from '@components/Footer'
import Seo from '@components/Seo'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import React, { useRef } from 'react'
import { useMediaQuery } from 'react-responsive'

import Commitment from './components/Commitment'
import CTA from './components/CTA'
import Hero from './components/Hero'
import Highlight from './components/Highlight'
import Journey from './components/Journey'
import Review from './components/Review'
import SellReserve from './components/SellReserve'
import SocialMedia from './components/SocialMedia'
import TimePieceService from './components/TimePieceService'

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

const Home = () => {
    const isDesktop = useMediaQuery({ minWidth: 1280 })
    const smoothWrapperRef = useRef<HTMLDivElement>(null)
    const smoothContentRef = useRef<HTMLDivElement>(null)
    const smootherRef = useRef<ScrollSmoother | null>(null)

    // Cleanup on page change and breakpoint changes
    React.useEffect(() => {
        // Cleanup when isDesktop changes (responsive breakpoint)
        if (!isDesktop && smootherRef.current) {
            smootherRef.current.kill()
            smootherRef.current = null
        }

        return () => {
            console.log('GSAP Home: Cleaning up ScrollSmoother and ScrollTriggers')
            if (smootherRef.current) {
                smootherRef.current.kill()
                smootherRef.current = null
            }
            // Clear all ScrollTriggers
            if (typeof window !== 'undefined') {
                ScrollTrigger?.getAll()?.forEach((trigger) => trigger.kill())
                ScrollTrigger?.refresh?.()
            }
            console.log('GSAP Home: Cleanup completed')
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
                console.log('GSAP Home: Creating ScrollSmoother')
                smootherRef.current = ScrollSmoother.create({
                    wrapper: smoothWrapperRef.current,
                    content: smoothContentRef.current,
                    smooth: 1.2,
                    effects: true,
                    smoothTouch: false,
                    normalizeScroll: false
                })
                // Refresh ScrollTrigger after ScrollSmoother is created
                ScrollTrigger.refresh()
                console.log('GSAP Home: ScrollSmoother created and ScrollTrigger refreshed')
            }, 100)

            return () => {
                clearTimeout(timer)
                if (smootherRef.current) {
                    smootherRef.current.kill()
                    smootherRef.current = null
                }
            }
        }
    }, [isDesktop])

    const content = (
        <>
            <Seo />
            <Hero />

            <Commitment />

            <Highlight />

            <SellReserve />

            <TimePieceService />

            <Journey />

            <Review />

            <SocialMedia />

            <CTA />
            <Footer />
        </>
    )

    if (isDesktop) {
        return (
            <div className='relative -mt-20 overflow-hidden'>
                <div ref={smoothWrapperRef} id='smooth-wrapper-home'>
                    <div ref={smoothContentRef} id='smooth-content-home'>
                        {content}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='relative -mt-20 overflow-hidden'>
            <Seo />
            <Hero />
            <Commitment />
            <Highlight />
            <SellReserve />
            <TimePieceService />
            <Journey />
            <Review />
            <SocialMedia />
            <CTA />
            <Footer />
        </div>
    )
}

export default Home
