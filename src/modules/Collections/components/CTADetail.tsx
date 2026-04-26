import Button from '@components/buttons/Button'
import Container from '@components/Container'
import listLocation from '@constant/location'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import useProductStore from '@store/useProductStore'
import { getWhatsAppLinkFromTemplate } from '@utils/whatsapp'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Trans, useTranslation } from 'next-i18next'
import React from 'react'

const CTADetail = ({ image }: { image?: string }) => {
    const { t } = useTranslation('collection')
    const router = useRouter()
    const currentProduct = useProductStore((s) => s.currentProduct)
    const articlePath = router.pathname.startsWith('/articles/')
    const productDetailPath = router.pathname.startsWith('/collections/')
    const pageTitle = typeof window !== 'undefined' ? document.title : router.pathname
    const locationMatch = listLocation.find((loc) => {
        if (loc.path.endsWith('/*')) {
            const basePath = loc.path.replace('/*', '')
            return router.pathname.startsWith(basePath)
        }
        return router.pathname === loc.path
    })

    return (
        <section className='bg-grey-white pb-14 xl:pb-[116px]'>
            <Container>
                <div className='bg-grey-black relative flex h-full w-full flex-col items-center gap-14 overflow-hidden xl:flex-row xl:justify-end'>
                    <div className='absolute left-0 z-10 flex w-auto flex-col items-start gap-5 px-5 pt-8 xl:max-w-[380px] xl:gap-6 xl:pl-20 xl:pr-0'>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                            className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white'
                        >
                            <Trans i18nKey='cta.title' components={{ br: <br /> }}>
                                {t('cta_detail.title')}
                            </Trans>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                            className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-100'
                        >
                            {t('cta_detail.description')}
                        </motion.p>

                        <a
                            href={getWhatsAppLinkFromTemplate('listProduct')}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() => {
                                const productName = currentProduct?.name || document.title || ''
                                if (articlePath || productDetailPath) {
                                    trackEvent(GA_EVENTS.CONTACT_WA, {
                                        'Button Title': productDetailPath ? productName : pageTitle,
                                        'Button Location': 'CTA above footer',
                                        'Button Page': locationMatch?.label
                                    })
                                } else {
                                    trackEvent(GA_EVENTS.CONTACT_WA, {
                                        'Button Location': 'CTA above footer',
                                        'Button Page': locationMatch?.label
                                    })
                                }
                            }}
                        >
                            <Button
                                variant='secondary'
                                className='!bg-grey-white xl:!text-button-3-desktop !text-button-3-mobile !rounded-none'
                            >
                                {t('common:learn_more')}
                            </Button>
                        </a>
                    </div>

                    <div className='hidden h-[595px] w-full xl:block'>
                        <Image
                            src={image || '/images/collections/cta-detail.webp'}
                            alt='Article CTA'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='h-full w-full'
                            style={{ objectFit: 'contain', objectPosition: 'right' }}
                        />
                        <div
                            className='absolute inset-0'
                            style={{
                                background: 'linear-gradient(270deg, rgba(1, 1, 1, 0) 20%, #010101 100%)'
                            }}
                        />
                    </div>
                    <div className='relative block h-[448px] w-auto xl:hidden'>
                        <Image
                            src={image || '/images/collections/cta-detail.webp'}
                            alt='Article CTA'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='h-full w-auto'
                            style={{ objectFit: 'cover' }}
                        />

                        <div
                            className='absolute inset-0'
                            style={{
                                background: `linear-gradient(270deg, rgba(1, 1, 1, 0) 58.4%, #010101 100%),
linear-gradient(180deg, rgba(1, 1, 1, 0) 59.44%, #010101 99.87%),
linear-gradient(0deg, rgba(1, 1, 1, 0) 56.25%, #010101 91.3%),
linear-gradient(90deg, rgba(1, 1, 1, 0) 66.6%, #010101 99.98%)`
                            }}
                        />
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default CTADetail
