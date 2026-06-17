import Button from '@components/buttons/Button'
import Container from '@components/Container'
import UnstyledLink from '@components/links/UnstyledLink'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'

const Journey = ({ image }: { image?: string }) => {
    const { t } = useTranslation('home')

    return (
        <section className='bg-grey-black relative z-0 -mb-[150px] xl:-mb-[300px]'>
            <Container className='pb-16 xl:pb-[116px]'>
                <div className='flex w-full flex-col gap-4 xl:flex-row xl:justify-between'>
                    <div className='flex flex-shrink-0 flex-col gap-4'>
                        <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white '>
                            <Trans i18nKey='cta.title' components={{ br: <br /> }}>
                                {t('journey.title')}
                            </Trans>
                        </h1>
                        <div className='hidden xl:block'>
                            <UnstyledLink href='/about-us'>
                                <Button>{t('journey.learn_our_story')}</Button>
                            </UnstyledLink>
                        </div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='flex  flex-col gap-6 xl:flex-row'
                    >
                        <span className='text-grey-200 xl:text-paragraph-7-desktop text-paragraph-7-mobile w-full max-w-[400px]'>
                            <Trans i18nKey='journey.desc_1' components={{ br: <br /> }}>
                                {t('journey.desc_1')}
                            </Trans>
                        </span>
                        <span className='text-grey-200 xl:text-paragraph-7-desktop text-paragraph-7-mobile w-full max-w-[400px]'>
                            <Trans i18nKey='journey.desc_2' components={{ br: <br /> }}>
                                {t('journey.desc_2')}
                            </Trans>
                        </span>
                    </motion.div>
                    <div className='block xl:hidden'>
                        <Button>{t('common:learn_more')}</Button>
                    </div>
                </div>
            </Container>
            <div className='sticky top-0 z-0 h-[290px] w-full xl:h-[560px]'>
                <Image src={image || ''} alt='journey' fill className='h-[560px] object-cover object-bottom' />
            </div>
            {/* Spacer for sticky pin duration */}
            <div className='h-[150px] xl:h-[300px]' aria-hidden='true' />
        </section>
    )
}

export default Journey
