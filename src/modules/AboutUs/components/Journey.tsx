import Container from '@components/Container'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Journey = ({ image }: { image?: string }) => {
    const { t } = useTranslation('about')

    return (
        <section className='bg-grey-white relative z-10 pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'>
            <Container>
                <div className='flex flex-col items-end gap-14 xl:flex-row xl:gap-[133px]'>
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='relative h-[456px] w-full overflow-hidden xl:h-[960px] xl:w-[736px]'
                    >
                        <Image
                            src={image || '/images/about-us/journey.webp'}
                            alt='Our Journey'
                            width={736}
                            height={960}
                            className='h-full w-full object-cover'
                            style={{ maxHeight: '960px' }}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                        className='flex flex-col justify-center gap-6'
                    >
                        <h2 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black'>
                            {t('journey.title')}
                        </h2>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500 max-w-[411px]'>
                            {t('journey.description')}
                        </p>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500 max-w-[411px]'>
                            {t('journey.description_2')}
                        </p>
                    </motion.div>
                </div>
            </Container>
        </section>
    )
}

export default Journey
