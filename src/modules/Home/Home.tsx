/* eslint-disable no-console */
import Footer from '@components/Footer'
import Seo from '@components/Seo'
import React from 'react'

import Commitment from './components/Commitment'
import CTA from './components/CTA'
import Hero from './components/Hero'
import Highlight from './components/Highlight'
import Journey from './components/Journey'
import Review from './components/Review'
import SellReserve from './components/SellReserve'
import SocialMedia from './components/SocialMedia'
import TimePieceService from './components/TimePieceService'

const Home = () => {
    // Cleanup on page change and breakpoint changes
    // React.useEffect(() => {
    //     // Cleanup when isDesktop changes (responsive breakpoint)
    //     if (!isDesktop && smootherRef.current) {
    //         smootherRef.current.kill()
    //         smootherRef.current = null
    //     }

    //     return () => {
    //         console.log('GSAP Home: Cleaning up ScrollSmoother and ScrollTriggers')
    //         if (smootherRef.current) {
    //             smootherRef.current.kill()
    //             smootherRef.current = null
    //         }
    //         // Clear all ScrollTriggers
    //         if (typeof window !== 'undefined') {
    //             ScrollTrigger?.getAll()?.forEach((trigger) => trigger.kill())
    //             ScrollTrigger?.refresh?.()
    //         }
    //         console.log('GSAP Home: Cleanup completed')
    //     }
    // }, [isDesktop])

    return (
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
}

export default Home
