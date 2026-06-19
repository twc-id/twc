import Container from '@components/Container'
import classNames from '@lib/classnames'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

const Hero = ({
    heroImage1,
    heroImage2,
    heroImage3,
    imagePin,
    showWatchTextSection
}: {
    heroImage1?: string
    heroImage2?: string
    heroImage3?: string
    imagePin?: string
    showWatchTextSection?: boolean
}) => {
    const { t } = useTranslation('reserve')
    const [activeIndex, setActiveIndex] = useState(0)
    const sectionRef = useRef<HTMLElement>(null)
    const scrollWrapperRef = useRef<HTMLDivElement>(null)
    const isMobile = useMediaQuery({ maxWidth: 1279 })

    const items = [
        {
            id: 1,
            image: heroImage1,
            label: t('hero.items.1.title')
        },
        {
            id: 2,
            image: heroImage2,
            label: t('hero.items.2.title')
        },
        {
            id: 3,
            image: heroImage3,
            label: t('hero.items.3.title')
        }
    ]

    // Track scroll progress within the tall wrapper
    const { scrollYProgress } = useScroll({
        target: scrollWrapperRef,
        offset: ['start start', 'end end']
    })

    useMotionValueEvent(scrollYProgress, 'change', (progress) => {
        const currentIndex = Math.min(Math.floor(progress * 3), 2)
        setActiveIndex(currentIndex)
    })

    // Reserve a constant amount of space for the navbar at the top of the pinned
    // section. Keeping this constant (instead of reacting to the navbar's show/hide)
    // avoids a height jump — and the resulting jerk — right as the pin engages.
    // Scoped to mobile (where the title lives inside the sticky).
    const [headerVisible, setHeaderVisible] = useState(true)
    useEffect(() => {
        if (typeof window === 'undefined') return
        const update = () => setHeaderVisible(document.body.dataset.headerVisible !== 'false')
        update()
        window.addEventListener('scroll', update, { passive: true })
        return () => window.removeEventListener('scroll', update)
    }, [])
    const pinOffset = isMobile ? 72 : 0

    return (
        <section ref={sectionRef} className='bg-grey-black pt-[64px] xl:pt-[240px]'>
            {/* Desktop-only title — sits above the pinned gallery (desktop layout unchanged) */}
            <Container className='xl:pb-[116px]'>
                <h1 className='text-grey-white xl:text-heading-2-desktop hidden xl:block xl:w-[585px]'>
                    {t('hero.title')}
                </h1>
            </Container>

            {/* Scroll-driven gallery wrapper — extra height creates scroll room.
                On mobile the pin starts at the title text: the title is the first child
                of the sticky container, so it pins at the top while the gallery changes. */}
            <div ref={scrollWrapperRef} className='h-[300vh] xl:h-[200vh]'>
                <div
                    className='sticky flex flex-col overflow-hidden'
                    style={{ top: pinOffset, height: `calc(100dvh - ${pinOffset}px)` }}
                >
                    {/* Mobile-only title — pins at the top of the gallery section */}
                    <Container
                        className={classNames('pb-14 transition-all duration-150 xl:hidden', {
                            'pt-14': headerVisible
                        })}
                    >
                        <h1 className='text-heading-2-mobile text-grey-white'>{t('hero.title')}</h1>
                    </Container>
                    {isMobile ? (
                        /* Mobile Layout - Vertical */
                        <div className='flex w-full flex-1 flex-col'>
                            {/* Main Image - Mobile */}
                            <div className='relative h-full w-full overflow-hidden'>
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`absolute inset-0 transition-opacity duration-500 ${
                                            activeIndex === index ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <Image
                                            src={item.image || ''}
                                            alt='Reserve Hero Image'
                                            width={400}
                                            height={400}
                                            className='h-full w-full object-cover'
                                            priority
                                            unoptimized
                                        />
                                    </div>
                                ))}
                                {/* Text overlay - Mobile */}
                                <div className='absolute bottom-4 left-4 flex flex-col gap-2.5'>
                                    <span className='text-subheading-3-mobile mb-2 block text-white/70'>
                                        {items[activeIndex]?.label}
                                    </span>
                                    <h2 className='text-heading-3-mobile text-white'>{t('hero.subtitle')}</h2>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Desktop Layout - Horizontal */
                        <div className='flex h-full w-full flex-row xl:gap-[152px]'>
                            <div className='relative overflow-hidden xl:h-[940px] xl:w-[749px]'>
                                {items.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className={`absolute inset-0 transition-opacity duration-500 ${
                                            activeIndex === index ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <Image
                                            src={item.image || ''}
                                            alt='Reserve Hero Image'
                                            width={749}
                                            height={940}
                                            className='h-full w-full object-cover'
                                            unoptimized
                                        />
                                    </div>
                                ))}
                                {/* Text overlay */}
                                <div className='absolute bottom-8 left-4 xl:bottom-[160px] xl:left-[80px]'>
                                    <h2 className='xl:text-heading-3-desktop text-heading-3-mobile max-w-[300px] text-white xl:max-w-[400px]'>
                                        {t('hero.subtitle')}
                                    </h2>
                                </div>
                            </div>
                            <div className='flex flex-col gap-6 overflow-hidden xl:h-[940px]'>
                                <div className='relative flex h-full items-center justify-center xl:w-[387px]'>
                                    {items.map((item, index) => {
                                        const offsetFromActive = index - activeIndex
                                        const yPosition = offsetFromActive * 400

                                        return (
                                            <div
                                                key={item.id}
                                                className='duration-600 absolute cursor-pointer transition-all ease-out xl:h-[387px] xl:w-[387px]'
                                                style={{
                                                    transform: `translateY(${yPosition}px) scale(${
                                                        index === activeIndex ? 1 : 0.95
                                                    })`,
                                                    opacity: index === activeIndex ? 1 : 0.4
                                                }}
                                                onClick={() => setActiveIndex(index)}
                                            >
                                                <Image
                                                    src={item.image || ''}
                                                    alt={item.label}
                                                    width={387}
                                                    height={387}
                                                    className='h-full w-full object-cover'
                                                    unoptimized
                                                />
                                                <div className='absolute bottom-4 left-4 overflow-hidden'>
                                                    <div
                                                        className={`transform transition-all duration-500 ease-out ${
                                                            activeIndex === index
                                                                ? 'translate-y-0 opacity-100'
                                                                : 'translate-y-full opacity-0'
                                                        }`}
                                                    >
                                                        <span className='text-grey-white xl:text-subheading-3-desktop text-subheading-3-mobile rounded px-3 py-1'>
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            {showWatchTextSection && (
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='flex flex-row justify-end pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'
                    >
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 line-clamp-2 text-left xl:w-[400px]'>
                            {t('hero.description')}
                        </p>
                    </motion.div>
                </Container>
            )}

            {/* Bottom pinned image */}
            <div
                className={classNames('relative z-0 -mb-[300px] xl:-mb-[560px]', {
                    'xl:mt-[160px]': !showWatchTextSection
                })}
            >
                <div className='sticky top-0 z-0 h-[300px] w-full xl:h-[560px]'>
                    <Image src={imagePin || ''} alt='The Watch Collections' fill className='object-cover' unoptimized />
                </div>
                {/* Spacer for sticky pin duration */}
                <div className='h-[300px] xl:h-[560px]' aria-hidden='true' />
            </div>
        </section>
    )
}

export default Hero
