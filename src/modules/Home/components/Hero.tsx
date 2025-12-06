import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import classNames from '@lib/classnames'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Trans, useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const heroSlides = [
    {
        id: 1,
        image: '/images/home/hero-home.webp',
        subtitle: 'CURATED PIECES',
        title: 'The RM Collection',
        description: 'The premium luxury making time your own'
    },
    {
        id: 2,
        image: '/images/home/hero-home.webp',
        subtitle: 'EXCLUSIVE COLLECTION',
        title: 'Luxury Watches',
        description: 'Experience timeless elegance'
    },
    {
        id: 3,
        image: '/images/home/hero-home.webp',
        subtitle: 'PREMIUM SELECTION',
        title: 'Rare Timepieces',
        description: 'Discover exceptional craftsmanship'
    }
]

const Hero = () => {
    const { t } = useTranslation('home')
    const h3Ref = useRef<HTMLHeadingElement>(null)
    const h1Ref = useRef<HTMLHeadingElement>(null)
    const sectionRef = useRef<HTMLElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const swiperRef = useRef<SwiperType>()

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'restart none none reset',
                onEnter: () => timeline.restart(),
                onEnterBack: () => timeline.restart()
            }
        })

        // Animasi fade untuk h3 dengan durasi lebih lama
        timeline.fromTo(h3Ref.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' })

        // Animasi h1 muncul dari bawah setelah h3 selesai
        timeline.fromTo(h1Ref.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })

        return () => {
            timeline.scrollTrigger?.kill()
        }
    }, [])

    return (
        <section ref={sectionRef} className='relative h-[848px] w-full xl:h-[960px]'>
            <div className='absolute inset-x-0 bottom-[121px] z-10 pb-20'>
                <Container>
                    <div className='flex w-full flex-col items-start justify-between gap-14 xl:flex-row xl:items-end xl:gap-4'>
                        <div className='flex flex-col justify-end gap-2'>
                            <h3 ref={h3Ref} className='text-paragraph-7-desktop text-grey-white'>
                                {t('hero.sub_1')}
                            </h3>
                            <h1 ref={h1Ref} className='text-heading-1-desktop text-grey-white'>
                                <Trans i18nKey='hero.title' components={{ br: <br /> }}>
                                    {t('hero.title')}
                                </Trans>
                            </h1>
                            <h3 ref={h3Ref} className='text-paragraph-5-desktop text-grey-200'>
                                {t('hero.sub_2')}
                            </h3>
                        </div>
                        <div className='flex flex-shrink-0 flex-row justify-end gap-2'>
                            {heroSlides.map((_, index) => (
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
                    delay: 3000,
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
                {heroSlides.map((slide) => (
                    <SwiperSlide
                        key={slide.id}
                        style={{
                            backgroundImage: `linear-gradient(180deg, rgba(1, 1, 1, 0) 31.05%, #010101 97.39%), url('/images/home/hero-home.webp')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            transform: 'translate(0px, 0px) !important'
                        }}
                        className='absolute !translate-y-0'
                    />
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
                    animation: progress 3s linear;
                    width: 100%;
                }
            `}</style>
        </section>
    )
}

export default Hero
