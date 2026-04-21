import Image from 'next/image'
import React from 'react'

const ImagePin = ({ image }: { image?: string }) => {
    return (
        <section className='relative z-0 -mb-[300px] xl:-mb-[560px]'>
            <div className='sticky top-0 z-0 h-[300px] w-full xl:h-[560px]'>
                <Image
                    priority
                    src={image || ''}
                    alt='The Watch Collections'
                    fill
                    className='object-cover'
                    unoptimized
                />
            </div>
            {/* Spacer for sticky pin duration */}
            <div className='h-[300px] xl:h-[560px]' aria-hidden='true' />
        </section>
    )
}

export default ImagePin
