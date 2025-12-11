import Benefit from '@modules/Sell/components/Benefit'
import Consign from '@modules/Sell/components/Consign'
import CTA from '@modules/Sell/components/CTA'
import Faq from '@modules/Sell/components/Faq'
import Hero from '@modules/Sell/components/Hero'
import HowToSell from '@modules/Sell/components/HowToSell'
import WhiteSpace from '@modules/Sell/components/WhiteSpace'
import React from 'react'

const Sell = () => {
    return (
        <div className='relative -mt-20 overflow-hidden'>
            <Hero />
            <WhiteSpace />
            <Benefit />
            <HowToSell />
            <Consign />
            <Faq />
            <CTA />
        </div>
    )
}

export default Sell
