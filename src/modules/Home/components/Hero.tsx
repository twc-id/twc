import Container from '@components/Container'
import { useAssets } from '@hooks/useAsset'
import classNames from '@lib/classnames'
import { motion, useAnimate } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Trans } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const FALLBACK_IMAGES = ['/images/home/hero-home.webp', '/images/home/hero-2.webp']

const Hero = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const swiperRef = useRef<SwiperType>()
    const slideRefs = useRef<Record<number, HTMLDivElement | null>>({})
    const [isVisible, setIsVisible] = useState(true)
    const [videoReady, setVideoReady] = useState<Record<number, boolean>>({})
    const directionRef = useRef<'next' | 'prev'>('next')
    const prevActiveRef = useRef<number>(0)
    const { assets, isLoading } = useAssets()
    const router = useRouter()
    const lang = router.locale ?? router.defaultLocale ?? 'en'

    // Framer Motion animate for text
    const [textScope, animateText] = useAnimate()

    const heroSlides = assets
        ?.filter((asset) => asset.name.startsWith('banner_video_'))
        .sort((a, b) => {
            const getSuffixNumber = (name: string) => {
                const parts = name.split('_')
                const lastPart = parts[parts.length - 1]
                const num = parseInt(lastPart, 10)
                return isNaN(num) ? 0 : num
            }
            return getSuffixNumber(a.name) - getSuffixNumber(b.name)
        })

    // Text animation on slide change
    useEffect(() => {
        if (isLoading || !textScope.current) return
        animateText(textScope.current, { opacity: [0, 1], y: [30, 0] }, { duration: 0.8, ease: [0.33, 1, 0.68, 1] })
    }, [activeIndex, isLoading, animateText, textScope])

    // Observe hero visibility
    useEffect(() => {
        if (typeof window === 'undefined' || !sectionRef.current) return
        const io = new IntersectionObserver((entries) => setIsVisible(Boolean(entries[0].isIntersecting)), {
            threshold: 0.25
        })
        io.observe(sectionRef.current)
        return () => io.disconnect()
    }, [])

    // Initialize slide positions once slides load
    useEffect(() => {
        if (!heroSlides?.length) return
        heroSlides.forEach((slide, idx) => {
            const el = slideRefs.current[idx]
            if (!el) return
            el.style.transform = idx === 0 ? 'translateX(0%)' : 'translateX(100%)'
            el.style.opacity = '0'
            // Image slides are instantly ready
            if (slide.media_type === 'image') {
                setVideoReady((s) => ({ ...s, [idx]: true }))
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [heroSlides?.length])

    // Slide animation when activeIndex changes (CSS transitions)
    useEffect(() => {
        const prev = prevActiveRef.current
        const curr = activeIndex
        prevActiveRef.current = curr

        if (prev === curr) return

        const isNext = directionRef.current !== 'prev'
        const prevEl = slideRefs.current[prev]
        const currEl = slideRefs.current[curr]

        // Position incoming slide off-screen
        if (currEl) {
            currEl.style.transition = 'none'
            currEl.style.transform = isNext ? 'translateX(100%)' : 'translateX(-100%)'
            // Force reflow to apply instant position before transitioning
            currEl.offsetHeight // eslint-disable-line no-unused-expressions
            currEl.style.transition = 'transform 1.5s cubic-bezier(0.65, 0, 0.35, 1)'
            currEl.style.transform = 'translateX(0%)'
        }

        // Slide out outgoing slide
        if (prevEl) {
            prevEl.style.transition =
                'transform 1.5s cubic-bezier(0.65, 0, 0.35, 1), opacity 1.5s cubic-bezier(0.65, 0, 0.35, 1)'
            prevEl.style.transform = isNext ? 'translateX(-100%)' : 'translateX(100%)'
            prevEl.style.opacity = '0'
        }
    }, [activeIndex])

    // Fade in active slide when ready
    useEffect(() => {
        const el = slideRefs.current[activeIndex]
        if (!el) return
        if (videoReady[activeIndex]) {
            el.style.transition = 'opacity 0.4s ease-out'
            el.style.opacity = '1'
        } else {
            el.style.opacity = '0'
        }
    }, [videoReady, activeIndex])

    // Play active video, pause others.
    useEffect(() => {
        if (!heroSlides?.length) return
        let cancelled = false
        heroSlides.forEach((slide, idx) => {
            if (slide.media_type !== 'video') return
            const el = slideRefs.current[idx]
            const v = el?.querySelector('video')
            if (!v) return
            if (idx === activeIndex && isVisible) {
                v.play().catch((err) => {
                    if (!cancelled && err?.name !== 'AbortError') {
                        console.warn(`Video ${idx} play failed:`, err)
                    }
                })
            } else {
                v.pause()
                v.currentTime = 0
            }
        })
        return () => {
            cancelled = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, isVisible])

    return (
        <section ref={sectionRef} className='bg-grey-black relative h-screen w-full overflow-hidden'>
            <div className='absolute inset-x-0 bottom-10 z-10 xl:bottom-16'>
                <Container>
                    <div className='flex w-full flex-col items-start justify-between gap-14 xl:flex-row xl:items-end xl:gap-4'>
                        <motion.div ref={textScope} className='flex flex-col justify-end gap-2'>
                            <h3
                                className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-white uppercase'
                                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                            >
                                {heroSlides?.[activeIndex]?.video_banner?.[lang]?.sub_header}
                            </h3>
                            <h1
                                className='xl:text-heading-1-desktop text-heading-1-mobile text-grey-white w-full xl:w-[700px]'
                                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                            >
                                {heroSlides?.[activeIndex]?.video_banner?.[lang]?.title && (
                                    <Trans i18nKey='hero.title' components={{ br: <br /> }}>
                                        {heroSlides[activeIndex].video_banner?.[lang]?.title}
                                    </Trans>
                                )}
                            </h1>
                            <h3
                                className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-200'
                                style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                            >
                                {heroSlides?.[activeIndex]?.video_banner?.[lang]?.sub_footer}
                            </h3>
                        </motion.div>
                        <div className='flex flex-shrink-0 flex-row justify-end gap-2'>
                            {heroSlides?.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => swiperRef.current?.slideToLoop(index)}
                                    className={classNames(
                                        'bg-grey-500 relative h-[3px] w-8 overflow-hidden focus:outline-none',
                                        { 'w-16': activeIndex === index }
                                    )}
                                >
                                    <div
                                        key={`progress-${activeIndex}-${index}`}
                                        className={classNames('bg-grey-white absolute left-0 top-0 h-full', {
                                            'animate-progress': activeIndex === index,
                                            'w-0': activeIndex !== index
                                        })}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            {heroSlides?.map((slide, idx) => (
                <div
                    key={slide.id}
                    ref={(el) => {
                        slideRefs.current[idx] = el
                    }}
                    className='absolute inset-0 h-full w-full'
                    style={{ zIndex: idx === activeIndex ? 1 : 0 }}
                >
                    {slide.media_type === 'video' ? (
                        <video
                            src={slide.media.url}
                            className='h-full w-full object-cover'
                            muted
                            playsInline
                            preload='auto'
                            onCanPlay={() => setVideoReady((s) => ({ ...s, [idx]: true }))}
                            onPlaying={() => setVideoReady((s) => ({ ...s, [idx]: true }))}
                            onWaiting={() => setVideoReady((s) => ({ ...s, [idx]: false }))}
                            onError={() => setVideoReady((s) => ({ ...s, [idx]: false }))}
                        />
                    ) : (
                        <Image
                            src={slide.media.url}
                            alt={slide.media.alt || slide.name}
                            className='h-full w-full object-cover'
                            fill
                            priority={idx === 0}
                        />
                    )}
                </div>
            ))}

            {heroSlides && heroSlides.length > 0 ? (
                <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    speed={1}
                    slidesPerView={1}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper
                    }}
                    onSlideChange={(swiper) => {
                        directionRef.current = (swiper.swipeDirection as 'next' | 'prev') || 'next'
                        setActiveIndex(swiper.realIndex)
                    }}
                    loop={true}
                    allowTouchMove={false}
                    className='absolute inset-0'
                >
                    {heroSlides.map((slide, idx) => (
                        <SwiperSlide key={slide.id} className='absolute !translate-y-0'>
                            <Image
                                src={FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]}
                                alt='hero poster'
                                className='absolute inset-0 h-full w-full object-cover'
                                fill
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <Image
                    src={FALLBACK_IMAGES[0]}
                    alt='hero'
                    className='absolute inset-0 h-full w-full object-cover'
                    fill
                    priority
                />
            )}

            {/* Persistent gradient */}
            <div
                className='absolute inset-0 z-[1]'
                style={{ background: 'linear-gradient(180deg, rgba(1,1,1,0) 31.05%, #010101 97.39%)' }}
            />

            <style jsx>{`
                @keyframes progress {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
                .animate-progress {
                    animation: progress 5s linear;
                    width: 100%;
                }
            `}</style>
        </section>
    )
}

export default Hero
