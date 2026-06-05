import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import UnstyledLink from '@components/links/UnstyledLink'
import listLocation from '@constant/location'
import { WooCommerce } from '@lib/api'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { formatRupiah } from '@utils/currency'
import { sanitizeHtml } from '@utils/html'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import type { Swiper as SwiperType } from 'swiper'
import { Grid, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/navigation'

const Highlight = () => {
    const { t } = useTranslation('home')
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [tab, setTab] = useState<string>('watches')
    const swiperRef = useRef<SwiperType>()
    const sectionRef = useRef<HTMLElement>(null)
    const isMobile = useMediaQuery({ maxWidth: 1279 })
    const router = useRouter()

    const tabs = [
        {
            label: t('highlight.tabs.watches'),
            value: 'watches'
        },
        { label: t('highlight.tabs.accessories'), value: 'accessories' }
    ]

    const getData = async (categoryId: number) => {
        try {
            setData(null)
            setIsLoading(true)
            const response = await WooCommerce.get(`products?tag=54&category=${categoryId}`)
            setData(response.data)
        } catch (error) {
            // Error fetching products
            setData([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleChangeTab = (selectedTab: string) => {
        if (selectedTab === tab) return
        setTab(selectedTab)
        // reset swiper to first slide immediately for better UX
        swiperRef.current?.slideTo(0)
    }

    useEffect(() => {
        // determine category id based on selected tab label
        const isWatches = tab === tabs[0].value
        const categoryId = isWatches ? 15 : 16
        getData(categoryId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab])

    useEffect(() => {
        // ensure swiper updates after data changes (remount or refresh)
        if (!swiperRef.current) return

        // call update on next frame so DOM has rendered slides
        requestAnimationFrame(() => {
            swiperRef.current?.update()
            swiperRef.current?.slideTo(0)
        })
    }, [data])

    // determine slides per view for current viewport and derive loop/group behavior
    const slidesPerViewCurrent = isMobile ? 2 : 4
    const enableLoop = !isMobile && (data?.length || 0) > slidesPerViewCurrent

    const hasFewSlides = Array.isArray(data) && data.length <= slidesPerViewCurrent
    const locationMatch = listLocation.find((loc) => {
        if (loc.path.endsWith('/*')) {
            const basePath = loc.path.replace('/*', '')
            return router.pathname.startsWith(basePath)
        }
        return router.pathname === loc.path
    })

    return (
        <section ref={sectionRef} className='bg-grey-white relative z-10 pt-14 xl:pt-[116px]'>
            <Container className='flex flex-col gap-5 xl:gap-20'>
                <div className='flex flex-col justify-between gap-6 xl:flex-row xl:items-center'>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black flex-shrink-0'
                    >
                        {t('highlight.title')}
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                        className='border-grey-black flex w-full flex-row border xl:w-auto xl:justify-end'
                    >
                        {tabs.map((item) => (
                            <button
                                key={item.value}
                                onClick={() => handleChangeTab(item.value)}
                                className={`xl:text-button-3-desktop text-button-3-mobile w-full py-3 transition-colors focus:outline-none xl:w-[137px] ${
                                    item.value === tab
                                        ? 'bg-grey-black text-grey-white'
                                        : 'bg-grey-white text-grey-black hover:bg-grey-100'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                <div className='overflow-hidden'>
                    <Swiper
                        key={`highlight-swiper-${tab}`}
                        modules={[Navigation, Grid]}
                        spaceBetween={16}
                        slidesPerView='auto'
                        // slidesPerView={2}
                        // slidesPerGroup={2}
                        // grid={{
                        //     rows: 2,
                        //     fill: 'row'
                        // }}
                        loop={enableLoop}
                        allowTouchMove={true}
                        draggable={true}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper
                        }}
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                                spaceBetween: 12,
                                grid: {
                                    rows: 2,
                                    fill: 'row'
                                }
                            },
                            768: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                                spaceBetween: 16,
                                grid: {
                                    rows: 2,
                                    fill: 'row'
                                }
                            },
                            1280: {
                                slidesPerView: 4,
                                slidesPerGroup: 1,
                                spaceBetween: 16,
                                grid: {
                                    rows: 1,
                                    fill: 'row'
                                }
                            },
                            1536: {
                                slidesPerView: 4,
                                slidesPerGroup: 1,
                                spaceBetween: 24,
                                grid: {
                                    rows: 1,
                                    fill: 'row'
                                }
                            }
                        }}
                    >
                        {isLoading && data === null
                            ? // when loading with no data, render skeleton slides inside swiper so layout matches
                              Array.from({ length: Math.max(4, slidesPerViewCurrent) }).map((_, idx) => (
                                  <SwiperSlide key={`skeleton-${idx}`}>
                                      <div className='flex w-full flex-col gap-1 xl:gap-12'>
                                          <div className='bg-grey-100 aspect-[344/318] w-full animate-pulse xl:h-[318px]' />
                                          <div className='flex flex-col gap-1 text-center'>
                                              <div className='bg-grey-100 mx-auto h-3 w-24 animate-pulse rounded' />
                                              <div className='bg-grey-100 mx-auto mt-2 h-4 w-40 animate-pulse rounded' />
                                              <div className='bg-grey-100 mx-auto mt-2 h-3 w-20 animate-pulse rounded' />
                                              <div className='bg-grey-100 mx-auto mt-2 h-4 w-32 animate-pulse rounded' />
                                          </div>
                                      </div>
                                  </SwiperSlide>
                              ))
                            : data?.map((product: any, index: number) => (
                                  <SwiperSlide key={product.id}>
                                      <motion.div
                                          initial={{ opacity: 0, y: 30 }}
                                          whileInView={{ opacity: 1, y: 0 }}
                                          viewport={{ once: false, amount: 0.2 }}
                                          transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1], delay: index * 0.1 }}
                                      >
                                          <UnstyledLink
                                              href={`/collections/${product.slug}`}
                                              onClick={() => {
                                                  if (tab === 'watches') {
                                                      trackEvent(GA_EVENTS.INTEREST_WATCH_DETAILS, {
                                                          'Button Title': product.name,
                                                          'Button Location': 'Collection highlight',
                                                          'Button Page': locationMatch?.label
                                                      })
                                                  } else {
                                                      trackEvent(GA_EVENTS.INTEREST_ACCESSORIES_DETAILS, {
                                                          'Button Title': product.name,
                                                          'Button Location': 'Collection highlight',
                                                          'Button Page': locationMatch?.label
                                                      })
                                                  }
                                              }}
                                          >
                                              <div className='relative flex w-full flex-col gap-1 xl:gap-8'>
                                                  <div className=' w-full overflow-hidden xl:h-full'>
                                                      <Image
                                                          src={
                                                              product.images[0]?.src ||
                                                              'https://placehold.co/344x417/png?text=TWC'
                                                          }
                                                          alt={product.name}
                                                          width={344}
                                                          height={318}
                                                          className='object-cover'
                                                      />
                                                  </div>
                                                  {product.stock_status === 'onbackorder' && (
                                                      <div className='bg-grey-black absolute left-2 top-2 px-3 pb-1'>
                                                          <span className='text-grey-white xl:text-paragraph-12-desktop text-paragraph-12-mobile !leading-none'>
                                                              Reservable
                                                          </span>
                                                      </div>
                                                  )}

                                                  <div className='flex flex-col gap-1 text-center'>
                                                      <p
                                                          className='xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-200 truncate px-2 uppercase'
                                                          dangerouslySetInnerHTML={{
                                                              __html: sanitizeHtml(`
                                                                ${product.brands?.[0]?.name || ''}
                                                                ${
                                                                    product.meta_data.find(
                                                                        (meta: any) => meta.key === 'reference'
                                                                    )?.value
                                                                        ? ` • ${
                                                                              product.meta_data.find(
                                                                                  (meta: any) =>
                                                                                      meta.key === 'reference'
                                                                              )?.value
                                                                          }`
                                                                        : ''
                                                                }
                                                            `)
                                                          }}
                                                      />

                                                      <h3 className='xl:text-subheading-5-desktop text-subheading-5-mobile text-grey-black line-clamp-2 min-h-[2.5em] px-2'>
                                                          {product.name}
                                                      </h3>
                                                      <p className='xl:text-paragraph-10-desktop text-paragraph-10-mobile text-grey-500 truncate px-2'>
                                                          {product?.meta_data?.key?.startsWith('pre-owned-') &&
                                                              t('highlight.pre_owned', {
                                                                  year: product.meta_data.find((meta: any) =>
                                                                      meta.key.startsWith('pre-owned-')
                                                                  )?.value
                                                              })}
                                                      </p>
                                                      {product.stock_status === 'instock' && product.price !== '' && (
                                                          <p className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-accent-price-dark truncate px-2'>
                                                              {formatRupiah(product.price)}
                                                          </p>
                                                      )}
                                                  </div>
                                              </div>
                                          </UnstyledLink>
                                      </motion.div>
                                  </SwiperSlide>
                              ))}
                    </Swiper>
                    <div className='flex flex-row justify-between pb-px pt-12'>
                        {!hasFewSlides && data && data.length > 0 ? (
                            <div className='flex items-center gap-4'>
                                <button
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className='border-grey-200  flex h-8 w-8 items-center justify-center border transition-colors focus:outline-none'
                                >
                                    <Icons icon='ChevronLeft' width={20} height={20} />
                                </button>
                                <button
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className='border-grey-200  flex h-8 w-8 items-center justify-center border transition-colors focus:outline-none'
                                >
                                    <Icons icon='ChevronRight' width={20} height={20} />
                                </button>
                            </div>
                        ) : (
                            <div />
                        )}
                        <UnstyledLink
                            href={tab === 'accessories' ? '/collections?tab=accessories' : '/collections'}
                            onClick={() => {
                                if (tab === 'watches') {
                                    trackEvent(GA_EVENTS.INTEREST_WATCHES, {
                                        'Button Location': 'Collection highlight',
                                        'Button Page': locationMatch?.label
                                    })
                                } else {
                                    trackEvent(GA_EVENTS.INTEREST_ACCESSORIES, {
                                        'Button Location': 'Collection highlight',
                                        'Button Page': locationMatch?.label
                                    })
                                }
                            }}
                        >
                            <Button variant='primary' className='hover:!border-grey-black/50 hover:text-grey-black/50'>
                                {t('highlight.view_more')}
                            </Button>
                        </UnstyledLink>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Highlight
