import Button from '@components/buttons/Button'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const CTA = () => {
    const { t } = useTranslation('common')
    const sectionRef = useRef<HTMLDivElement>(null)
    const headingref = useRef<HTMLHeadingElement>(null)
    const paragraphRef = useRef<HTMLParagraphElement>(null)

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                id: 'home-cta-animation',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(
            [headingref.current, paragraphRef.current],
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 1, ease: 'power2.out', stagger: 0.3 }
        )

        return () => {
            timeline.scrollTrigger?.kill()
        }
    }, [])
    return (
        <section className='bg-grey-white pb-14 xl:pb-[116px]' ref={sectionRef}>
            <div className='bg-grey-black relative flex h-full w-full flex-col items-center gap-14 overflow-hidden xl:flex-row xl:justify-between xl:gap-0'>
                <div className='flex max-w-[460px] flex-col items-start gap-5 px-5 pt-8 xl:gap-6 xl:pl-20 xl:pr-0'>
                    <h2 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white' ref={headingref}>
                        <Trans i18nKey='header.cta.title' components={{ br: <br /> }}>
                            {t('header.cta.title')}
                        </Trans>
                    </h2>

                    <p className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-100' ref={paragraphRef}>
                        {t('header.cta.description')}
                    </p>

                    <a
                        href='https://wa.me/628121396688?text=Hello%20TheWatchCollections%2C'
                        target='_blank'
                        rel='noopener noreferrer'
                    >
                        <Button
                            variant='secondary'
                            className='!bg-grey-white xl:!text-button-3-desktop !text-button-3-mobile !rounded-none'
                        >
                            {t('header.cta.contact_us')}
                        </Button>
                    </a>
                </div>

                <div
                    style={{
                        background: 'linear-gradient(270deg, rgba(1, 1, 1, 0) 52.44%, #010101 100%)'
                    }}
                    className='hidden h-[595px] w-full xl:block'
                >
                    <Image
                        src='/images/navbar/cta.webp'
                        alt='Article CTA'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-full w-full'
                    />
                </div>
                <div
                    style={{
                        background: `linear-gradient(270deg, rgba(1, 1, 1, 0) 58.4%, #010101 100%), 
linear-gradient(180deg, rgba(1, 1, 1, 0) 59.44%, #010101 99.87%), 
linear-gradient(0deg, rgba(1, 1, 1, 0) 56.25%, #010101 91.3%), 
linear-gradient(90deg, rgba(1, 1, 1, 0) 66.6%, #010101 99.98%)`
                    }}
                    className='block h-[248px] xl:hidden'
                >
                    <Image
                        src='/images/navbar/cta.webp'
                        alt='Article CTA'
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-full w-auto'
                    />
                </div>
            </div>
        </section>
    )
}

export default CTA
