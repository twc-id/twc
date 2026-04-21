import Container from '@components/Container'
import UnstyledLink from '@components/links/UnstyledLink'
import { useRelatedProducts } from '@hooks/useProduct'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { formatRupiah } from '@utils/currency'
import { sanitizeHtml } from '@utils/html'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useMediaQuery } from 'react-responsive'

interface SuggestionProps {
    products?: any
}

const Suggestion = ({ products }: SuggestionProps) => {
    const { t } = useTranslation(['home', 'common', 'collection'])
    const isMobile = useMediaQuery({ maxWidth: 1279 })

    // Use the related products hook
    const { data: related = [], isLoading } = useRelatedProducts(products?.id, isMobile ? 4 : 3)

    const isWatch = products?.categories?.some((category: any) => category.name === 'Watches')

    return (
        <Container className='py-14 xl:py-[116px]'>
            <div className='flex flex-col items-center gap-4 xl:gap-12'>
                <h1 className='xl:text-subheading-1-desktop text-subheading-1-mobile'>
                    {t(`collection:suggestion.${isWatch ? 'watches' : 'accessories'}`)}
                </h1>

                {isLoading ? (
                    <div>Loading...</div>
                ) : related.length === 0 ? (
                    <div className='text-grey-600 text-center text-sm'>{t('collection:suggestion.empty')}</div>
                ) : (
                    <div className='grid grid-cols-2 grid-rows-2 flex-row items-center gap-4 xl:flex xl:gap-[140px]'>
                        {related.map((p: any) => (
                            <UnstyledLink
                                href={`/collections/${p.slug ?? p.id}`}
                                key={p.id}
                                onClick={() => {
                                    if (isWatch) {
                                        trackEvent(GA_EVENTS.INTEREST_WATCH_DETAILS, {
                                            'Page title': p.name
                                        })
                                    } else {
                                        trackEvent(GA_EVENTS.INTEREST_ACCESSORIES_DETAILS, {
                                            'Page title': p.name
                                        })
                                    }
                                }}
                            >
                                <div className='relative flex w-full flex-col gap-1 xl:gap-12'>
                                    <div className='flex items-center justify-center xl:h-[417px] xl:w-[344px]'>
                                        <div className='h-[158px] w-[99px] overflow-hidden xl:h-[319px] xl:w-[196px]'>
                                            <Image
                                                src={p.images[0]?.src || 'https://placehold.co/344x417/png?text=TWC'}
                                                alt={p.name}
                                                width={0}
                                                height={0}
                                                className='h-full w-full object-cover'
                                                unoptimized
                                            />
                                        </div>
                                    </div>

                                    {!p.purchasable && (
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
                                                ${p.brands?.[0]?.name || ''}
                                                ${
                                                    p.meta_data.find((meta: any) => meta.key === 'reference')?.value
                                                        ? ` • ${
                                                              p.meta_data.find((meta: any) => meta.key === 'reference')
                                                                  ?.value
                                                          }`
                                                        : ''
                                                }
                                                `)
                                            }}
                                        />
                                        <h3 className='xl:text-subheading-5-desktop text-subheading-5-mobile text-grey-black'>
                                            {p.name}
                                        </h3>
                                        <p className='xl:text-paragraph-10-desktop text-paragraph-10-mobile text-grey-500'>
                                            {p?.meta_data?.key?.startsWith('pre-owned-') &&
                                                t('home:highlight.pre_owned', {
                                                    year: p.meta_data.find((meta: any) =>
                                                        meta.key.startsWith('pre-owned-')
                                                    )?.value
                                                })}
                                        </p>
                                        {p.purchasable && (
                                            <p className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-accent-price-dark'>
                                                {formatRupiah(p.price)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </UnstyledLink>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default Suggestion
