import UnstyledLink from '@components/links/UnstyledLink'
import Loader from '@components/Loader'
import Skeleton from '@components/Skeleton'
import classNames from '@lib/classnames'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { formatRupiah } from '@utils/currency'
import { sanitizeHtml } from '@utils/html'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { Else, If, Then } from 'react-if'
import { useMediaQuery } from 'react-responsive'

interface ContentProps {
    products: any
    isLoading?: boolean
    onLoadMore?: () => void
    hasMore?: boolean
    isLoadingMore?: boolean
    total?: number | null
    contentRef?: React.RefObject<HTMLDivElement>
    isPinned?: boolean
}

const Content: React.FC<ContentProps> = ({ products, isLoading, isLoadingMore, contentRef }) => {
    const { t } = useTranslation(['collection', 'home', 'common'])
    const isMobile = useMediaQuery({ maxWidth: 1279 })

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Loader />
            </div>
        )
    }

    const isWatch = products?.[0]?.categories?.some((category: any) => category.name === 'Watches')
    return (
        <div
            ref={contentRef}
            className={classNames('scrollbar-none relative h-full xl:max-h-screen xl:overflow-hidden', {
                // 'xl:max-h-[calc(100dvh-110px)]': !isPinned,
                // 'xl:max-h-[calc(100dvh-200px)]': isPinned
            })}
        >
            <If condition={products && products.length > 0}>
                <Then>
                    <div className='grid grid-cols-2 grid-rows-2 gap-2 xl:grid-cols-3 xl:grid-rows-3'>
                        {products.map((item: any) => (
                            <UnstyledLink
                                href={`/collections/${item.slug}`}
                                key={item.id}
                                onClick={() => {
                                    if (isWatch) {
                                        trackEvent(GA_EVENTS.INTEREST_WATCH_DETAILS)
                                    } else {
                                        trackEvent(GA_EVENTS.INTEREST_ACCESSORIES_DETAILS)
                                    }
                                }}
                            >
                                <div
                                    className='relative flex flex-col items-center gap-1 overflow-hidden pb-6 xl:gap-3 xl:pb-8'
                                    key={item.name}
                                >
                                    <div className='relative h-[168px] w-[168px] overflow-hidden xl:h-[318px] xl:w-[318px]'>
                                        <Image
                                            src={item?.images?.[0]?.src || 'https://placehold.co/318x318/png?text=TWC'}
                                            alt={item?.name}
                                            width={isMobile ? 168 : 318}
                                            height={isMobile ? 168 : 318}
                                        />
                                    </div>
                                    {!item.purchasable && (
                                        <div className='bg-grey-black absolute left-2 top-2 px-3 pb-1'>
                                            <span className='text-grey-white xl:text-paragraph-12-desktop text-paragraph-12-mobile !leading-none'>
                                                Reservable
                                            </span>
                                        </div>
                                    )}

                                    <div className='flex flex-col gap-1 text-center'>
                                        <p
                                            className='xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-200 uppercase'
                                            dangerouslySetInnerHTML={{
                                                __html: sanitizeHtml(`
                                                ${item?.brands?.[0]?.name || ''}
                                                ${
                                                    item?.meta_data?.find((meta: any) => meta.key === 'reference')
                                                        ?.value
                                                        ? ` • ${
                                                              item?.meta_data?.find(
                                                                  (meta: any) => meta.key === 'reference'
                                                              )?.value
                                                          }`
                                                        : ''
                                                }
                                            `)
                                            }}
                                        />

                                        <h4
                                            className='xl:text-subheading-5-desktop text-subheading-5-mobile text-grey-black'
                                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.name) }}
                                        />

                                        <p className='xl:text-paragraph-10-desktop text-paragraph-10-mobile text-grey-500'>
                                            {item?.meta_data?.find(
                                                (meta: any) => meta.key === 'basic-info-year-purchase'
                                            ) &&
                                                t('home:highlight.pre_owned', {
                                                    year: item?.meta_data?.find(
                                                        (meta: any) => meta.key === 'basic-info-year-purchase'
                                                    )?.value
                                                })}
                                        </p>
                                        {item.purchasable && (
                                            <p className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-accent-price-dark'>
                                                {formatRupiah(item.price)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </UnstyledLink>
                        ))}
                    </div>
                    {isLoadingMore && (
                        <div className='mt-2 grid grid-cols-2 gap-2 xl:mt-12 xl:grid-cols-3'>
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className='flex flex-col items-center gap-1 xl:gap-12'>
                                    <Skeleton className='h-[168px] w-[168px] rounded-none xl:h-[318px] xl:w-[318px]' />
                                    <div className='flex flex-col items-center gap-1'>
                                        <Skeleton className='h-3 w-24' />
                                        <Skeleton className='h-4 w-32' />
                                        <Skeleton className='h-3 w-20' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Then>
                <Else>
                    <p
                        className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-200
                '
                    >
                        {t('common:no_product')}
                    </p>
                </Else>
            </If>
        </div>
    )
}

export default Content
