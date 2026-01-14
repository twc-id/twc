import { formatRupiah } from '@utils/currency'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import React from 'react'

interface SuggestionProps {
    products?: any
    isLoading?: boolean
}
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Suggestion = ({ products, isLoading }: SuggestionProps) => {
    const { t } = useTranslation(['home', 'common', 'collection'])

    const handleSelect = () => {
        if (typeof window === 'undefined') return
        try {
            // kill the specific left pin ScrollTrigger and all ScrollTriggers
            ScrollTrigger.getById && ScrollTrigger.getById('detail-left-pin')?.kill()
            ScrollTrigger.getAll && ScrollTrigger.getAll().forEach((s: any) => s.kill())
            // kill any active tweens
            gsap.killTweensOf('*')
        } catch (e) {
            // swallow
        }
    }

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
                            <div
                                onClick={handleSelect}
                                className='relative flex min-h-[363px] w-full flex-col items-center gap-1'
                            >
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

                                {!p.purchasable && (
                                    <div className='bg-grey-black absolute left-2 top-2 px-3 pb-1'>
                                        <span className='text-grey-white xl:text-paragraph-11-desktop text-paragraph-11-mobile !leading-none'>
                                            Pre-order
                                        </span>
                                    </div>
                                )}

                                <div className='flex w-[217px] flex-col gap-1 text-center'>
                                    <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 uppercase'>
                                        {p.brands?.[0].name} •{' '}
                                        {p.meta_data.find((meta: any) => meta.key === 'reference')?.value}
                                    </p>
                                    <h3 className='xl:text-subheading-5-desktop text-subheading-5-mobile text-grey-black'>
                                        {p.name}
                                    </h3>
                                    <p className='xl:text-paragraph-9-desktop text-paragraph-9-mobile text-grey-500'>
                                        {p?.meta_data?.key?.startsWith('pre-owned-') &&
                                            t('home:highlight.pre_owned', {
                                                year: p.meta_data.find((meta: any) => meta.key.startsWith('pre-owned-'))
                                                    ?.value
                                            })}
                                    </p>
                                    {p.purchasable && (
                                        <p className='xl:text-paragraph-4-desktop text-paragraph-4-mobile text-accent-price-dark'>
                                            {/* IDR {parseInt(p.price).toLocaleString('id-ID')} */}
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
