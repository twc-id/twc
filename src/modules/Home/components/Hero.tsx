import Container from '@components/Container'
import React from 'react'

const Hero = () => {
    return (
        <section
            className='h-[960px]'
            style={{
                backgroundImage:
                    "linear-gradient(180deg, rgba(1, 1, 1, 0) 31.05%, #010101 97.39%), url('/images/home/hero-home.webp')",
                backgroundSize: '100% auto',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <Container className='flex h-full flex-col justify-end gap-2 pb-20'>
                <h3 className='text-paragraph-7-desktop text-grey-white'>CURATED PIECES</h3>
                <h1 className='text-heading-1-desktop text-grey-white'>
                    The RM <br />
                    Collection
                </h1>
                <h3 className='text-paragraph-5-desktop text-grey-200 '>The premium luxury making time your own</h3>
            </Container>
        </section>
    )
}

export default Hero
