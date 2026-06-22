import Button from '@components/buttons/Button'
import Container from '@components/Container'
import UnstyledLink from '@components/links/UnstyledLink'
import { useTheme } from '@contexts/ThemeContext'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { getWhatsAppLinkFromTemplate } from '@utils/whatsapp'
import { useInView } from 'motion/react'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React, { useEffect, useRef } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const SellReserveTimePiece = () => {
    const { t } = useTranslation(['home'])
    const { setIsDarkSection } = useTheme()

    const wrapperRef = useRef<HTMLElement>(null)
    const timepieceSectionRef = useRef<HTMLElement>(null)
    const swiperDesktopRef = useRef<SwiperType>()
    const swiperMobileRef = useRef<SwiperType>()

    // Dark mode when TimePiece section center is in viewport center
    const isTimepieceInView = useInView(timepieceSectionRef, { margin: '-30% 0px -30% 0px' })

    useEffect(() => {
        if (isTimepieceInView) {
            setIsDarkSection(true)
        } else {
            setIsDarkSection(false)
        }
    }, [isTimepieceInView, setIsDarkSection])

    const timepieceItems = [
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
        }
    ]

    return (
        <section ref={wrapperRef} className='flex flex-col'>
            {/* SellReserve Section - Light Mode */}
            <section className='xl:py[160px] dark:bg-grey-black bg-grey-white relative z-10 flex flex-col gap-2 px-4 py-16  xl:flex-row  xl:px-5 '>
                <div
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
                    style={{
                        backgroundImage:
                            "linear-gradient(174.63deg, rgba(1, 1, 1, 0) 51.23%, #010101 96.85%), url('/images/home/reserve.webp')",
                        backgroundSize: '100% auto',
                        backgroundPositionY: 'top'
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

            {/* TimePieceService Section - Dark Mode */}
            <section ref={timepieceSectionRef} className='overflow-hidden pb-16 xl:pb-[160px]' id='service'>
                <Container className='relative flex flex-col items-center justify-between gap-14 xl:flex-row xl:gap-10'>
                    <div className='flex min-w-[243px] flex-col justify-between xl:gap-[275px]'>
                        <div className='flex flex-col gap-8'>
                            <h2 className='xl:text-heading-2-desktop text-heading-2-mobile dark:text-grey-white text-grey-black'>
                                <Trans i18nKey='timepiece.title' components={{ br: <br /> }}>
                                    {t('timepiece.title')}
                                </Trans>
                            </h2>
                            <div className='hidden xl:block'>
                                <a
                                    href={getWhatsAppLinkFromTemplate('timepieceService')}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    onClick={() => trackEvent(GA_EVENTS.CONTACT_WA)}
                                >
                                    <Button>{t('timepiece.book_now')}</Button>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* desktop */}
                    <div
                        className='relative z-[2] hidden w-full flex-1 xl:flex'
                        style={{
                            clipPath: `inset(0px -${timepieceItems.length * 100}% 0px 0px)`
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
                                {timepieceItems.map((service, index) => (
                                    <SwiperSlide key={`${service.id}-${index}`} className='service-slide !w-[302px]'>
                                        <div className='flex  flex-col gap-6'>
                                            <div className='relative h-[403px] w-[302px] overflow-hidden'>
                                                <Image
                                                    src={service.image || 'https://placehold.co/302x402/png?text=TWC'}
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
                    <div className='relative z-[2] w-full flex-1 xl:hidden'>
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
                                {timepieceItems.map((service, index) => (
                                    <SwiperSlide key={`${service.id}-${index}`} className='service-slide !w-[302px]'>
                                        <div className='flex  flex-col gap-6'>
                                            <div className='relative w-[302px]'>
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
                                                    {service.description}
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
        </section>
    )
}

export default SellReserveTimePiece
