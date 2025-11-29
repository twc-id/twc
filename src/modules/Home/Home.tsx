import Seo from '@components/Seo'
import React from 'react'

import Commitment from './components/Commitment'
import Hero from './components/Hero'
import Highlight from './components/Highlight'
import SellReserve from './components/SellReserve'

const Home = () => {
    return (
        <div className='bg-grey-white -mt-20'>
            <Seo />
            <Hero />
            <Commitment />
            <Highlight />
            <SellReserve />
        </div>
    )
}

export default Home
