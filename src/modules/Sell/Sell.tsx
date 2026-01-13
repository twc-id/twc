import Seo from '@components/Seo'
import Benefit from '@modules/Sell/components/Benefit'
import Consign from '@modules/Sell/components/Consign'
import CTA from '@modules/Sell/components/CTA'
import Faq from '@modules/Sell/components/Faq'
import Hero from '@modules/Sell/components/Hero'
import HowToSell from '@modules/Sell/components/HowToSell'
import WhiteSpace from '@modules/Sell/components/WhiteSpace'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Sell = () => {
    const { t } = useTranslation('sell')

    return (
        <>
            <Seo title={t('title')} />
            <Hero />
            <WhiteSpace />
            <Benefit />
            <HowToSell />
            <Consign />

            <Faq />
            <CTA />
        </>
    )
}

export default Sell
