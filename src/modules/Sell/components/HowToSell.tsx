import Button from '@components/buttons/Button'
import Container from '@components/Container'
import { useTheme } from '@contexts/ThemeContext'
import { useGSAP } from '@gsap/react'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const HowToSell = () => {
    const { t } = useTranslation('sell')
    const sectionRef = useRef<HTMLElement>(null)
    const topRef = useRef<HTMLDivElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const { setIsDarkSection } = useTheme()

    const items = [
        {
            title: t('how_to_sell.steps.1.title'),
            description: t('how_to_sell.steps.1.description'),
            image: '/images/sell/step-1.webp'
        },
        {
            title: t('how_to_sell.steps.2.title'),
            description: t('how_to_sell.steps.2.description'),
            image: '/images/sell/step-2.webp'
        },
        {
            title: t('how_to_sell.steps.3.title'),
            description: t('how_to_sell.steps.3.description'),
            image: '/images/sell/step-3.webp'
        },
        {
            title: t('how_to_sell.steps.4.title'),
            description: t('how_to_sell.steps.4.description'),
            image: '/images/sell/step-4.webp'
        }
    ]

    const handleScroll = () => {
        if (!scrollContainerRef.current) return

        const container = scrollContainerRef.current
        const itemWidth = 288 + 24 // item width + gap
        const scrollLeft = container.scrollLeft
        const index = Math.round(scrollLeft / itemWidth)

        setActiveIndex(Math.min(index, items.length - 1))
    }

    const scrollToItem = (index: number) => {
        if (!scrollContainerRef.current) return

        const container = scrollContainerRef.current
        const itemWidth = 288 + 24 // item width + gap
        const scrollLeft = index * itemWidth

        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        })
    }

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom top',
            onEnter: () => setIsDarkSection(true),
            onLeaveBack: () => setIsDarkSection(false),

            onEnterBack: () => setIsDarkSection(true)
        })

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(topRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })

        timeline.fromTo(
            '.step-items',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.2 }
        )

        const pinTrigger = ScrollTrigger.create({
            trigger: imageContainerRef.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            pinSpacing: false,
            id: 'how-to-sell-pin',
            pinnedContainer: sectionRef.current
        })

        // Cleanup
        return () => {
            timeline.scrollTrigger?.kill()
            pinTrigger.kill()
        }
    }, [])

    return (
        <section className='relative' ref={sectionRef}>
            <Container className='pb-16 pt-14 xl:pb-40 xl:pt-[116ppx]'>
                <div className='flex flex-col items-center gap-14 xl:gap-20'>
                    <div
                        className='flex w-full flex-col items-center gap-4 text-center xl:max-w-[574px] xl:gap-8'
                        ref={topRef}
                    >
                        <h1 className='xl:text-heading-2-desktop text-heading-2-mobile dark:text-grey-white text-grey-black'>
                            {t('how_to_sell.title')}
                        </h1>
                        <a
                            href='
                        https://api.whatsapp.com/send/?phone=628121396688&text=Hello+TheWatchCollections%2C&type=phone_number&app_absent=0'
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() => trackEvent(GA_EVENTS.CONTACT_WA)}
                        >
                            <Button className='w-fit'>{t('common:book_appointment')}</Button>
                        </a>
                    </div>
                    <div
                        className='scrollbar-none flex w-full snap-x snap-mandatory flex-row justify-between gap-6 overflow-x-auto scroll-smooth xl:snap-none xl:overflow-x-visible'
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                    >
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className='step-items flex min-w-[280px] snap-center flex-col items-start gap-4 xl:min-w-0 xl:snap-align-none xl:gap-6'
                            >
                                <div className='dark:border-grey-white border-grey-black dark:text-grey-white text-grey-black flex h-8 w-8 items-center justify-center rounded-full border py-1.5'>
                                    {index + 1}
                                </div>
                                <div className='h-[384px] w-[288px] xl:h-[402px] xl:w-[302px]'>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={302}
                                        height={402}
                                        className='h-full w-full object-cover'
                                        unoptimized
                                    />
                                </div>
                                <div className='flex max-w-[280px] flex-col gap-1 xl:max-w-[302px]'>
                                    <h4 className='xl:text-subheading-4-desktop text-subheading-4-mobile dark:text-grey-white text-grey-black'>
                                        {item.title}
                                    </h4>
                                    <p className='xl:text-paragraph-6-desktop text-paragraph-6-mobile dark:text-grey-200 text-grey-500'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-row items-center gap-2 xl:hidden'>
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToItem(index)}
                                className={`mx-1 rounded-full transition-all duration-300 ${
                                    index === activeIndex ? 'bg-grey-white h-1.5 w-1.5' : 'bg-grey-200 h-1 w-1'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </Container>
            <div ref={imageContainerRef} className='relative z-0 h-[300px] xl:h-[560px]'>
                <Image
                    src='/images/sell/sell-pin.webp'
                    alt='The Watch Collections'
                    fill
                    className='object-cover'
                    unoptimized
                />
            </div>
        </section>
    )
}

export default HowToSell
