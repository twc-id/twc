import Container from '@components/Container'
import { useTheme } from '@contexts/ThemeContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Service = ({ image }: { image?: string }) => {
    const { t } = useTranslation('about')
    const sectionRef = useRef<HTMLElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)
    const textref = useRef<HTMLDivElement>(null)
    const quoteRef = useRef<HTMLHeadingElement>(null)
    const founderRef = useRef<HTMLParagraphElement>(null)
    const { setIsDarkSection } = useTheme()

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom top',
            onEnter: () => setIsDarkSection(true),
            onLeaveBack: () => setIsDarkSection(false),
            onEnterBack: () => setIsDarkSection(true)
        })

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(rightRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' })

        timeline.fromTo(
            textref.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
            '-=0.5' // overlap with previous animation
        )

        timeline.fromTo(
            quoteRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
            '-=0.5' // overlap with previous animation
        )

        timeline.fromTo(
            founderRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
            '-=0.5' // overlap with previous animation
        )
    }, [])
    return (
        <section ref={sectionRef} className='pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'>
            <Container className='flex flex-col items-center gap-16 xl:gap-[160px]'>
                <div className='flex flex-col gap-14  xl:flex-row xl:gap-[133px]'>
                    <div ref={textref} className='flex max-w-[411px] flex-col gap-6 xl:gap-4'>
                        <h2 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black dark:text-grey-white'>
                            {t('service.title')}
                        </h2>
                        <p className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-200 max-w-2xl'>
                            <Trans i18nKey='service.description' components={{ br: <br className='mb-2' /> }}>
                                {t('service.description')}
                            </Trans>
                        </p>
                    </div>
                    <div className='relative overflow-hidden xl:h-[511px] xl:w-[736px]' ref={rightRef}>
                        <Image
                            src={image || '/images/about-us/service.webp'}
                            alt='The Watch Collections Services'
                            width={736}
                            height={511}
                            // className='h-auto w-full object-cover'
                        />
                    </div>
                </div>
                <div className='flex flex-col gap-8 text-center xl:max-w-[720px] xl:gap-10'>
                    <h3
                        className='xl:text-paragraph-3-desktop text-paragraph-3-mobile text-grey-black dark:text-grey-white line-clamp-[7] xl:line-clamp-3'
                        ref={quoteRef}
                    >
                        {t('service.quote')}
                    </h3>
                    <p className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-200' ref={founderRef}>
                        {t('service.founder')}
                    </p>
                </div>
            </Container>
        </section>
    )
}

export default Service
