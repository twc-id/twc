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
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'
import { useMediaQuery } from 'react-responsive'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollSmoother)
}

const Sell = () => {
    const { t } = useTranslation('sell')
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
            <div ref={smoothWrapperRef} className='relative -mt-20 overflow-hidden'>
                <div ref={smoothContentRef}>{content}</div>
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
