import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import { WooCommerce } from '@lib/api'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

const tabs = ['Watches', 'Accessories'] as const
type TabTypes = (typeof tabs)[number]

const Highlight = () => {
    const [data, setData] = useState<any>(null)
    const [tab, setTab] = useState<TabTypes>('Watches')
    const swiperRef = useRef<SwiperType>()

    const getData = async () => {
        try {
            const response = await WooCommerce.get('products')
            setData(response.data)
        } catch (error) {
            // Error fetching products
        }
    }

    const handleChangeTab = (selectedTab: TabTypes) => {
        setTab(selectedTab)
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <section className='py-[116px]'>
            <Container className='flex flex-col gap-20'>
                <div className='flex flex-row items-center justify-between'>
                    <h1 className='text-heading-2-desktop text-grey-black'>Collection Highlight</h1>
                    <div className='flex flex-row'>
                        {tabs.map((item) => (
                            <Button
                                key={item}
                                variant={item === tab ? 'primary' : 'secondary'}
                                className=''
                                onClick={() => handleChangeTab(item)}
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className=''>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={4}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper
                        }}
                        loop
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 16
                            },
                            768: {
                                slidesPerView: 2,
                                spaceBetween: 20
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 24
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 24
                            }
                        }}
                    >
                        {data?.map((product: any) => (
                            <SwiperSlide key={product.id} className='!w-[344px]'>
                                <div className=' w-full flex-col gap-12'>
                                    <div className='h-[417px] w-[344px]'>
                                        <Image
                                            src={product.images[0]?.src || '/images/placeholder.png'}
                                            alt={product.name}
                                            width={344}
                                            height={417}
                                        />
                                    </div>

                                    <div className='flex flex-col gap-1 text-center'>
                                        <p className='text-paragraph-8-desktop text-grey-200 uppercase'>
                                            {product.categories[0]?.name || 'ROLEX PHILIPPE'} •{' '}
                                            {product.tags[0]?.name || 'SERIES'}
                                        </p>
                                        <h3 className='text-subheading-5-desktop text-grey-black'>{product.name}</h3>
                                        <p className='text-paragraph-9-desktop text-grey-500'>
                                            Pre-owned: {new Date(product.date_created).getFullYear()}
                                        </p>
                                        <p className='text-paragraph-4-desktop text-accent-price-dark'>
                                            IDR {parseInt(product.price).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className='flex flex-row justify-between pt-12'>
                        <div className='flex items-center gap-4'>
                            <button
                                onClick={() => swiperRef.current?.slidePrev()}
                                className='border-grey-200 hover:bg-grey-100 flex h-8 w-8 items-center justify-center border transition-colors'
                            >
                                <Icons icon='ChevronLeft' width={20} height={20} />
                            </button>
                            <button
                                onClick={() => swiperRef.current?.slideNext()}
                                className='border-grey-200 hover:bg-grey-100 flex h-8 w-8 items-center justify-center border transition-colors'
                            >
                                <Icons icon='ChevronRight' width={20} height={20} />
                            </button>
                        </div>
                        <Button variant='primary' className=''>
                            View More
                        </Button>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Highlight
