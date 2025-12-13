import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import Skeleton from '@components/Skeleton'
import { useGSAP } from '@gsap/react'
import { WooCommerce } from '@lib/api'
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
            // const response = await WooCommerce.get('products?tag=33', {})
            const response = await WooCommerce.get('products')

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
            end: 'bottom top'
        })
    })

    return (
        <section className='bg-grey-white relative z-10 pb-14 pt-20 xl:pb-[160px] xl:pt-[132px]' ref={sectionRef}>
            <Container className=''>
                <div className='flex flex-col items-center xl:gap-20'>
                    <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black'>
                        {t('reserve_time_pieces.title')}
                    </h1>
                    <div className='relative w-full'>
                        <Swiper
                            modules={[Navigation]}
                            slidesPerView={3}
                            centeredSlides
                            initialSlide={1} // Set initial slide to center
                            loop
                            navigation={{
                                prevEl: '.swiper-button-prev-custom',
                                nextEl: '.swiper-button-next-custom'
                            }}
                            onSwiper={(swiper) => {
                                // Ensure initial slide is active
                                setTimeout(() => swiper.update(), 100)
                            }}
                            breakpoints={{
                                320: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                    initialSlide: 0,
                                    centeredSlides: true
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 24,
                                    initialSlide: 0,
                                    centeredSlides: true
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 32,
                                    initialSlide: 1,
                                    centeredSlides: true
                                }
                            }}
                            className='timepiece-swiper '
                        >
                            {isLoading ? (
                                <div className='flex flex-row items-center justify-center gap-20'>
                                    <Skeleton className=' h-[470px] w-[300px]' />
                                    <Skeleton className=' h-[491px] w-[300px]' />
                                    <Skeleton className=' h-[470px] w-[300px]' />
                                </div>
                            ) : (
                                data?.map((product: any) => (
                                    <SwiperSlide key={product.id}>
                                        {({ isActive }) => (
                                            <div
                                                className={`transition-all duration-300 ${
                                                    isActive ? 'scale-105' : 'scale-90 opacity-75'
                                                }`}
                                            >
                                                <div className='flex h-auto w-full flex-col items-center gap-2.5'>
                                                    {/* Product Image */}
                                                    <div className='relative flex h-[491px] w-[300px] items-center justify-center overflow-hidden bg-black'>
                                                        <Image
                                                            src={
                                                                product.images?.[0]?.src ||
                                                                '/images/placeholder-image.png'
                                                            }
                                                            alt={product.name}
                                                            width={300}
                                                            height={491}
                                                            unoptimized
                                                        />
                                                        {/* {product.images && product.images[0] ? (
                                                            <Image
                                                                src={product.images[0].src}
                                                                alt={product.name}
                                                                width={300}
                                                                height={491}
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <div className='flex h-auto w-full items-center justify-center  text-gray-400'>
                                                                No Image
                                                            </div>
                                                        )} */}
                                                    </div>

                                                    {/* Product Details */}
                                                    {isActive && (
                                                        <div className='text-center'>
                                                            <p className='mb-2 text-sm uppercase tracking-wider text-gray-500'>
                                                                {product.brands?.[0]?.name}
                                                            </p>

                                                            <h3 className='line-clamp-2 text-lg font-semibold text-gray-900'>
                                                                {product.name}
                                                            </h3>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </SwiperSlide>
                                ))
                            )}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <Button
                            variant='secondaryInverse'
                            className='swiper-button-prev-custom absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2'
                        >
                            <Icons icon='ChevronLeft' />
                        </Button>

                        <Button
                            variant='secondaryInverse'
                            className='swiper-button-next-custom absolute right-4 top-1/2  z-10 flex h-10 w-10 -translate-y-1/2'
                        >
                            <Icons icon='ChevronLeft' className='rotate-180' />
                        </Button>
                    </div>
                </div>
                <div className='flex flex-row items-end justify-between xl:pt-[147px]'>
                    <h3 className='xl:text-heading-3-desktop text-heading-3-mobile line-clamp-2 w-[432px]'>
                        {t('reserve_time_pieces.title')}
                    </h3>
                    <Button variant='secondaryInverse'>{t('common:view_all')}</Button>
                </div>
            </Container>
        </section>
    )
}

export default ReserveTimepiece
