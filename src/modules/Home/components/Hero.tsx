import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
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
    }, [])

    return (
        <section ref={sectionRef} className='relative z-[50] h-[848px] pb-[121px] xl:h-[960px]'>
            <Swiper
                modules={[Autoplay, Pagination]}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                loop={true}
                className='h-full w-full'
            >
                {heroSlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className='h-full w-full'
                            style={{
                                backgroundImage: `linear-gradient(180deg, rgba(1, 1, 1, 0) 31.05%, #010101 97.39%), url('/images/home/hero-home.webp')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <Container className='flex h-full flex-col justify-end gap-2 overflow-hidden pb-20'>
                                <h3 ref={h3Ref} className='text-paragraph-7-desktop text-grey-white'>
                                    {slide.subtitle}
                                </h3>
                                <h1 ref={h1Ref} className='text-heading-1-desktop text-grey-white'>
                                    {slide.title.split(' ').slice(0, 2).join(' ')} <br />
                                    {slide.title.split(' ').slice(2).join(' ')}
                                </h1>
                                <h3 className='text-paragraph-5-desktop text-grey-200'>{slide.description}</h3>
                            </Container>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Pagination */}
            <div className='absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2'>
                {heroSlides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => swiperRef.current?.slideToLoop(index)}
                        className='bg-grey-500 relative h-1 w-12 overflow-hidden'
                    >
                        <div
                            className={` absolute left-0 top-0 h-full transition-all duration-300 ${
                                activeIndex === index ? 'w-full' : 'w-0'
                            }`}
                            style={{
                                animation: activeIndex === index ? 'progress 3s linear' : 'none'
                            }}
                        />
                    </button>
                ))}
            </div>

            <style jsx>{`
                @keyframes progress {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
            `}</style>
        </section>
    )
}

export default Hero
