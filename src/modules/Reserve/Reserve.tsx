import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import CTA from '@modules/Reserve/components/CTA'
import Hero from '@modules/Reserve/components/Hero'
import HowToReserve from '@modules/Reserve/components/HowToReserve'
import ImagePin from '@modules/Reserve/components/ImagePin'
import ReserveTimepiece from '@modules/Reserve/components/ReserveTimepiece'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Reserve = () => {
    const { t } = useTranslation('reserve')
    const { assets } = useAssets()
    const heroImage1 = assets?.find((asset) => asset.name === 'reserve-1')?.media?.url
    const heroImage2 = assets?.find((asset) => asset.name === 'reserve-2')?.media?.url
    const heroImage3 = assets?.find((asset) => asset.name === 'reserve-3')?.media?.url
    const reserveImagePin = assets?.find((asset) => asset.name === 'reserve-5')?.media?.url
    const imagePin = assets?.find((asset) => asset.name === 'reserve-6')?.media?.url
    const reserveImage1 = assets?.find((asset) => asset.name === 'reserve-7')?.media?.url
    const reserveImage2 = assets?.find((asset) => asset.name === 'reserve-8')?.media?.url
    const reserveImage3 = assets?.find((asset) => asset.name === 'reserve-9')?.media?.url
    const reserveImage4 = assets?.find((asset) => asset.name === 'reserve-10')?.media?.url
    const ctaImage = assets?.find((asset) => asset.name === 'reserve-11')?.media?.url

    return (
        <div className='bg-grey-black'>
            <Seo title={t('title')} />
            <Hero heroImage1={heroImage1} heroImage2={heroImage2} heroImage3={heroImage3} imagePin={reserveImagePin} />
            <ReserveTimepiece />
            <ImagePin image={imagePin} />
            <HowToReserve
                reserveImage1={reserveImage1}
                reserveImage2={reserveImage2}
                reserveImage3={reserveImage3}
                reserveImage4={reserveImage4}
            />
            <CTA image={ctaImage} />
        </div>
    )
}

export default Reserve
