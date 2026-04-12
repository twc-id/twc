import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import UnstyledLink from '@components/links/UnstyledLink'
import Skeleton from '@components/Skeleton'
import { useGSAP } from '@gsap/react'
import { WooCommerce } from '@lib/api'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { sanitizeHtml } from '@utils/html'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const ReserveTimepiece = () => {
    const { t } = useTranslation('reserve')
    const sectionRef = useRef<HTMLElement>(null)
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const getData = async () => {
        setIsLoading(true)
        try {
            const response = await WooCommerce.get(`products?tag=54&category=15&per_page=10`)

            setData(response.data)
        } catch (error) {
            // empty
        }

        setIsLoading(false)
    }

    useEffect(() => {
        getData()
    }, [])

    useGSAP(() => {
        if (!sectionRef.current) return

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            id: 'reserve-timepiece-trigger'
        })

        return () => {
            // Cleanup ScrollTrigger
            const trigger = ScrollTrigger.getById('reserve-timepiece-trigger')
            if (trigger) trigger.kill()
        }
    }, [])

    return (
        <section className='bg-grey-white relative z-10 pb-14 pt-20 xl:pb-[160px] xl:pt-[132px]' ref={sectionRef}>
            <Container className=''>
                <div className='flex flex-col items-center gap-16 xl:gap-20'>
                    <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black'>
                        {t('reserve_time_pieces.title')}
                    </h1>
                    <div className='relative w-full'>
                        {/* LOADING STATE */}
                        {isLoading && (
                            <div className='flex w-full items-center justify-center gap-5 xl:gap-8'>
                                <Skeleton className='h-[470px] w-[300px]' />
                                <Skeleton className='hidden h-[491px] w-[300px] xl:block' />
                                <Skeleton className='hidden h-[470px] w-[300px] xl:block' />
                            </div>
                        )}

                        {/* DATA READY */}
                        {!isLoading && data?.length > 0 && (
                            <Swiper
                                key={data.length}
                                modules={[Navigation]}
                                slidesPerView={3}
                                centeredSlides
                                loop
                                initialSlide={1}
                                navigation={{
                                    prevEl: '.swiper-button-prev-custom',
                                    nextEl: '.swiper-button-next-custom'
                                }}
                                breakpoints={{
                                    320: { slidesPerView: 1 },
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 }
                                }}
                                className='timepiece-swiper'
                            >
                                {data.map((product: any) => {
                                    const isWatch = product?.categories?.some(
                                        (category: any) => category.name === 'Watches'
                                    )
                                    return (
                                        <SwiperSlide key={product.id}>
                                            {({ isActive }) => (
                                                <UnstyledLink
                                                    href={`/collections/${product.slug}`}
                                                    onClick={() => {
                                                        if (isWatch) {
                                                            trackEvent(GA_EVENTS.INTEREST_WATCH_DETAILS)
                                                        } else {
                                                            trackEvent(GA_EVENTS.INTEREST_ACCESSORIES_DETAILS)
                                                        }
                                                    }}
                                                >
                                                    <div
                                                        className={`transition-all duration-300 ${
                                                            isActive ? 'scale-100' : 'scale-75 opacity-75'
                                                        }`}
                                                    >
                                                        <div className='flex flex-col items-center gap-2.5'>
                                                            <div className='relative h-[327px] w-[300px] overflow-hidden'>
                                                                <Image
                                                                    src={
                                                                        product.images?.[0]?.src ||
                                                                        'https://placehold.co/300x473/png?text=TWC'
                                                                    }
                                                                    alt={product.name}
                                                                    width={0}
                                                                    height={0}
                                                                    className='h-full w-full object-cover'
                                                                    unoptimized
                                                                />
                                                            </div>

                                                            {isActive && (
                                                                <div className='flex flex-col gap-1 pb-6 text-center'>
                                                                    <p
                                                                        className='text-sm uppercase tracking-wider text-gray-500'
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: sanitizeHtml(
                                                                                product.brands?.[0]?.name
                                                                            )
                                                                        }}
                                                                    />
                                                                    <h3 className='line-clamp-3 text-lg font-semibold text-gray-900'>
                                                                        {product.name}
                                                                    </h3>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </UnstyledLink>
                                            )}
                                        </SwiperSlide>
                                    )
                                })}
                            </Swiper>
                        )}

                        {/* Custom Navigation Buttons */}
                        <Button
                            variant='secondaryInverse'
                            className='swiper-button-prev-custom absolute left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 !p-0 xl:flex'
                        >
                            <Icons icon='ChevronLeft' />
                        </Button>

                        <Button
                            variant='secondaryInverse'
                            className='swiper-button-next-custom absolute right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 !p-0 xl:flex'
                        >
                            <Icons icon='ChevronLeft' className='rotate-180' />
                        </Button>

                        {/* Navigation Buttons for Mobile */}
                        <Button
                            variant='secondaryInverse'
                            className='swiper-button-prev-custom absolute -bottom-20 left-[36%] z-10 flex h-10 w-10 -translate-y-1/2 xl:hidden'
                        >
                            <Icons icon='ChevronLeft' />
                        </Button>

                        <Button
                            variant='secondaryInverse'
                            className='swiper-button-next-custom absolute -bottom-20 right-[36%] z-10 flex h-10 w-10 -translate-y-1/2 xl:hidden'
                        >
                            <Icons icon='ChevronLeft' className='rotate-180' />
                        </Button>
                    </div>
                </div>
                <div className='flex flex-row items-end justify-between pt-[147px]'>
                    <h3 className='xl:text-heading-3-desktop text-heading-3-mobile line-clamp-3 w-[250px] xl:line-clamp-2 xl:w-[432px]'>
                        {t('reserve_time_pieces.description')}
                    </h3>

                    <UnstyledLink
                        href='/collections'
                        onClick={() => {
                            trackEvent(GA_EVENTS.INTEREST_WATCHES)
                        }}
                    >
                        <Button variant='secondaryInverse'>{t('common:view_all')}</Button>
                    </UnstyledLink>
                </div>
            </Container>
        </section>
    )
}

export default ReserveTimepiece
