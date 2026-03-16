import Button from '@components/buttons/Button'
import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { getWhatsAppLinkFromTemplate } from '@utils/whatsapp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface ConsignProps {
    images?: {
        step1?: string
        step2?: string
        step3?: string
        step4?: string
    }
}

const Consign = ({ images }: ConsignProps) => {
    const { t } = useTranslation('sell')
    const sectionRef = useRef<HTMLElement>(null)
    const topRef = useRef<HTMLDivElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const items = [
        {
            title: t('consign.steps.1.title'),
            description: t('consign.steps.1.description'),
            image: images?.step1 || '/images/sell/consign-1.webp'
        },
        {
            title: t('consign.steps.2.title'),
            description: t('consign.steps.2.description'),
            image: images?.step2 || '/images/sell/consign-2.webp'
        },
        {
            title: t('consign.steps.3.title'),
            description: t('consign.steps.3.description'),
            image: images?.step3 || '/images/sell/consign-3.webp'
        },
        {
            title: t('consign.steps.4.title'),
            description: t('consign.steps.4.description'),
            image: images?.step4 || '/images/sell/consign-4.webp'
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
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(topRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })

        timeline.fromTo(
            '.step-items-consign',
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
        <section className='bg-grey-black relative z-10' ref={sectionRef}>
            <Container className='pb-16 pt-14 xl:pb-40 xl:pt-[116ppx]'>
                <div className='flex flex-col items-center gap-14 xl:gap-20'>
                    <div
                        className='flex w-full flex-col items-start justify-between gap-5 xl:flex-row xl:items-center'
                        ref={topRef}
                    >
                        <h1 className='xl:text-heading-2-desktop text-heading-2-mobile dark:text-grey-white text-grey-black  xl:max-w-[574px]'>
                            {t('consign.title')}
                        </h1>
                        <a
                            href={getWhatsAppLinkFromTemplate('howToConsign')}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() => trackEvent(GA_EVENTS.CONTACT_WA)}
                        >
                            <Button className='h-full w-fit'>{t('common:book_appointment')}</Button>
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
                                className='step-items-consign flex min-w-[280px] snap-center flex-col items-start gap-4 xl:min-w-0 xl:snap-align-none xl:gap-6'
                            >
                                <div className='dark:border-grey-white border-grey-black dark:text-grey-white text-grey-black flex h-8 w-8 items-center justify-center rounded-full border py-1.5'>
                                    {index + 1}
                                </div>
                                <div className='h-[384px] w-[288px] xl:h-[402px] xl:w-[302px]'>
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        width={402}
                                        height={302}
                                        className='h-full w-full object-cover'
                                        unoptimized
                                    />
                                </div>
                                <div className='flex flex-col gap-1 xl:max-w-[302px]'>
                                    <h4 className='xl:text-subheading-4-desktop text-subheading-4-mobile text-grey-white '>
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
                                className={`mx-1 rounded-full transition-all duration-300 focus:outline-none ${
                                    index === activeIndex ? 'bg-grey-white h-1.5 w-1.5' : 'bg-grey-200 h-1 w-1'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Consign
