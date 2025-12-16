import Footer from '@components/Footer'
import Seo from '@components/Seo'
import CTA from '@modules/Reserve/components/CTA'
import Hero from '@modules/Reserve/components/Hero'
import HowToReserve from '@modules/Reserve/components/HowToReserve'
import ImagePin from '@modules/Reserve/components/ImagePin'
import ReserveTimepiece from '@modules/Reserve/components/ReserveTimepiece'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Reserve = () => {
    const { t } = useTranslation('reserve')

    return (
        <div className='relative -mt-20 overflow-hidden'>
            <Seo title={t('title')} />
            <Hero />
            <ReserveTimepiece />
            <ImagePin />
            <HowToReserve />
            <CTA />
            <Footer />
        </div>
    )
}

export default Reserve
