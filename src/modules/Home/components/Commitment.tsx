import Icons from '@components/Icon'
import Image from 'next/image'
import React from 'react'

const Commitment = () => {
    return (
        <>
            <div className='bg-grey-black relative flex flex-col items-center justify-center gap-6 text-center xl:py-[160px]'>
                <h1 className='text-heading-2-desktop text-grey-white'>Rarity, Quality, Collectability</h1>
                <Icons icon='Diamond' className='text-grey-100' />
                <h3 className='text-paragraph-6-desktop text-grey-100'>
                    Connects collectors with luxury watches from around the world
                </h3>
            </div>
            <div className='relative h-[560px]'>
                <Image src='/images/home/commitment.webp' alt='commitment' fill />
            </div>
        </>
    )
}

export default Commitment
