import Container from '@components/Container'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React from 'react'

const WhiteSpace = ({ image }: { image?: string }) => {
    const { t } = useTranslation('about')

    return (
        <section className='relative z-0 -mb-[300px] xl:-mb-[560px]'>
            <Container className='py-16 xl:py-[160px]'>
                <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-700 xl:w-[520px]'>
                    {t('white_space.description')}
                </p>
            </Container>
            <div className='sticky top-0 z-0 h-[300px] w-full xl:h-[560px]'>
                <Image
                    src={image || '/images/about-us/white-space.webp'}
                    alt='The Watch Collections'
                    fill
                    className='object-cover'
                    unoptimized
                />
            </div>
            {/* Spacer for sticky pin duration */}
            <div className='h-[300px] xl:h-[560px]' aria-hidden='true' />
        </section>
    )
}

export default WhiteSpace
