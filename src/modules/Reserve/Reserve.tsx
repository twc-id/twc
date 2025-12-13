import Hero from '@modules/Reserve/components/Hero'
import ReserveTimepiece from '@modules/Reserve/components/ReserveTimepiece'
import React from 'react'

const Reserve = () => {
    return (
        <div className='bg-grey-black relative -mt-20 overflow-hidden'>
            <Hero />

            <ReserveTimepiece />
        </div>
    )
}

export default Reserve
