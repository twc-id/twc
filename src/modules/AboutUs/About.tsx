import Seo from '@components/Seo'
import { ThemeProvider } from '@contexts/ThemeContext'
import CTA from '@modules/AboutUs/components/CTA'
import Hero from '@modules/AboutUs/components/Hero'
import Journey from '@modules/AboutUs/components/Journey'
import Location from '@modules/AboutUs/components/Location'
import Service from '@modules/AboutUs/components/Service'
import WhiteSpace from '@modules/AboutUs/components/WhiteSpace'
import { useTranslation } from 'next-i18next'
import React from 'react'

const About = () => {
    const { t } = useTranslation('about')
    return (
        <ThemeProvider>
            <div className='relative -mt-20 overflow-hidden'>
                <Seo title={t('title')} />
                <Hero />
                <WhiteSpace />
                <Journey />
                <Service />
                <Location />
                <CTA />
            </div>
        </ThemeProvider>
    )
}

export default About
