import Container from '@components/Container'
import Icons from '@components/Icon'
import { getWhatsAppLinkFromTemplate } from '@utils/whatsapp'
import { motion } from 'motion/react'
import { useTranslation } from 'next-i18next'
import React from 'react'

const Location = () => {
    const { t } = useTranslation('about')

    return (
        <section className='bg-grey-white pb-16 pt-14 xl:py-[116px]' id='location'>
            <Container>
                <div className='flex flex-col items-center gap-8 xl:flex-row xl:gap-[120px]'>
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='flex w-full flex-col gap-9'
                    >
                        <h2 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black'>
                            {t('location.title')}
                        </h2>
                        <div className=' flex flex-row gap-2'>
                            <Icons icon='Pin' width={24} height={24} />
                            <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500'>
                                Jl. Pantai Mutiara Regatta Blok TG1 B-C, Pluit, Kecamatan Penjaringan, Jakarta Utara,
                                Daerah Khusus Ibukota Jakarta 14450
                            </p>
                        </div>
                        <div className='hidden grid-cols-2 grid-rows-2 gap-x-[72px] gap-y-6 xl:grid'>
                            <div className='flex flex-row items-center gap-4'>
                                <Icons icon='Email' width={32} height={32} />
                                <a
                                    href='mailto:support@thewatchcollections.com'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500'
                                >
                                    support@thewatchcollections.com
                                </a>
                            </div>
                            <div className='flex flex-row items-center gap-4'>
                                <Icons icon='Whatsapp' width={32} height={32} />
                                <a
                                    href={getWhatsAppLinkFromTemplate('aboutUs')}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500'
                                >
                                    +62 812 1396 688
                                </a>
                            </div>
                            <div className='flex flex-row items-center gap-4'>
                                <Icons icon='Instagram' width={32} height={32} />
                                <a
                                    href='https://instagram.com/thewatchcollections'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500'
                                >
                                    @thewatchcollections
                                </a>
                            </div>
                        </div>
                    </motion.div>
                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.2 }}
                        className='w-full'
                    >
                        <iframe
                            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.2537141670164!2d106.78613268380873!3d-6.096489678135313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1d86895b6c51%3A0x1783317c43ba9423!2sTWC%20-%20The%20Watch%20Collections!5e0!3m2!1sid!2sid!4v1765118418097!5m2!1sid!2sid'
                            style={{ border: 0, filter: 'grayscale(100%)' }}
                            allowFullScreen={false}
                            className='h-[233px] w-full xl:h-[366px]'
                            loading='lazy'
                            referrerPolicy='no-referrer-when-downgrade'
                        ></iframe>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1], delay: 0.3 }}
                        className='flex w-full flex-col gap-6 xl:hidden'
                    >
                        <div className='flex flex-row items-center gap-4'>
                            <Icons icon='Email' width={32} height={32} />
                            <a
                                href='mailto:support@thewatchcollections.com'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-paragraph-7-desktop text-grey-500'
                            >
                                support@thewatchcollections.com
                            </a>
                        </div>
                        <div className='flex flex-row items-center gap-4'>
                            <Icons icon='Whatsapp' width={32} height={32} />
                            <a
                                href={getWhatsAppLinkFromTemplate('aboutUs')}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-paragraph-7-desktop text-grey-500'
                            >
                                +62 812 1396 688
                            </a>
                        </div>
                        <div className='flex flex-row items-center gap-4'>
                            <Icons icon='Instagram' width={32} height={32} />
                            <a
                                href='https://instagram.com/thewatchcollections'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-paragraph-7-desktop text-grey-500'
                            >
                                @thewatchcollections
                            </a>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    )
}

export default Location
