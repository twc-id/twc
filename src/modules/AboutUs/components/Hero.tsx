import Container from '@components/Container'
import { motion } from 'motion/react'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'

const Hero = ({ image }: { image?: string }) => {
    const { t } = useTranslation('about')

    return (
        <section
            className='relative h-dvh w-full'
            style={{
                backgroundImage: `linear-gradient(180deg, rgba(1, 1, 1, 0) 30%, #010101 90%), url('${image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: 'translate(0px, 0px) !important'
            }}
        >
            <div className='absolute inset-x-0 bottom-6 z-10 xl:bottom-16'>
                <Container>
                    <div className='flex w-full flex-col items-start justify-between gap-6 xl:flex-row xl:items-end xl:gap-4'>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                            className='xl:text-heading-1-2-desktop text-heading-1-2-mobile text-grey-white xl:w-[700px]'
                        >
                            <Trans i18nKey='hero.title' components={{ br: <br className='' /> }}>
                                {t('hero.title')}
                            </Trans>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                            className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile line-clamp-3 w-[288px]'
                        >
                            {t('hero.description')}
                        </motion.p>
                    </div>
                </Container>
            </div>
        </section>
    )
}

export default Hero
