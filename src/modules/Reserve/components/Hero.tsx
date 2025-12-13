import Container from '@components/Container'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { Mousewheel, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'

const Hero = () => {
    const { t } = useTranslation('reserve')
    const [activeIndex, setActiveIndex] = useState(0)

    const items = [
        {
            id: 1,
            image: '/images/reserve/carousel-1.webp',
            label: t('hero.items.1.title')
        },
        {
            id: 2,
            image: '/images/reserve/carousel-2.webp',
            label: t('hero.items.2.title')
        },
        {
            id: 3,
            image: '/images/reserve/carousel-3.webp',
            label: t('hero.items.3.title')
        }
    ]
    return (
        <section className='bg-grey-black xl:pt-[160px]'>
            <Container className='xl:pb-[116px]'>
                <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white line-clamp-3 xl:w-[500px]'>
                    {t('hero.title')}
                </h1>
            </Container>
            <div className='flex w-full flex-row xl:gap-[152px]'>
                <div className='xl:h-[940px] xl:w-[749px]'>
                    <Image
                        src='/images/reserve/carousel-left.webp'
                        alt='Reserve Hero Image'
                        width={749}
                        height={940}
                        className='h-full w-full object-cover'
                        unoptimized
                    />
                </div>
                <div className='flex flex-col gap-6 '>
                    {/* Vertical Carousel */}
                    <div className='xl:h-[940px]'>
                        <Swiper
                            direction='vertical'
                            modules={[Mousewheel, Pagination]}
                            spaceBetween={20}
                            slidesPerView='auto'
                            initialSlide={activeIndex}
                            centeredSlides
                            centeredSlidesBounds
                            mousewheel
                            grabCursor
                            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                            className='h-full'
                            slideToClickedSlide
                            // loopAddBlankSlides
                            // loopAdditionalSlides={1}
                            loop
                        >
                            {items.map((item, _) => (
                                <SwiperSlide key={item.id} className='!h-auto'>
                                    {({ isActive }) => (
                                        <div
                                            className={`relative cursor-pointer transition-all duration-300 ${
                                                isActive
                                                    ? 'xl:h-[387px] xl:w-[387px]'
                                                    : 'bg-grey-black/80 opacity-70 hover:opacity-90 xl:h-[386px] xl:w-[386px]'
                                            }`}
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.label}
                                                fill
                                                className=' object-cover'
                                                unoptimized
                                            />

                                            {isActive && (
                                                <div className='absolute bottom-4 left-4'>
                                                    <span className='text-grey-black rounded bg-white px-3 py-1 text-sm font-medium'>
                                                        {item.label}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
            {/* Description */}
            <div className='xl:max-w-[350px]'>
                <p className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-200'>
                    {t('hero.description')}
                </p>
            </div>
        </section>
    )
}

export default Hero
