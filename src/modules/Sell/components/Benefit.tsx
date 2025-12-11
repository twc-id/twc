import Container from '@components/Container'
import Icons, { IconType } from '@components/Icon'
import { useTheme } from '@contexts/ThemeContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Benefit = () => {
    const { t } = useTranslation('sell')
    const { setIsDarkSection } = useTheme()
    const sectionRef = useRef<HTMLElement>(null)

    const items = [
        {
            icon: 'DiamondLine',
            title: t('benefit.items.1.title'),
            description: t('benefit.items.1.description')
        },
        {
            icon: 'Watch',
            title: t('benefit.items.2.title'),
            description: t('benefit.items.2.description')
        },
        {
            icon: 'ChecklistLine',
            title: t('benefit.items.3.title'),
            description: t('benefit.items.3.description')
        }
    ]

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom top',
            onEnter: () => setIsDarkSection(true),
            onLeaveBack: () => setIsDarkSection(false),
            onEnterBack: () => setIsDarkSection(true)
        })
    }, [])
    return (
        <section ref={sectionRef} className='pb-14 xl:pb-[116px]'>
            <Container className=''>
                <div className='flex flex-col justify-between gap-10 xl:flex-row xl:gap-[120px]'>
                    {items.map((item) => (
                        <div className='flex flex-row gap-5 xl:flex-col xl:gap-3.5' key={item.title}>
                            <Icons
                                icon={item.icon as IconType}
                                width={40}
                                height={40}
                                className='text-accent-price-dark'
                            />
                            <div className='flex flex-col gap-1'>
                                <h4 className='xl:text-subheading-4-desktop text-subheading-4-mobile text-grey-black dark:text-grey-white'>
                                    {item.title}
                                </h4>
                                <span className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-500 dark:text-grey-200'>
                                    {item.description}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}

export default Benefit
