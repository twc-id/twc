import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Journey = ({ image }: { image?: string }) => {
    const { t } = useTranslation('about')
    const sectionRef = useRef<HTMLElement>(null)
    const leftRef = useRef<HTMLDivElement>(null)
    const textref = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Tunggu sampai semua layout stabil
        const initScrollTrigger = () => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'restart none none reset'
                }
            })
            // Animasi kanan fade in
            timeline.fromTo(
                leftRef.current,
                { opacity: 0, x: -60 },
                { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
            )

            timeline.fromTo(
                textref.current,
                { opacity: 0, x: 60 },
                { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
            )
        }

        // Delay initialization untuk memastikan layout component lain sudah stabil
        const timer = setTimeout(() => {
            initScrollTrigger()
            // Refresh semua ScrollTrigger setelah inisialisasi
            ScrollTrigger.refresh()
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return (
        <section className='bg-grey-white relative z-10 pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]' ref={sectionRef}>
            <Container>
                <div className='flex flex-col items-end gap-14 xl:flex-row xl:gap-[133px]'>
                    <div className='relative h-[456px] w-full overflow-hidden xl:h-[960px] xl:w-[736px]' ref={leftRef}>
                        <Image
                            src={image || '/images/about-us/journey.webp'}
                            alt='Our Journey'
                            width={736}
                            height={960}
                            className='h-full w-full object-cover'
                            style={{ maxHeight: '960px' }}
                        />
                    </div>
                    <div className='flex flex-col justify-center gap-6' ref={textref}>
                        <h2 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-black'>
                            {t('journey.title')}
                        </h2>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500 max-w-[411px]'>
                            {t('journey.description')}
                        </p>
                        <p className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-500 max-w-[411px]'>
                            {t('journey.description_2')}
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Journey
