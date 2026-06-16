import { formatRupiah } from '@utils/currency'
import { sanitizeHtml } from '@utils/html'
import { getPreOwnedYear } from '@utils/product'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import React from 'react'

interface SuggestionProps {
    products?: any
    isLoading?: boolean
}

const Suggestion = ({ products, isLoading }: SuggestionProps) => {
    const { t } = useTranslation(['home', 'common', 'collection'])

    return (
        <div className='flex w-full flex-col items-center gap-4 xl:gap-12'>
            <h1 className='xl:text-subheading-1-desktop text-subheading-1-mobile'>
                {t('collection:suggestion.watches')}
            </h1>

            {isLoading ? (
                <div>Loading...</div>
            ) : products?.length === 0 ? (
                <div className='text-grey-600 text-center text-sm'>{t('collection:suggestion.empty')}</div>
            ) : (
                <div className='grid grid-cols-2 grid-rows-2 flex-row items-center gap-4 xl:flex xl:gap-[140px]'>
                    {products?.map((p: any) => (
                        <Link href={`/collections/${p.slug ?? p.id}`} key={p.id}>
                            <div className='relative flex min-h-[363px] w-full flex-col items-center gap-1'>
                                <div className='flex h-[217px] w-[217px] items-center justify-center'>
                                    <div className='h-[166px] w-[124px] overflow-hidden '>
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

                                {p.stock_status === 'onbackorder' && (
                                    <div className='bg-grey-black absolute left-2 top-2 px-3 pb-1'>
                                        <span className='text-grey-white xl:text-paragraph-12-desktop text-paragraph-12-mobile !leading-none'>
                                            Reservable
                                        </span>
                                    </div>
                                )}

                                <div className='flex flex-col gap-1 text-center xl:w-[217px]'>
                                    <p
                                        className='xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-200 uppercase'
                                        dangerouslySetInnerHTML={{
                                            __html: sanitizeHtml(`
                                        ${p.brands?.[0].name}
                                        ${
                                            p.meta_data.find((meta: any) => meta.key === 'reference')?.value
                                                ? ` • ${
                                                      p.meta_data.find((meta: any) => meta.key === 'reference')?.value
                                                  }`
                                                : ''
                                        }
                                            `)
                                        }}
                                    />
                                    <h3 className='xl:text-subheading-5-desktop text-subheading-5-mobile text-grey-black'>
                                        {p.name}
                                    </h3>
                                    {(() => {
                                        const year = getPreOwnedYear(p)
                                        return year ? (
                                            <p className='xl:text-paragraph-10-desktop text-paragraph-10-mobile text-grey-500'>
                                                {t('home:highlight.pre_owned', { year })}
                                            </p>
                                        ) : null
                                    })()}
                                    {p.stock_status === 'instock' && p.price !== '' && (
                                        <p className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-accent-price-dark'>
                                            {formatRupiah(p.price)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Suggestion
