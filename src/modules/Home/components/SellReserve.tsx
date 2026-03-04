import Button from '@components/buttons/Button'
import UnstyledLink from '@components/links/UnstyledLink'
import { useTheme } from '@contexts/ThemeContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { Trans, useTranslation } from 'next-i18next'
import React, { useEffect, useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const SellReserve = () => {
    const { t } = useTranslation(['home'])
    const { setIsDarkSection } = useTheme()

    const sectionRef = useRef<HTMLElement>(null)
    const sellRef = useRef<HTMLDivElement>(null)
    const reserveRef = useRef<HTMLDivElement>(null)

    // IntersectionObserver as fallback for hash navigation (ScrollTrigger doesn't fire on direct jumps)
    useEffect(() => {
        if (!sectionRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Don't override if navigating to #service (TimePieceService section)
                    if (typeof window !== 'undefined' && window.location.hash === '#service') {
                        return
                    }
                    // When section is at least 25% visible, set light mode
                    if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
                        setIsDarkSection(false)
                    }
                })
            },
            {
                threshold: [0, 0.25, 0.5, 0.75, 1],
                rootMargin: '-10% 0px -10% 0px' // Trigger when section is near center of viewport
            }
        )

        observer.observe(sectionRef.current)

        // Also check immediately in case we're already on the section (hash navigation)
        const rect = sectionRef.current.getBoundingClientRect()
        // Don't set light mode if navigating to #service
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0 && window.location.hash !== '#service') {
            setIsDarkSection(false)
        }

        return () => {
            observer.disconnect()
        }
    }, [setIsDarkSection])

    useGSAP(() => {
        // Ensure light mode when SellReserve section is in view
        const lightModeTrigger = ScrollTrigger.create({
            id: 'sell-reserve-light-mode',
            trigger: sectionRef.current,
            start: 'top 80%', // Trigger when section top reaches 80% of viewport
            end: 'bottom 30%', // Extended range to keep light mode active through most of section
            onEnter: () => {
                setIsDarkSection(false)
            },
            onEnterBack: () => {
                setIsDarkSection(false)
            },
            onLeave: () => {
                // When leaving SellReserve (scrolling down), TimePieceService will set dark mode
            }
        })

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none none',
                id: 'sell-reserve-animation'
            }
        })

        // Animasi kedua content fade in bersamaan
        // Start from opacity: 1 so elements are visible even if animation doesn't fire
        timeline.fromTo(
            [sellRef.current, reserveRef.current],
            { opacity: 0.5, y: 10 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        )

        return () => {
            lightModeTrigger?.kill()
            timeline.scrollTrigger?.kill()
            timeline.kill()
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className='dark:bg-grey-black bg-grey-white relative z-10 flex flex-col gap-2 px-4 pb-0 pt-16 xl:flex-row xl:px-5 xl:pt-[160px]'
        >
            <div
                ref={sellRef}
                style={{
                    backgroundImage:
                        "linear-gradient(174.63deg, rgba(1, 1, 1, 0) 51.23%, #010101 96.85%), url('/images/home/sell.webp')",
                    backgroundSize: '100% auto',
                    backgroundPositionY: 'top'
                }}
                className='relative z-10 flex h-[464px] w-full flex-col items-start justify-end gap-4 p-5 xl:h-[888px] xl:p-20'
            >
                <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white'>
                    <Trans i18nKey='home:sell_reserve.sell_title'>{t('sell_reserve.sell_title')}</Trans>
                </h1>
                <UnstyledLink href='/sell'>
                    <Button>{t('common:learn_more')}</Button>
                </UnstyledLink>
            </div>
            <div
                ref={reserveRef}
                style={{
                    backgroundImage:
                        "linear-gradient(174.63deg, rgba(1, 1, 1, 0) 51.23%, #010101 96.85%), url('/images/home/reserve.webp')",
                    backgroundSize: '100% auto',
                    backgroundPositionY: 'top'
                    // backgroundRepeat: 'no-repeat'
                }}
                className='relative z-10 flex h-[464px] w-full flex-col items-start justify-end gap-4 p-5 xl:h-[888px] xl:p-20'
            >
                <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white'>
                    {t('sell_reserve.reserve_title')}
                </h1>
                <UnstyledLink href='/reserve'>
                    <Button>{t('sell_reserve.cta_reserve')}</Button>
                </UnstyledLink>
            </div>
        </section>
    )
}

export default SellReserve
