import Footer from '@components/Footer'
import Seo from '@components/Seo'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
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
    gsap.registerPlugin(ScrollSmoother)
}

const Home = () => {
    const isDesktop = useMediaQuery({ minWidth: 1280 })
    const smoothWrapperRef = useRef<HTMLDivElement>(null)
    const smoothContentRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (isDesktop && typeof window !== 'undefined') {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                const smoother = ScrollSmoother.create({
                    wrapper: smoothWrapperRef.current,
                    content: smoothContentRef.current,
                    smooth: 1.2,
                    effects: true, // Enable data-speed and data-lag attributes
                    smoothTouch: false, // Disable on touch devices
                    normalizeScroll: false // Keep false for desktop
                })

                return () => {
                    smoother?.kill()
                }
            }, 100)

            return () => {
                clearTimeout(timer)
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
