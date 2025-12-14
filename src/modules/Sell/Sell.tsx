import Footer from '@components/Footer'
import Seo from '@components/Seo'
import { useGSAP } from '@gsap/react'
import Benefit from '@modules/Sell/components/Benefit'
import Consign from '@modules/Sell/components/Consign'
import CTA from '@modules/Sell/components/CTA'
import Faq from '@modules/Sell/components/Faq'
import Hero from '@modules/Sell/components/Hero'
import HowToSell from '@modules/Sell/components/HowToSell'
import WhiteSpace from '@modules/Sell/components/WhiteSpace'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'
import { useMediaQuery } from 'react-responsive'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

const Sell = () => {
    const { t } = useTranslation('sell')
    const isDesktop = useMediaQuery({ minWidth: 1280 })
    const smoothWrapperRef = useRef<HTMLDivElement>(null)
    const smoothContentRef = useRef<HTMLDivElement>(null)
    const smootherRef = useRef<ScrollSmoother | null>(null)

    // Cleanup on page change
    React.useEffect(() => {
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
    }, [])

    useGSAP(() => {
        if (isDesktop && typeof window !== 'undefined') {
            // Kill existing smoother if any
            if (smootherRef.current) {
                smootherRef.current.kill()
            }

            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                smootherRef.current = ScrollSmoother.create({
                    wrapper: smoothWrapperRef.current,
                    content: smoothContentRef.current,
                    smooth: 1.2,
                    effects: true,
                    smoothTouch: false,
                    normalizeScroll: false
                })
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
            <Seo title={t('title')} />
            <Hero />
            <WhiteSpace />
            <Benefit />
            <HowToSell />
            <Consign />
            <Faq />
            <CTA />
            <Footer />
        </>
    )

    if (isDesktop) {
        return (
            <div className='relative -mt-20 overflow-hidden'>
                <div ref={smoothWrapperRef} id='smooth-wrapper-sell'>
                    <div ref={smoothContentRef} id='smooth-content-sell'>
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
            <Benefit />
            <HowToSell />
            <Consign />
            <Faq />
            <CTA />
            <Footer />
        </div>
    )
}

export default Sell
