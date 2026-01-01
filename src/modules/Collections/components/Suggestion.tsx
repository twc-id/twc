import Container from '@components/Container'
import { WooCommerce } from '@lib/api'
import { formatRupiah } from '@utils/currency'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

interface SuggestionProps {
    products?: any
}
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Suggestion = ({ products }: SuggestionProps) => {
    const { t } = useTranslation(['home', 'common', 'collection'])
    const [related, setRelated] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const isMobile = useMediaQuery({ maxWidth: 1279 })

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

    useEffect(() => {
        const fetchRelated = async () => {
            const ids: number[] = products?.related_ids || []
            if (!ids || ids.length === 0) {
                setRelated([])
                return
            }

            setIsLoading(true)
            try {
                const includeParam = ids.join(',')
                const resp = await WooCommerce.get(`products?include=${includeParam}&per_page=${isMobile ? 4 : 3}`)
                const data = resp?.data || []
                setRelated(data)
            } catch (err) {
                console.error('Error fetching related products', err)
                setRelated([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchRelated()
    }, [isMobile, products?.related_ids])

    return (
        <Container className='py-14 xl:py-[116px]'>
            <div className='flex flex-col items-center gap-4 xl:gap-12'>
                <h1 className='xl:text-subheading-1-desktop text-subheading-1-mobile'>
                    {t('collection:suggestion.title')}
                </h1>

                {isLoading ? (
                    <div>Loading...</div>
                ) : related.length === 0 ? (
                    <div className='text-grey-600 text-center text-sm'>{t('collection:suggestion.empty')}</div>
                ) : (
                    <div className='grid grid-cols-2 grid-rows-2 flex-row items-center gap-4 xl:flex xl:gap-[140px]'>
                        {related.map((p: any) => (
                            <Link href={`/collections/${p.slug ?? p.id}`} key={p.id}>
                                <div onClick={handleSelect} className='flex w-full flex-col gap-1 xl:gap-12'>
                                    <div className='h-[168px] w-[168px] overflow-hidden xl:h-[417px] xl:w-[344px]'>
                                        <Image
                                            src={p.images[0]?.src || '/images/placeholder.png'}
                                            alt={p.name}
                                            width={isMobile ? 168 : 344}
                                            height={isMobile ? 168 : 417}
                                        />
                                    </div>

                                    <div className='flex flex-col gap-1 text-center'>
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
                                                    year: p.meta_data.find((meta: any) =>
                                                        meta.key.startsWith('pre-owned-')
                                                    )?.value
                                                })}
                                        </p>
                                        {p.purchasable ? (
                                            <p className='xl:text-paragraph-4-desktop text-paragraph-4-mobile text-accent-price-dark'>
                                                {/* IDR {parseInt(p.price).toLocaleString('id-ID')} */}
                                                {formatRupiah(p.price)}
                                            </p>
                                        ) : (
                                            <p className='xl:text-paragraph-4-desktop text-paragraph-4-mobile text-red-600'>
                                                {t('common:sold_out')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    )
}

export default Suggestion
