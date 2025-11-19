import Container from '@components/Container'
import Seo from '@components/Seo'
import Commitment from '@modules/Home/components/Commitment'
import Hero from '@modules/Home/components/Hero'
import React from 'react'

const Home = () => {
    return (
        <div className='-mt-20'>
            <Seo />
            <Hero />
            <Commitment />
            <Container>asdas</Container>
        </div>
    )
}

export default Home
