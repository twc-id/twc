import Container from '@components/Container'
import { motion } from 'motion/react'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'

const Hero = ({ image }: { image?: string }) => {
    const { t } = useTranslation('sell')

    return (
        <section
            className='relative h-[80dvh] w-full'
            style={{
                backgroundImage: `radial-gradient(97.37% 97.37% at 77.39% 40.5%, rgba(1, 1, 1, 0) 0%, #010101 100%), url('${image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className='absolute inset-x-0 bottom-10 z-10 xl:bottom-[72px]'>
                <Container>
                    <div className='flex w-full flex-col justify-end gap-6 xl:items-end xl:gap-2'>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                            className='xl:text-heading-1-2-desktop text-heading-1-2-mobile text-grey-white xl:w-[700px] xl:text-right'
                        >
                            <Trans i18nKey='sell:hero.title' components={{ br: <br className='block xl:hidden' /> }}>
                                {t('hero.title')}
                            </Trans>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                            className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile'
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
