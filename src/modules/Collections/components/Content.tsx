import UnstyledLink from '@components/links/UnstyledLink'
import Loader from '@components/Loader'
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
}

const Content: React.FC<ContentProps> = ({ products, isLoading, contentRef }) => {
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
        <div ref={contentRef} className='scrollbar-none xl:max-h-screen xl:overflow-hidden'>
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
                                    className='relative flex flex-col items-center gap-1 overflow-hidden xl:gap-12'
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
                                            <span className='text-grey-white xl:text-paragraph-11-desktop text-paragraph-11-mobile !leading-none'>
                                                Pre-order
                                            </span>
                                        </div>
                                    )}

                                    <div className='flex flex-col gap-1 text-center'>
                                        <p
                                            className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 uppercase'
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

                                        <p className='xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-500'>
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
                                            <p className='xl:text-paragraph-4-desktop text-paragraph-4-mobile text-accent-price-dark'>
                                                {formatRupiah(item.price)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </UnstyledLink>
                        ))}
                    </div>
                </Then>
                <Else>
                    <p
                        className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-grey-200
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
