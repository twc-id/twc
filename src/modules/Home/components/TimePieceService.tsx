import Button from '@components/buttons/Button'
import Container from '@components/Container'
import listLocation from '@constant/location'
import { useTheme } from '@contexts/ThemeContext'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { getWhatsAppLinkFromTemplate } from '@utils/whatsapp'
import { useInView } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Trans, useTranslation } from 'next-i18next'
import React, { useEffect, useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const TimePieceService = ({
    service1,
    service2,
    service3
}: {
    service1?: string
    service2?: string
    service3?: string
}) => {
    const { t } = useTranslation('home')
    const swiperDesktopRef = useRef<SwiperType>()
    const swiperMobileRef = useRef<SwiperType>()
    const sectionRef = useRef<HTMLElement>(null)

    const { setIsDarkSection } = useTheme()

    const isInView = useInView(sectionRef, { margin: '-50% 0px -50% 0px' })
    const router = useRouter()
    const locationMatch = listLocation.find((loc) => {
        if (loc.path.endsWith('/*')) {
            const basePath = loc.path.replace('/*', '')
            return router.pathname.startsWith(basePath)
        }
        return router.pathname === loc.path
    })

    // Set dark mode when section is in view
    useEffect(() => {
        if (isInView) setIsDarkSection(true)
    }, [isInView, setIsDarkSection])

    // Set dark mode on mount if URL has #service hash
    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash === '#service') {
            setIsDarkSection(true)
        }
    }, [setIsDarkSection])

    // Ensure mobile Swiper updates after mount to fix blank images
    useEffect(() => {
        if (swiperMobileRef.current) {
            const timeout = setTimeout(() => {
                swiperMobileRef.current?.update()
            }, 100)
            return () => clearTimeout(timeout)
        }
    }, [])

    const items = [
        {
            id: 1,
            image: service1,
            label: t('timepiece.items.1.label'),
            description: t('timepiece.items.1.description')
        },
        {
            id: 2,
            image: service2,
            label: t('timepiece.items.2.label'),
            description: t('timepiece.items.2.description')
        },
        {
            id: 3,
            image: service3,
            label: t('timepiece.items.3.label'),
            description: t('timepiece.items.3.description')
        }
    ]

    return (
        <section ref={sectionRef} className='relative z-10 overflow-x-hidden py-16 xl:py-[160px]' id='service'>
            <Container className='relative z-10 flex flex-col justify-between gap-14 xl:flex-row xl:items-center xl:gap-10'>
                <div className='flex min-w-[243px] flex-col justify-between xl:gap-[275px]'>
                    <div className='flex flex-col gap-8'>
                        <h2 className='xl:text-heading-2-desktop text-heading-2-mobile dark:text-grey-white text-grey-black'>
                            <Trans i18nKey='timepiece.title' components={{ br: <br /> }}>
                                {t('timepiece.title')}
                            </Trans>
                        </h2>
                        <div className='w-fit'>
                            <a
                                href={getWhatsAppLinkFromTemplate('timepieceService')}
                                target='_blank'
                                rel='noopener noreferrer'
                                onClick={() =>
                                    trackEvent(GA_EVENTS.CONTACT_WA, {
                                        'Button Location': 'Timepiece Service',
                                        'Button Page': locationMatch?.label
                                    })
                                }
                            >
                                <Button>{t('timepiece.book_now')}</Button>
                            </a>
                        </div>
                    </div>
                </div>
                {/* desktop */}
                <div
                    className='relative hidden w-full flex-1 xl:flex'
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
                            wrapperClass='justify-end'
                        >
                            {items.map((service, index) => (
                                <SwiperSlide key={`${service.id}-${index}`} className='service-slide !w-[302px]'>
                                    <div className='flex  flex-col gap-6'>
                                        <div className='relative h-[403px] w-[302px] overflow-hidden'>
                                            <Image
                                                src={service.image || ''}
                                                alt={service.label}
                                                width={302}
                                                height={402}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='xl:text-subheading-2-desktop text-subheading-2-mobile dark:text-grey-white text-grey-black'>
                                                {service.label}
                                            </h3>
                                            <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile dark:text-grey-200 text-grey-500'>
                                                <Trans i18nKey={`timepiece.items.${service.id}.description`}>
                                                    {service.description}
                                                </Trans>
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                {/* mobile */}
                <div className='relative w-full flex-1 xl:hidden'>
                    <div className='relative isolate w-full'>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={16}
                            slidesPerView='auto'
                            pagination={{ el: '.timepiece-pagination', clickable: true }}
                            onSwiper={(swiper) => {
                                swiperMobileRef.current = swiper
                            }}
                        >
                            {items.map((service, index) => (
                                <SwiperSlide key={`${service.id}-${index}`} className='service-slide !w-[302px]'>
                                    <div className='flex flex-col gap-6'>
                                        <div className='relative h-[403px] w-[302px] overflow-hidden'>
                                            <Image
                                                src={service.image || ''}
                                                alt={service.label}
                                                width={302}
                                                height={402}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            <h3 className='xl:text-subheading-2-desktop text-subheading-2-mobile dark:text-grey-white text-grey-black'>
                                                {service.label}
                                            </h3>
                                            <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile dark:text-grey-200 text-grey-500'>
                                                <Trans i18nKey={`timepiece.items.${service.id}.description`}>
                                                    {service.description}
                                                </Trans>
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div
                            className='timepiece-pagination mt-14 flex items-center justify-end
                        '
                        />
                        <style jsx global>{`
                            .timepiece-pagination .swiper-pagination-bullet {
                                width: 4px !important;
                                height: 4px !important;
                                background: #e5e7eb !important; /* gray-200 */
                                opacity: 1 !important;
                                margin: 0 6px !important;
                                border-radius: 9999px !important;
                            }

                            .timepiece-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active {
                                background: #ffffff !important; /* active: grey-white / white */
                                width: 6px !important;
                                height: 6px !important;
                            }
                        `}</style>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default TimePieceService
