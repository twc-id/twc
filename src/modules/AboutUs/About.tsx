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
import { useEffect } from 'react'
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
    const smootherRef = useRef<ScrollSmoother | null>(null)
    const createdByPage = useRef(false)

    // Initialize ScrollSmoother on desktop and cleanup properly
    useEffect(() => {
        if (isDesktop && typeof window !== 'undefined') {
            if (smootherRef.current) {
                smootherRef.current.kill()
            }
            const timer = setTimeout(() => {
                const globalS = (window as any).__scrollSmoother
                if (globalS) {
                    console.log('About: Reusing existing window.__scrollSmoother')
                    smootherRef.current = globalS
                    createdByPage.current = false
                } else {
                    console.log('About: Creating ScrollSmoother')
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
                        ;(window as any).__scrollSmoother.__owner = 'about'
                    } catch (e) {
                        //
                    }
                }
                ScrollTrigger.refresh()
            }, 100)

            return () => {
                clearTimeout(timer)
                if (smootherRef.current && createdByPage.current) {
                    console.log('About: killing ScrollSmoother on cleanup')
                    try {
                        smootherRef.current.kill()
                    } catch (e) {
                        //
                    }
                    smootherRef.current = null
                    try {
                        const ws = (window as any).__scrollSmoother
                        if (ws && ws.__owner === 'about') delete (window as any).__scrollSmoother
                    } catch (e) {
                        //
                    }
                }
                smootherRef.current = null
                createdByPage.current = false
            }
        }
        // If not desktop ensure any existing smoother is removed
        return () => {
            if (smootherRef.current) {
                smootherRef.current.kill()
                smootherRef.current = null
            }
        }
    }, [isDesktop])

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
