import Container from '@components/Container'
import { useTheme } from '@contexts/ThemeContext'
import { motion, useInView } from 'motion/react'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React, { useEffect, useRef } from 'react'

const Service = ({ image }: { image?: string }) => {
    const { t } = useTranslation('about')
    const sectionRef = useRef<HTMLElement>(null)
    const { setIsDarkSection } = useTheme()

    const isInView = useInView(sectionRef, { margin: '-50% 0px -50% 0px' })

    useEffect(() => {
        if (isInView) {
            setIsDarkSection(true)
        } else {
            setIsDarkSection(false)
        }
    }, [isInView, setIsDarkSection])

    return (
        <section ref={sectionRef} className='pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'>
            <Container className='flex flex-col items-center gap-16 xl:gap-[160px]'>
                <div className='flex flex-col gap-14  xl:flex-row xl:gap-[133px]'>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='flex max-w-[411px] flex-col gap-6 xl:gap-4'
                    >
                        <h2 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black dark:text-grey-white'>
                            {t('service.title')}
                        </h2>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200 max-w-2xl'>
                            <Trans i18nKey='service.description' components={{ br: <br className='mb-2' /> }}>
                                {t('service.description')}
                            </Trans>
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                        className='relative overflow-hidden xl:h-[511px] xl:w-[736px]'
                    >
                        <Image
                            src={image || '/images/about-us/service.webp'}
                            alt='The Watch Collections Services'
                            width={736}
                            height={511}
                        />
                    </motion.div>
                </div>
                <div className='flex flex-col gap-8 text-center xl:max-w-[720px] xl:gap-10'>
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='xl:text-paragraph-2-desktop text-paragraph-2-mobile text-grey-black dark:text-grey-white'
                    >
                        {t('service.quote')}
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                        className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200'
                    >
                        {t('service.founder')}
                    </motion.p>
                </div>
            </Container>
        </section>
    )
}

export default Service
