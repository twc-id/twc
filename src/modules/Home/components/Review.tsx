import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import { useGSAP } from '@gsap/react'
import { WooCommerce } from '@lib/api'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Review = () => {
    const [data, setData] = useState<any[]>([])
    const [products, setProducts] = useState<any>({})
    const swiperDesktopRef = useRef<SwiperType>()
    const swiperMobileRef = useRef<SwiperType>()
    const contentDesktopRef = useRef<HTMLDivElement>(null)
    const contentMobileRef = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLElement>(null)

    const getData = async () => {
        try {
            const response = await WooCommerce.get('products/reviews')
            setData(response.data)

            // Fetch product details for each review
            const productIds = Array.from(new Set(response.data.map((review: any) => review.product_id)))
            const productPromises = productIds.map((id) => WooCommerce.get(`products/${id as number}`))
            const productResponses = await Promise.all(productPromises)

            const productMap: any = {}
            productResponses.forEach((res) => {
                productMap[res.data.id] = res.data
            })

            setProducts(productMap)
        } catch (error) {
            // Error fetching reviews
        }
    }

    const extractImageFromReview = (reviewHtml: string) => {
        // Extract image URL from HTML review content
        const imgMatch = reviewHtml.match(/<img[^>]+src="([^">]+)"/)
        return imgMatch ? imgMatch[1] : '/images/home/review-placeholder.webp'
    }

    const stripHtmlTags = (html: string) => {
        // Remove HTML tags and get plain text
        return html.replace(/<[^>]*>/g, '').trim()
    }

    const formatPrice = (price: string) => {
        return `IDR ${parseFloat(price).toLocaleString('id-ID')}`
    }

    useEffect(() => {
        getData()
    }, [])

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(
            [contentDesktopRef.current, contentMobileRef.current],
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        )
    }, [])

    return (
        <section className='bg-grey-black relative z-[12] py-14 xl:py-[116px]' ref={sectionRef}>
            <Container className='flex flex-col gap-10 xl:gap-20'>
                <div className='flex flex-row items-center justify-between'>
                    <h1 className='text-heading-2-mobile text-grey-white xl:text-heading-2-desktop'>
                        Where Trust Speaks
                    </h1>
                    <div className='hidden flex-row gap-4 xl:flex'>
                        <Button
                            className='!h-8 !w-8'
                            onClick={() => swiperDesktopRef.current?.slidePrev()}
                            // disabled={!canScrollLeft}
                            variant='secondary'
                        >
                            <Icons icon='ChevronLeft' width={20} height={20} />
                        </Button>
                        <Button
                            className='!h-8 !w-8'
                            onClick={() => swiperDesktopRef.current?.slideNext()}
                            // disabled={!canScrollRight}
                            variant='secondary'
                        >
                            <Icons icon='ChevronRight' width={20} height={20} />
                        </Button>
                    </div>
                </div>

                {/* Desktop Swiper */}
                <div className='hidden xl:block' ref={contentDesktopRef}>
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

                            const reviewImage = extractImageFromReview(review.review)
                            const reviewText = stripHtmlTags(review.review)

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
                                            <div className='absolute bottom-10 left-10 right-10 flex flex-row gap-4 bg-white p-4'>
                                                <div className='relative h-[88px] w-[88px] flex-shrink-0'>
                                                    <Image
                                                        src={product.images[0]?.src || '/images/placeholder.webp'}
                                                        alt={product.name}
                                                        fill
                                                        className='object-contain'
                                                    />
                                                </div>
                                                <div className='flex flex-col gap-1'>
                                                    <p className='text-paragraph-8-desktop text-grey-500'>
                                                        {product.categories[0]?.name || 'Watch'}
                                                    </p>
                                                    <h4
                                                        className='text-subheading-6-desktop text-grey-black'
                                                        dangerouslySetInnerHTML={{ __html: product.name }}
                                                    />
                                                    <p className='text-paragraph-9-desktop text-grey-500'>
                                                        {product.stock_status === 'instock' ? 'In Stock' : 'Pre-owned'}
                                                    </p>
                                                    <p className='text-subheading-6-desktop text-accent-price-dark'>
                                                        {formatPrice(product.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right side - Content */}
                                        <div className='flex flex-1 flex-col justify-center gap-10'>
                                            <p className='text-subheading-1-desktop text-grey-100'>{reviewText}</p>
                                            <p className='text-paragraph-6-desktop text-grey-200'>{review.reviewer}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>

                {/* Mobile Swiper */}
                <div className='xl:hidden' ref={contentMobileRef}>
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

                            const reviewImage = extractImageFromReview(review.review)
                            const reviewText = stripHtmlTags(review.review)

                            return (
                                <SwiperSlide key={review.id}>
                                    <div className='flex flex-col gap-6'>
                                        {/* Image */}
                                        <div className='relative h-[725px] w-full'>
                                            <Image
                                                src={reviewImage}
                                                alt={review.reviewer}
                                                fill
                                                className='object-cover'
                                            />
                                            {/* Product Card Overlay */}
                                            <div className='absolute bottom-4 left-4 right-4 flex flex-row gap-3 bg-white p-3'>
                                                <div className='relative h-[126px] w-[104px] flex-shrink-0'>
                                                    <Image
                                                        src={product.images[0]?.src || '/images/placeholder.webp'}
                                                        alt={product.name}
                                                        fill
                                                        className='object-contain'
                                                    />
                                                </div>
                                                <div className='flex flex-col gap-0.5'>
                                                    <p className='text-paragraph-10-mobile text-grey-500'>
                                                        {product.categories[0]?.name || 'Watch'}
                                                    </p>
                                                    <h4
                                                        className='text-subheading-6-mobile text-grey-black'
                                                        dangerouslySetInnerHTML={{ __html: product.name }}
                                                    />
                                                    <p className='text-paragraph-11-mobile text-grey-500'>
                                                        {product.stock_status === 'instock' ? 'In Stock' : 'Pre-owned'}
                                                    </p>
                                                    <p className='text-subheading-6-mobile text-accent-price-dark'>
                                                        {formatPrice(product.price)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className='flex flex-col gap-8 xl:gap-4'>
                                            <p className='text-paragraph-3-mobile text-grey-white'>{reviewText}</p>
                                            <p className='text-paragraph-6-mobile text-grey-200'>{review.reviewer}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
                <div className='flex flex-row gap-4 xl:hidden'>
                    <Button
                        className='!h-8 !w-8'
                        onClick={() => swiperMobileRef.current?.slidePrev()}
                        variant='secondary'
                    >
                        <Icons icon='ChevronLeft' width={20} height={20} />
                    </Button>
                    <Button
                        className='!h-8 !w-8'
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
