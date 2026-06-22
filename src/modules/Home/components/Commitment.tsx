import Icons from '@components/Icon'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Commitment = ({ image }: { image?: string }) => {
    const { t } = useTranslation('home')

    return (
        <section className='bg-grey-black relative z-0 -mb-[50vh] xl:-mb-[100vh]'>
            <div className='bg-grey-black relative z-10 flex flex-col items-center justify-center gap-6 px-4 py-16 text-center xl:py-[160px]'>
                <h1 className='text-heading-2-mobile text-grey-white xl:text-heading-2-desktop'>
                    {t('commitment.title')}
                </h1>
                <Icons icon='Diamond' className='text-grey-100' />
                <h3 className='text-paragraph-7-mobile text-grey-100 xl:text-paragraph-7-desktop'>
                    {t('commitment.description')}
                </h3>
            </div>
            <div className='sticky top-0 z-0 h-[290px] overflow-hidden xl:h-[560px]'>
                <Image
                    src={image || '/images/home/commitment.webp'}
                    alt='commitment'
                    fill
                    className='h-[290px] object-cover object-bottom xl:h-[560px]'
                />
            </div>
            {/* Spacer gives sticky room. Negative margin-bottom on section pulls next
                section up so it overlaps the pinned image (replicates GSAP pinSpacing:false) */}
            <div className='h-[50vh] xl:h-[100vh]' aria-hidden='true' />
        </section>
    )
}

export default Commitment
