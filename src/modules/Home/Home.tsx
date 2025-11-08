import Container from '@components/Container'
import Seo from '@components/Seo'
import React from 'react'

const Home = () => {
    return (
        <>
            <Seo />
            <Container>
                <div className='min-h-screen'>Home</div>
            </Container>
        </>
    )
}

export default Home
