/* eslint-disable no-console */
import Footer from '@components/Footer'
import Seo from '@components/Seo'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import React, { useEffect, useRef } from 'react'
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
    const createdByPage = useRef(false)

    useEffect(() => {
        if (isDesktop && typeof window !== 'undefined') {
            if (smootherRef.current) {
                smootherRef.current.kill()
            }
            const timer = setTimeout(() => {
                const globalS = (window as any).__scrollSmoother
                if (globalS) {
                    console.log('Home: Reusing existing window.__scrollSmoother')
                    smootherRef.current = globalS
                    createdByPage.current = false
                } else {
                    console.log('Home: Creating ScrollSmoother')
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
                        ;(window as any).__scrollSmoother.__owner = 'home'
                        console.log('Home: saved ScrollSmoother to window.__scrollSmoother')
                    } catch (e) {
                        //
                    }
                }
                ScrollTrigger.refresh()
            }, 100)

            return () => {
                clearTimeout(timer)
                if (smootherRef.current && createdByPage.current) {
                    console.log('Home: killing ScrollSmoother on cleanup')
                    try {
                        smootherRef.current.kill()
                    } catch (e) {
                        //
                    }
                    smootherRef.current = null
                    try {
                        const ws = (window as any).__scrollSmoother
                        if (ws && ws.__owner === 'home') delete (window as any).__scrollSmoother
                    } catch (e) {
                        //
                    }
                }
                smootherRef.current = null
                createdByPage.current = false
            }
        }

        return () => {
            if (smootherRef.current) {
                smootherRef.current.kill()
                smootherRef.current = null
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
