import Container from '@components/Container'
import { motion } from 'motion/react'
import { useTranslation } from 'next-i18next'
import React from 'react'

const WhiteSpace = () => {
    const { t } = useTranslation('sell')

    return (
        <section>
            <Container className='pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                    className='xl:text-subheading-1-desktop text-subheading-1-mobile text-grey-500 dark:text-grey-200 xl:w-[520px]'
                >
                    {t('white_space.description')}
                </motion.p>
            </Container>
        </section>
    )
}

export default WhiteSpace
