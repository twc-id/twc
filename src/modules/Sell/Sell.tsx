import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import Benefit from '@modules/Sell/components/Benefit'
import Consign from '@modules/Sell/components/Consign'
import CTA from '@modules/Sell/components/CTA'
import Faq from '@modules/Sell/components/Faq'
import Hero from '@modules/Sell/components/Hero'
import HowToSell from '@modules/Sell/components/HowToSell'
import WhiteSpace from '@modules/Sell/components/WhiteSpace'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Sell = () => {
    const { t } = useTranslation('sell')
    const { assets } = useAssets()

    const heroImage = assets?.find((asset) => asset.name === 'sell-1')?.media.url
    const howToSellImage1 = assets?.find((asset) => asset.name === 'sell-2')?.media.url
    const howToSellImage2 = assets?.find((asset) => asset.name === 'sell-3')?.media.url
    const howToSellImage3 = assets?.find((asset) => asset.name === 'sell-4')?.media.url
    const howToSellImage4 = assets?.find((asset) => asset.name === 'sell-5')?.media.url
    const sellPin = assets?.find((asset) => asset.name === 'sell-6')?.media.url
    const consignImage1 = assets?.find((asset) => asset.name === 'sell-7')?.media.url
    const consignImage2 = assets?.find((asset) => asset.name === 'sell-8')?.media.url
    const consignImage3 = assets?.find((asset) => asset.name === 'sell-9')?.media.url
    const consignImage4 = assets?.find((asset) => asset.name === 'sell-10')?.media.url
    const ctaImage = assets?.find((asset) => asset.name === 'sell-11')?.media.url

    return (
        <>
            <Seo title={t('title')} />
            <Hero image={heroImage} />
            <WhiteSpace />
            <Benefit />
            <HowToSell
                images={{
                    step1: howToSellImage1,
                    step2: howToSellImage2,
                    step3: howToSellImage3,
                    step4: howToSellImage4,
                    pin: sellPin
                }}
            />
            <Consign
                images={{
                    step1: consignImage1,
                    step2: consignImage2,
                    step3: consignImage3,
                    step4: consignImage4
                }}
            />
            <Faq />
            <CTA image={ctaImage} />
        </>
    )
}

export default Sell
