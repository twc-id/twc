import Button from '@components/buttons/Button'
import Container from '@components/Container'
import UnstyledLink from '@components/links/UnstyledLink'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React, { useEffect, useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Journey = () => {
    const { t } = useTranslation('home')
    const sectionRef = useRef<HTMLElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null) // Changed to div ref

    useGSAP(() => {
        // Tunggu sampai semua layout stabil
        const initScrollTrigger = () => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reset',
                    id: 'journey-timeline'
                }
            })
            // Animasi kanan fade in
            timeline.fromTo(
                rightRef.current,
                { opacity: 0, x: 60 },
                { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
            )

            // Pin image container untuk semua screen sizes (mobile & desktop)
            // Trigger harus actual DOM div, bukan Next.js Image component
            if (imageContainerRef.current && rightRef.current) {
                // Calculate pin end based on content height
                const contentHeight = rightRef.current?.offsetHeight || 0
                // Add some buffer space
                const pinDistance = Math.max(contentHeight, 300)

                ScrollTrigger.create({
                    trigger: imageContainerRef.current,
                    start: 'top top',
                    end: `+=${pinDistance}`,
                    pin: true,
                    pinSpacing: false,
                    id: 'journey-pin',
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    markers: false, // Set true for debugging
                    onUpdate: (self) => {
                        // Log untuk debugging jika perlu
                        if (process.env.NODE_ENV === 'development' && self.direction === 1) {
                            console.log('[Journey Pin] progress:', self.progress.toFixed(2))
                        }
                    }
                })
            }

            return timeline
        }

        // Delay initialization untuk memastikan layout component lain sudah stabil
        let timeline: gsap.core.Timeline | null = null
        const timer = setTimeout(() => {
            timeline = initScrollTrigger()
            // Single refresh after init
            ScrollTrigger.refresh()
        }, 200)

        // Cleanup
        return () => {
            clearTimeout(timer)
            ScrollTrigger.getById('journey-pin')?.kill()
            ScrollTrigger.getById('journey-timeline')?.kill()
            timeline?.kill()
        }
    }, [])

    // Effect untuk menangani resize dan refresh ScrollTrigger
    useEffect(() => {
        let refreshTimer: any = null

        const scheduleRefresh = (delay = 150) => {
            clearTimeout(refreshTimer)
            refreshTimer = setTimeout(() => {
                ScrollTrigger.refresh()
            }, delay)
        }

        const handleResize = () => {
            scheduleRefresh(200)
        }

        const handleLayoutChange = () => {
            scheduleRefresh(150)
        }

        window.addEventListener('resize', handleResize)
        window.addEventListener('layoutChange', handleLayoutChange)

        // Use ResizeObserver with debouncing
        let resizeObserver: ResizeObserver | null = null
        let mo: MutationObserver | null = null

        if (sectionRef.current?.parentElement) {
            try {
                resizeObserver = new ResizeObserver(() => {
                    scheduleRefresh(100)
                })
                resizeObserver.observe(sectionRef.current.parentElement)
            } catch (e) {
                // ResizeObserver may not be available in some environments; fall back to mutation observer below
            }

            // Fallback one-shot MutationObserver to catch class/style changes
            mo = new MutationObserver(() => {
                scheduleRefresh(50)
                if (mo) {
                    mo.disconnect()
                    mo = null
                }
            })
            mo.observe(sectionRef.current.parentElement, {
                attributes: true,
                attributeFilter: ['style', 'class']
            })
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('layoutChange', handleLayoutChange)
            if (resizeObserver) resizeObserver.disconnect()
            if (mo) mo.disconnect()
            clearTimeout(refreshTimer)
        }
    }, [])

    return (
        <section ref={sectionRef} className='overflow-x-hidden'>
            <Container className='pb-16 xl:pb-[116px]'>
                <div className='flex w-full flex-col gap-4 xl:flex-row xl:justify-between'>
                    <div className='flex flex-shrink-0 flex-col gap-4'>
                        <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white '>
                            <Trans i18nKey='cta.title' components={{ br: <br /> }}>
                                {t('journey.title')}
                            </Trans>
                        </h1>
                        <div className='hidden xl:block'>
                            <UnstyledLink href='/about-us'>
                                <Button>{t('journey.learn_our_story')}</Button>
                            </UnstyledLink>
                        </div>
                    </div>
                    <div className='flex  flex-col gap-6 xl:flex-row' ref={rightRef}>
                        <span className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile w-[400px]'>
                            <Trans i18nKey='journey.desc_1' components={{ br: <br /> }}>
                                {t('journey.desc_1')}
                            </Trans>
                        </span>
                        <span className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile w-[400px]'>
                            <Trans i18nKey='journey.desc_2' components={{ br: <br /> }}>
                                {t('journey.desc_2')}
                            </Trans>
                        </span>
                    </div>
                    <div className='block xl:hidden'>
                        <Button>{t('common:learn_more')}</Button>
                    </div>
                </div>
            </Container>
            <div ref={imageContainerRef} className='relative z-[11] h-[300px] w-full xl:h-[560px]'>
                <Image src='/images/home/journey-hero.webp' alt='journey' fill className='object-cover' unoptimized />
            </div>
        </section>
    )
}

export default Journey
