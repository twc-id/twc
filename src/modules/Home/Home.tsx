/* eslint-disable no-console */
import Seo from '@components/Seo'
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
    return (
        <>
            <Seo />
            <Hero />
            <Commitment />
            <Highlight />
            <SellReserve />
            <TimePieceService />
            <Journey />
            <Review />
            <SocialMedia />
            <CTA />
        </>
    )
}

export default Home
