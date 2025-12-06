import Seo from '@components/Seo'
import { ThemeProvider } from '@contexts/ThemeContext'
import React from 'react'

import Commitment from './components/Commitment'
import Hero from './components/Hero'
import Highlight from './components/Highlight'
import Instagram from './components/Instagram'
import Journey from './components/Journey'
import Review from './components/Review'
import SellReserve from './components/SellReserve'
import TimePieceService from './components/TimePieceService'

const Home = () => {
    return (
        <ThemeProvider>
            <div className='relative -mt-20 overflow-hidden'>
                <Seo />
                <Hero />

                <Commitment />
                <Highlight />
                <SellReserve />
                <TimePieceService />
                <Journey />
                <Review />
                <Instagram />
            </div>
        </ThemeProvider>
    )
}

export default Home
