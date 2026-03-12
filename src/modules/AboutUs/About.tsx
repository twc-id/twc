import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import CTA from '@modules/AboutUs/components/CTA'
import Hero from '@modules/AboutUs/components/Hero'
import Journey from '@modules/AboutUs/components/Journey'
import Location from '@modules/AboutUs/components/Location'
import Service from '@modules/AboutUs/components/Service'
import WhiteSpace from '@modules/AboutUs/components/WhiteSpace'
import { useTranslation } from 'next-i18next'
import React from 'react'

const About = () => {
    const { t } = useTranslation('about')
    const { assets } = useAssets()
    console.log('Assets:', assets) // Log the assets to verify the data structure
    const heroBanner = assets?.find((asset) => asset.name === 'about-us-hero')?.media?.url
    const whiteSpaceImage = assets?.find((asset) => asset.name === 'about-us-1')?.media?.url
    const journeyImage = assets?.find((asset) => asset.name === 'about-us-2')?.media?.url
    const serviceImage = assets?.find((asset) => asset.name === 'about-us-3')?.media?.url
    const cta = assets?.find((asset) => asset.name === 'about-us-4')?.media?.url

    return (
        <>
            <Seo title={t('title')} />
            <Hero image={heroBanner} />
            <WhiteSpace image={whiteSpaceImage} />
            <Journey image={journeyImage} />
            <Service image={serviceImage} />
            <Location />
            <CTA image={cta} />
        </>
    )
}

export default About
