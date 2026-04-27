import Button from '@components/buttons/Button'
import Container from '@components/Container'
import listLocation from '@constant/location'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import { getWhatsAppLinkFromTemplate } from '@utils/whatsapp'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'

const HowToReserve = ({
    reserveImage1,
    reserveImage2,
    reserveImage3,
    reserveImage4
}: {
    reserveImage1?: string
    reserveImage2?: string
    reserveImage3?: string
    reserveImage4?: string
}) => {
    const { t } = useTranslation('reserve')

    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const router = useRouter()
    const locationMatch = listLocation.find((loc) => {
        if (loc.path.endsWith('/*')) {
            const basePath = loc.path.replace('/*', '')
            return router.pathname.startsWith(basePath)
        }
        return router.pathname === loc.path
    })

    const items = [
        {
            title: t('how_to_reserve.steps.1.title'),
            description: t('how_to_reserve.steps.1.description'),
            image: reserveImage1
        },
        {
            title: t('how_to_reserve.steps.2.title'),
            description: t('how_to_reserve.steps.2.description'),
            image: reserveImage2
        },
        {
            title: t('how_to_reserve.steps.3.title'),
            description: t('how_to_reserve.steps.3.description'),
            image: reserveImage3
        },
        {
            title: t('how_to_reserve.steps.4.title'),
            description: t('how_to_reserve.steps.4.description'),
            image: reserveImage4
        }
    ]

    const handleScroll = () => {
        if (!scrollContainerRef.current) return

        const container = scrollContainerRef.current
        const itemWidth = 288 + 24 // item width + gap
        const scrollLeft = container.scrollLeft
        const index = Math.round(scrollLeft / itemWidth)

        setActiveIndex(Math.min(index, items.length - 1))
    }

    const scrollToItem = (index: number) => {
        if (!scrollContainerRef.current) return

        const container = scrollContainerRef.current
        const itemWidth = 288 + 24 // item width + gap
        const scrollLeft = index * itemWidth

        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        })
    }

    return (
        <section className='bg-grey-black relative z-10'>
            <Container className='pb-16 pt-14 xl:pb-40 xl:pt-[116px]'>
                <div className='flex flex-col items-center gap-14 xl:gap-20'>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='flex w-full flex-col items-start justify-between gap-5 xl:flex-row xl:items-center'
                    >
                        <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white  xl:max-w-[574px]'>
                            {t('how_to_reserve.title')}
                        </h1>
                        <a
                            href={getWhatsAppLinkFromTemplate('howToReserve')}
                            target='_blank'
                            rel='noopener noreferrer'
                            onClick={() =>
                                trackEvent(GA_EVENTS.CONTACT_WA, {
                                    'Button Location': 'How To Reserve',
                                    'Button Page': locationMatch?.label
                                })
                            }
                        >
                            <Button className='h-full w-fit'>{t('cta.button')}</Button>
                        </a>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                        className='scrollbar-none flex w-full snap-x snap-mandatory flex-row justify-between gap-6 overflow-x-auto scroll-smooth xl:snap-none xl:overflow-x-visible'
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                    >
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className='flex min-w-[280px] snap-center flex-col items-start gap-4 xl:min-w-0 xl:snap-align-none xl:gap-6'
                            >
                                <div className='border-grey-white text-grey-white flex h-8 w-8 items-center justify-center rounded-full border py-1.5'>
                                    {index + 1}
                                </div>
                                <div className='h-[384px] w-[288px] xl:h-[402px] xl:w-[302px]'>
                                    <Image
                                        src={item.image || ''}
                                        alt={item.title}
                                        width={302}
                                        height={402}
                                        className='h-full w-full object-cover'
                                        unoptimized
                                        priority
                                    />
                                </div>
                                <div className='flex max-w-[280px] flex-col gap-1 xl:max-w-[302px]'>
                                    <h4 className='xl:text-subheading-4-desktop text-subheading-4-mobile text-grey-white'>
                                        {item.title}
                                    </h4>
                                    <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-200'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                    <div className='flex flex-row items-center gap-2 xl:hidden'>
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => scrollToItem(index)}
                                className={`mx-1 rounded-full transition-all duration-300 focus:outline-none ${
                                    index === activeIndex ? 'bg-grey-white h-1.5 w-1.5' : 'bg-grey-200 h-1 w-1'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default HowToReserve
