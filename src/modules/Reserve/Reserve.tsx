import CTA from '@modules/Reserve/components/CTA'
import Hero from '@modules/Reserve/components/Hero'
import HowToReserve from '@modules/Reserve/components/HowToReserve'
import ImagePin from '@modules/Reserve/components/ImagePin'
import ReserveTimepiece from '@modules/Reserve/components/ReserveTimepiece'
import React from 'react'

const Reserve = () => {
    return (
        <div className='bg-grey-black relative -mt-20 overflow-hidden'>
            <Hero />

            <ReserveTimepiece />
            <ImagePin />
            <HowToReserve />
            <CTA />
        </div>
    )
}

export default Reserve
