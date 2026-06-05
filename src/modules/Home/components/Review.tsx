import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import { WooCommerce } from '@lib/api'
import { formatRupiah } from '@utils/currency'
import { sanitizeHtml } from '@utils/html'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

const Review = () => {
    const { t } = useTranslation('home')
    const [data, setData] = useState<any[]>([])
    const [products, setProducts] = useState<any>({})
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const swiperDesktopRef = useRef<SwiperType>()
    const swiperMobileRef = useRef<SwiperType>()
    const sectionRef = useRef<HTMLElement>(null)

    const getData = async () => {
        try {
            setIsLoading(true)
            const response = await WooCommerce.get('testimonials')
            const dataTestimonials = response?.data?.items || []

            setData(dataTestimonials)

            // Fetch product details for each review (batch by include param)
            const productIds = Array.from(new Set(dataTestimonials.map((review: any) => review.product_id))).filter(
                Boolean
            ) as number[]

            if (productIds.length > 0) {
                try {
                    const includeParam = productIds.join(',')
                    const productsResponse = await WooCommerce.get(
                        `products?include=${includeParam}&per_page=${productIds.length}`
                    )
                    const productsArray = productsResponse?.data || []
                    const productMap: Record<number, any> = {}
                    productsArray.forEach((p: any) => {
                        if (p?.id) productMap[p.id] = p
                    })

                    setProducts(productMap)
                } catch (err) {
                    console.error('Error fetching products for testimonials', err)
                    setProducts({})
                }
            } else {
                setProducts({})
            }
        } catch (error) {
            // Error fetching reviews
            console.error('Error fetching testimonials', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    if (isLoading) {
        // Render skeleton placeholders for desktop and mobile while loading
        return (
            <section className='bg-grey-black relative z-[12] py-14 xl:py-[116px]'>
                <Container className='flex flex-col gap-10 xl:gap-20'>
                    <div className='flex flex-row items-center justify-between'>
                        <div className='bg-grey-100 h-8 w-64 animate-pulse rounded' />
                        <div className='hidden gap-4 xl:flex'>
                            <div className='bg-grey-100 h-8 w-8 animate-pulse rounded' />
                            <div className='bg-grey-100 h-8 w-8 animate-pulse rounded' />
                        </div>
                    </div>

                    {/* Desktop skeleton */}
                    <div className='hidden xl:block'>
                        <div className='flex flex-row xl:gap-20'>
                            <div className='relative h-[725px] w-[566px] flex-shrink-0'>
                                <div className='bg-grey-100 absolute inset-0 animate-pulse' />
                            </div>
                            <div className='flex flex-1 flex-col justify-center gap-10'>
                                <div className='bg-grey-100 h-6 w-3/4 animate-pulse rounded' />
                                <div className='bg-grey-100 h-4 w-1/2 animate-pulse rounded' />
                                <div className='bg-grey-100 h-6 w-1/4 animate-pulse rounded' />
                            </div>
                        </div>
                    </div>

                    {/* Mobile skeleton */}
                    <div className='xl:hidden'>
                        <div className='flex flex-col gap-6'>
                            <div className='relative h-[420px] w-full'>
                                <div className='bg-grey-100 absolute inset-0 animate-pulse' />
                            </div>
                            <div className='flex flex-col gap-4'>
                                <div className='bg-grey-100 h-5 w-3/4 animate-pulse rounded' />
                                <div className='bg-grey-100 h-4 w-1/2 animate-pulse rounded' />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        )
    }

    return (
        <section className='bg-grey-black relative z-[12] overflow-x-hidden py-14 xl:py-[116px]' ref={sectionRef}>
            <Container className='flex flex-col gap-10 xl:gap-20'>
                <div className='flex flex-row items-center justify-between'>
                    <h1 className='text-heading-2-mobile text-grey-white xl:text-heading-2-desktop'>
                        {t('review.title')}
                    </h1>
                    <div className='hidden flex-row gap-4 xl:flex'>
                        <Button
                            className='!h-8 !w-8 !p-0'
                            onClick={() => swiperDesktopRef.current?.slidePrev()}
                            // disabled={!canScrollLeft}
                            variant='secondary'
                        >
                            <Icons icon='ChevronLeft' width={20} height={20} />
                        </Button>
                        <Button
                            className='!h-8 !w-8 !p-0'
                            onClick={() => swiperDesktopRef.current?.slideNext()}
                            // disabled={!canScrollRight}
                            variant='secondary'
                        >
                            <Icons icon='ChevronRight' width={20} height={20} />
                        </Button>
                    </div>
                </div>

                {/* Desktop Swiper */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                    className='hidden xl:block'
                >
                    <Swiper
                        modules={[Navigation]}
                        loop
                        spaceBetween={20}
                        slidesPerView={1}
                        onSwiper={(swiper) => {
                            swiperDesktopRef.current = swiper
                        }}
                    >
                        {data.map((review: any) => {
                            const product = products[review.product_id]
                            if (!product) return null

                            // const reviewImage = extractImageFromReview(review.review)
                            const reviewImage = review.image?.url || ''
                            // const reviewText = stripHtmlTags(review.review)
                            const reviewText = review.text

                            return (
                                <SwiperSlide key={review.id}>
                                    <div className='flex flex-row xl:gap-20'>
                                        {/* Left side - Image */}
                                        <div className='relative h-[725px] w-[566px] flex-shrink-0'>
                                            <Image
                                                src={reviewImage}
                                                alt={review.reviewer}
                                                fill
                                                className='object-cover'
                                            />
                                            {/* Product Card Overlay */}
                                            <div className='absolute bottom-10 left-10 right-10 flex flex-row items-center gap-4 bg-white p-4'>
                                                <div className='relative h-[88px] w-[88px] flex-shrink-0'>
                                                    <Image
                                                        src={
                                                            product.images[0]?.src ||
                                                            'https://placehold.co/88x88/png?text=TWC'
                                                        }
                                                        alt={product.name}
                                                        fill
                                                        className='object-contain'
                                                    />
                                                </div>

                                                <div className='flex flex-col gap-1'>
                                                    <p className='xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-500'>
                                                        {product.brands?.[0].name} •{' '}
                                                        {
                                                            product.meta_data.find(
                                                                (meta: any) => meta.key === 'reference'
                                                            )?.value
                                                        }
                                                    </p>
                                                    <h4
                                                        className='xl:text-subheading-6-desktop text-subheading-6-mobile text-grey-black'
                                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.name) }}
                                                    />
                                                    {product?.meta_data?.key?.startsWith('pre-owned-') && (
                                                        <p className='xl:text-paragraph-10-desktop text-paragraph-10-mobile text-grey-500'>
                                                            {t('highlight.pre_owned', {
                                                                year: product.meta_data.find((meta: any) =>
                                                                    meta.key.startsWith('pre-owned-')
                                                                )?.value
                                                            })}
                                                        </p>
                                                    )}

                                                    {product?.stock_status === 'instock' && product?.price !== '' && (
                                                        <p className='xl:text-subheading-6-desktop text-subheading-6-mobile text-accent-price-dark'>
                                                            {formatRupiah(product.price)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Content */}
                                        <div className='flex flex-1 flex-col justify-center gap-10'>
                                            <p className='xl:text-subheading-1-desktop text-subheading-1-mobile text-grey-100'>
                                                {reviewText}
                                            </p>
                                            <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200'>
                                                {review?.name}. {review?.position} {review?.company}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </motion.div>

                {/* Mobile Swiper */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                    className='xl:hidden'
                >
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={1}
                        loop
                        onSwiper={(swiper) => {
                            swiperMobileRef.current = swiper
                        }}
                        onSlideChange={(swiper) => (swiperMobileRef.current = swiper)}
                    >
                        {data.map((review: any) => {
                            const product = products[review.product_id]
                            if (!product) return null

                            // const reviewImage = extractImageFromReview(review.review)

                            const reviewImage = review.image?.url || ''
                            const reviewText = review.text

                            return (
                                <SwiperSlide key={review.id}>
                                    <div className='flex flex-col gap-6'>
                                        {/* Image */}
                                        <div className='relative h-[725px] w-full'>
                                            <Image
                                                src={reviewImage}
                                                alt={review.reviewer || ''}
                                                fill
                                                className='object-cover'
                                            />
                                            {/* Product Card Overlay */}
                                            <div className='absolute bottom-4 left-4 right-4 flex flex-row items-center gap-3 bg-white p-3'>
                                                <div className='relative h-[126px] w-[104px] flex-shrink-0'>
                                                    <Image
                                                        src={
                                                            product.images[0]?.src ||
                                                            'https://placehold.co/600x400/png?text=TWC'
                                                        }
                                                        alt={product.name || ''}
                                                        fill
                                                        className='object-contain'
                                                    />
                                                </div>
                                                <div className='flex flex-col gap-0.5'>
                                                    <p className='text-paragraph-11-mobile text-grey-500'>
                                                        {product.brands?.[0].name} •{' '}
                                                        {
                                                            product.meta_data.find(
                                                                (meta: any) => meta.key === 'reference'
                                                            )?.value
                                                        }
                                                    </p>
                                                    <h4
                                                        className='text-subheading-6-mobile text-grey-black'
                                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.name) }}
                                                    />
                                                    {/* <p className='text-paragraph-12-mobile text-grey-500'>
                                                        {product.stock_status === 'instock' ? 'In Stock' : 'Pre-owned'}
                                                    </p> */}

                                                    {product?.meta_data?.key?.startsWith('pre-owned-') && (
                                                        <p className='text-paragraph-12-mobile text-grey-500'>
                                                            {t('highlight.pre_owned', {
                                                                year: product.meta_data.find((meta: any) =>
                                                                    meta.key.startsWith('pre-owned-')
                                                                )?.value
                                                            })}
                                                        </p>
                                                    )}

                                                    {product?.stock_status === 'instock' && product?.price !== '' && (
                                                        <p className='text-subheading-6-mobile text-accent-price-dark'>
                                                            {formatRupiah(product.price)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className='flex flex-col gap-8 xl:gap-4'>
                                            <p className='text-paragraph-3-mobile text-grey-white'>{reviewText}</p>
                                            <p className='text-paragraph-7-mobile text-grey-200'>
                                                {review?.name}. {review?.position} {review?.company}
                                            </p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </motion.div>
                <div className='flex flex-row gap-4 xl:hidden'>
                    <Button
                        className='!h-8 !w-8 !p-0'
                        onClick={() => swiperMobileRef.current?.slidePrev()}
                        variant='secondary'
                    >
                        <Icons icon='ChevronLeft' width={20} height={20} />
                    </Button>
                    <Button
                        className='!h-8 !w-8 !p-0'
                        onClick={() => swiperMobileRef.current?.slideNext()}
                        variant='secondary'
                    >
                        <Icons icon='ChevronRight' width={20} height={20} />
                    </Button>
                </div>
            </Container>
        </section>
    )
}

export default Review
