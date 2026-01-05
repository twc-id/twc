import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import { useAssets } from '@hooks/useAsset'
import classNames from '@lib/classnames'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { Trans } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Hero = () => {
    const h3RefFirst = useRef<HTMLHeadingElement>(null)
    const h3RefSecond = useRef<HTMLHeadingElement>(null)
    const h1Ref = useRef<HTMLHeadingElement>(null)
    const sectionRef = useRef<HTMLElement>(null)
    const timelineRef = useRef<any>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const swiperRef = useRef<SwiperType>()
    const videoRefs = useRef<Record<number | string, HTMLVideoElement | null>>({})
    const [isVisible, setIsVisible] = useState(true)
    const [videoLoaded, setVideoLoaded] = useState<Record<number, boolean>>({})
    const { assets } = useAssets()
    const heroSlides = assets?.filter((asset) => asset.media_type === 'video')

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                id: 'home-hero-animation',
                toggleActions: 'restart none none reset',
                onEnter: () => timeline.restart(),
                onEnterBack: () => timeline.restart()
            }
        })

        // Animasi fade untuk h3 dengan durasi lebih lama
        timeline.fromTo(
            [h3RefFirst.current, h3RefSecond.current],
            { opacity: 0 },
            { opacity: 1, duration: 1.5, ease: 'power2.out' }
        )

        // Animasi h1 muncul dari bawah setelah h3 selesai
        timeline.fromTo(h1Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })

        // store timeline so we can restart it on slide change
        timelineRef.current = timeline

        return () => {
            timeline.scrollTrigger?.kill()
            try {
                timeline.kill()
            } catch (e) {
                // ignore
            }
            timelineRef.current = null
        }
    }, [])

    // Restart the timeline animation when active slide changes so text animates per slide
    useEffect(() => {
        try {
            if (timelineRef.current) {
                // restart from beginning for the new slide
                timelineRef.current.restart()
            }
        } catch (e) {
            // swallow errors in non-browser or if timeline not ready
        }
    }, [activeIndex])

    // Observe hero visibility to pause videos when not visible
    useEffect(() => {
        if (typeof window === 'undefined' || !sectionRef.current) return
        const el = sectionRef.current
        const io = new IntersectionObserver(
            (entries) => {
                const e = entries[0]
                setIsVisible(Boolean(e.isIntersecting))
            },
            { threshold: 0.25 }
        )
        io.observe(el)
        return () => io.disconnect()
    }, [])

    // Play only the active slide video and pause others; also pause when hero not visible
    useEffect(() => {
        const vids = videoRefs.current
        Object.keys(vids).forEach((k) => {
            const idx = Number(k)
            const v = vids[k]
            if (!v) return
            try {
                if (idx === activeIndex && isVisible) {
                    v.muted = true
                    const p = v.play()
                    if (p && typeof p.then === 'function') p.catch(() => {})
                } else {
                    v.pause()
                    try {
                        v.currentTime = 0
                    } catch (e) {
                        // ignore
                    }
                }
            } catch (e) {
                // swallow
            }
        })
    }, [activeIndex, isVisible])

    return (
        <section ref={sectionRef} className='relative h-[848px] w-full xl:h-[960px]'>
            <div className='absolute inset-x-0 bottom-[121px] z-10'>
                <Container>
                    <div className='flex w-full flex-col items-start justify-between gap-14 xl:flex-row xl:items-end xl:gap-4'>
                        <div className='flex flex-col justify-end gap-2'>
                            <h3
                                ref={h3RefFirst}
                                className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-white uppercase'
                            >
                                {heroSlides &&
                                    heroSlides[activeIndex] &&
                                    heroSlides[activeIndex].video_banner?.sub_header}
                            </h3>
                            <h1
                                ref={h1Ref}
                                className='xl:text-heading-1-desktop text-heading-1-mobile text-grey-white line-clamp-3 w-[320px] xl:line-clamp-2 xl:w-[700px]'
                            >
                                <Trans i18nKey='hero.title' components={{ br: <br /> }}>
                                    {heroSlides &&
                                        heroSlides[activeIndex] &&
                                        heroSlides[activeIndex].video_banner?.title}
                                </Trans>
                            </h1>
                            <h3
                                ref={h3RefSecond}
                                className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-grey-200'
                            >
                                {heroSlides &&
                                    heroSlides[activeIndex] &&
                                    heroSlides[activeIndex].video_banner?.sub_footer}
                            </h3>
                        </div>
                        <div className='flex flex-shrink-0 flex-row justify-end gap-2'>
                            {heroSlides?.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => swiperRef.current?.slideToLoop(index)}
                                    className={classNames('bg-grey-500 relative h-[3px] w-8 overflow-hidden', {
                                        'w-16': activeIndex === index
                                    })}
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
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false
                }}
                slidesPerView={1}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                loop={true}
                allowTouchMove={false}
                className='h-full w-full [&_.swiper-slide]:!opacity-100'
            >
                {heroSlides?.map((slide, idx) => (
                    <SwiperSlide key={slide.id} className='absolute !translate-y-0'>
                        {/* fallback poster image until video is ready */}
                        <Image
                            src={idx % 2 === 0 ? '/images/home/hero-home.webp' : '/images/about-us/hero.webp'}
                            alt='hero poster'
                            className='absolute inset-0 h-full w-full object-cover'
                            fill
                        />

                        <video
                            ref={(el) => {
                                videoRefs.current[idx] = el
                            }}
                            className='absolute inset-0 h-full w-full object-cover'
                            muted
                            playsInline
                            preload='auto'
                            onCanPlay={() => setVideoLoaded((s) => ({ ...s, [idx]: true }))}
                            style={{
                                opacity: videoLoaded[idx] ? 1 : 0,
                                transition: 'opacity 400ms ease'
                            }}
                        >
                            {/* prefer webm when available, fallback to provided mp4 */}
                            <source src={slide.media.url.replace(/\.mp4$/i, '.webm')} type='video/webm' />
                            <source src={slide.media.url} type='video/mp4' />
                        </video>

                        {/* gradient overlay to keep text readable */}
                        <div
                            className='absolute inset-0'
                            style={{
                                background: 'linear-gradient(180deg, rgba(1,1,1,0) 31.05%, #010101 97.39%)'
                            }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

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
