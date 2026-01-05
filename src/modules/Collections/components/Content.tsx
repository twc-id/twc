import UnstyledLink from '@components/links/UnstyledLink'
import Loader from '@components/Loader'
import { formatRupiah } from '@utils/currency'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React from 'react'
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
    return (
        <div ref={contentRef} className='scrollbar-none xl:max-h-screen xl:overflow-y-auto'>
            {products && products.length > 0 ? (
                products.map((item: any) => (
                    <div className='grid grid-cols-2 grid-rows-2 gap-2 xl:grid-cols-3 xl:grid-rows-3' key={item.id}>
                        <UnstyledLink href={`/collections/${item.slug}`}>
                            <div className='flex flex-col items-center gap-1 overflow-hidden xl:gap-12' key={item.name}>
                                <div className='relative h-[168px] w-[168px] overflow-hidden xl:h-[318px] xl:w-[318px]'>
                                    <Image
                                        src={item?.images?.[0]?.src || '/images/placeholder.png'}
                                        alt={item?.name}
                                        width={isMobile ? 168 : 318}
                                        height={isMobile ? 168 : 318}
                                    />
                                </div>

                                <div className='flex flex-col gap-1 text-center'>
                                    <p className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-200 uppercase'>
                                        {item?.brands?.[0].name} •{' '}
                                        {item?.meta_data?.find((meta: any) => meta.key === 'reference')?.value}
                                    </p>
                                    <h4
                                        className='xl:text-subheading-5-desktop text-subheading-5-mobile text-grey-black'
                                        dangerouslySetInnerHTML={{ __html: item.name }}
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
                    </div>
                ))
            ) : (
                <p
                    className='xl:text-paragraph-5-desktop text-paragraph-5-mobile text-grey-200
                '
                >
                    {t('common:no_product')}
                </p>
            )}
        </div>
    )
}

export default Content
