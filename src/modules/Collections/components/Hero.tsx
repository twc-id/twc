import Container from '@components/Container'
import { motion } from 'motion/react'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'

const Hero = ({ image }: { image?: string }) => {
    const { t } = useTranslation('collection')

    return (
        <section
            className='relative h-[50dvh] w-full xl:h-[80dvh] '
            style={{
                backgroundImage: `radial-gradient(97.37% 97.37% at 77.39% 40.5%, rgba(1, 1, 1, 0) 0%, #010101 100%), url('${image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className='absolute inset-x-0 bottom-5 z-10 xl:bottom-[80px]'>
                <Container>
                    <div className='flex w-full flex-col   gap-6  xl:gap-2'>
                        <motion.h1
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                            className='xl:text-heading-1-3-desktop text-heading-1-3-mobile text-grey-white line-clamp-4 xl:line-clamp-3'
                        >
                            <Trans i18nKey='collection:hero.title' components={{ br: <br className='' /> }}>
                                {t('hero.title')}
                            </Trans>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                            className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile line-clamp-2 xl:w-[514px]'
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
