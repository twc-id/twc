import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import UnstyledLink from '@components/links/UnstyledLink'
import { useTheme } from '@contexts/ThemeContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React, { useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const TimePieceService = () => {
    const { t } = useTranslation('home')
    const swiperDesktopRef = useRef<SwiperType>()
    const swiperMobileRef = useRef<SwiperType>()
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { isDarkSection, setIsDarkSection } = useTheme()

    const items = [
        {
            id: 1,
            image: '/images/home/service-cleaning.webp',
            label: t('timepiece.items.1.label'),
            description: t('timepiece.items.1.description')
        },
        {
            id: 2,
            image: '/images/home/service-polishing.webp',
            label: t('timepiece.items.2.label'),
            description: t('timepiece.items.2.description')
        },
        {
            id: 3,
            image: '/images/home/service-battery.webp',
            label: t('timepiece.items.3.label'),
            description: t('timepiece.items.3.description')
        },
        {
            id: 4,
            image: '/images/home/service-glass.webp',
            label: t('timepiece.items.4.label'),
            description: t('timepiece.items.4.description')
        }
    ]

    useGSAP(() => {
        // Track dark section state dengan ScrollTrigger
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
                end: 'bottom 20%',
                toggleActions: 'play none none reset',
                onEnter: () => timeline.restart(),
                onEnterBack: () => timeline.restart()
            }
        })

        timeline.fromTo(titleRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' })

        timeline.fromTo(
            buttonRef.current,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
            '-=0.7'
        )

        timeline.fromTo(
            '.service-slide',
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.15
            },
            '-=0.5'
        )
    }, [])

    return (
        <section ref={sectionRef} className='overflow-hidden pb-16 xl:pb-[160px]'>
            <Container className='relative flex flex-col justify-between gap-10 xl:flex-row'>
                <div className='flex min-w-[243px] flex-col justify-between xl:gap-[275px]'>
                    <div className='flex flex-col gap-8'>
                        <h2
                            className={`text-heading-2-desktop ${
                                isDarkSection ? 'text-grey-white' : 'text-grey-black'
                            }`}
                        >
                            <Trans i18nKey='timepiece.title' components={{ br: <br /> }}>
                                {t('timepiece.title')}
                            </Trans>
                        </h2>
                        <div className='hidden xl:block'>
                            <Button>{t('timepiece.book_now')}</Button>
                        </div>
                    </div>
                    <div className='hidden flex-row gap-4 xl:flex'>
                        <Button
                            className='h!-8 !w-8'
                            onClick={() => swiperDesktopRef.current?.slidePrev()}
                            variant={isDarkSection ? 'secondary' : 'primary'}
                        >
                            <Icons icon='ChevronLeft' width={20} height={20} />
                        </Button>
                        <Button
                            className='h!-8 !w-8'
                            onClick={() => swiperDesktopRef.current?.slideNext()}
                            variant={isDarkSection ? 'secondary' : 'primary'}
                        >
                            <Icons icon='ChevronRight' width={20} height={20} />
                        </Button>
                    </div>
                </div>
                {/* desktop */}
                <div
                    className='relative z-[2] hidden w-full flex-1 xl:flex'
                    style={{
                        clipPath: `inset(0px -${items.length * 100}% 0px 0px)`
                    }}
                >
                    <div className='relative isolate w-full overflow-visible'>
                        <Swiper
                            modules={[Navigation]}
                            spaceBetween={16}
                            slidesPerView={3}
                            onSwiper={(swiper) => {
                                swiperDesktopRef.current = swiper
                            }}
                            style={{
                                overflow: 'visible'
                            }}
                            className='!overflow-visible'
                        >
                            {items.map((service, index) => (
                                <SwiperSlide key={`${service.id}-${index}`} className='service-slide !w-[302px]'>
                                    <div className='flex  flex-col gap-6'>
                                        <div className='relative w-[302px]'>
                                            <Image src={service.image} alt={service.label} width={302} height={402} />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3
                                                className={`text-subheading-2-desktop ${
                                                    isDarkSection ? 'text-grey-white' : 'text-grey-black'
                                                }`}
                                            >
                                                {service.label}
                                            </h3>
                                            <p
                                                className={`text-paragraph-7-desktop ${
                                                    isDarkSection ? 'text-grey-200' : 'text-grey-500'
                                                }`}
                                            >
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                {/* mobile */}
                <div className='relative z-[2] w-full flex-1 xl:hidden'>
                    <div className='relative isolate w-full'>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={16}
                            slidesPerView={1.25}
                            onSwiper={(swiper) => {
                                swiperMobileRef.current = swiper
                            }}
                        >
                            {items.map((service, index) => (
                                <SwiperSlide key={`${service.id}-${index}`} className='service-slide !w-[302px]'>
                                    <div className='flex  flex-col gap-6'>
                                        <div className='relative w-[302px]'>
                                            <Image src={service.image} alt={service.label} width={302} height={402} />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3
                                                className={`text-subheading-2-desktop ${
                                                    isDarkSection ? 'text-grey-white' : 'text-grey-black'
                                                }`}
                                            >
                                                {service.label}
                                            </h3>
                                            <p
                                                className={`text-paragraph-7-desktop ${
                                                    isDarkSection ? 'text-grey-200' : 'text-grey-500'
                                                }`}
                                            >
                                                {service.description}
                                            </p>
                                            <UnstyledLink
                                                href='#'
                                                className='text-paragraph-7-desktop text-accent-price-dark font-semibold
                                                underline'
                                            >
                                                {t('timepiece.book_now')}
                                            </UnstyledLink>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default TimePieceService
