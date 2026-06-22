import Container from '@components/Container'
import { useTranslation } from 'next-i18next'
import React from 'react'

const WhiteSpace = () => {
    const { t } = useTranslation('sell')

    return (
        <section>
            <Container className='pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'>
                <p className='xl:text-subheading-1-desktop text-subheading-1-mobile text-grey-500 dark:text-grey-200 xl:w-[520px]'>
                    {t('white_space.description')}
                </p>
            </Container>
        </section>
    )
}

export default WhiteSpace
