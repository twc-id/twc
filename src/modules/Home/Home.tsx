/* eslint-disable no-console */
import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import React from 'react'

import Commitment from './components/Commitment'
import CTA from './components/CTA'
import Hero from './components/Hero'
import Highlight from './components/Highlight'
import Journey from './components/Journey'
import Review from './components/Review'
import SellReserve from './components/SellReserve'
import SocialMedia from './components/SocialMedia'
import TimePieceService from './components/TimePieceService'

const Home = () => {
    const { assets } = useAssets()
    const commitmentImage = assets?.find((asset) => asset.name === 'home-1')?.media?.url
    const journeyImage = assets?.find((asset) => asset.name === 'home-2')?.media?.url
    const ctaImage = assets?.find((asset) => asset.name === 'home-3')?.media?.url
    const sellImage = assets?.find((asset) => asset.name === 'home-4')?.media?.url
    const reviewImage = assets?.find((asset) => asset.name === 'home-5')?.media?.url

    const service1Image = assets?.find((asset) => asset.name === 'home-service-6')?.media?.url
    const service2Image = assets?.find((asset) => asset.name === 'home-service-7')?.media?.url
    const service3Image = assets?.find((asset) => asset.name === 'home-service-8')?.media?.url

    const showTestimonial = process.env.NEXT_PUBLIC_SHOW_TESTIMONIAL === 'true'
    const showNewInInstagram = process.env.NEXT_PUBLIC_SHOW_NEW_IN_INSTAGRAM === 'true'

    return (
        <>
            <Seo />
            <Hero />
            <Commitment image={commitmentImage} />
            <Highlight />
            <SellReserve sell={sellImage} reserve={reviewImage} />
            <TimePieceService service1={service1Image} service2={service2Image} service3={service3Image} />
            <Journey image={journeyImage} />
            {showTestimonial && <Review />}
            {showNewInInstagram && <SocialMedia />}

            <CTA image={ctaImage} showNewInInstagram={showNewInInstagram} />
        </>
    )
}

export default Home
