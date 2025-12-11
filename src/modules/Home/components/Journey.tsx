import Button from '@components/buttons/Button'
import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { Trans, useTranslation } from 'next-i18next'
import React, { useEffect, useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Journey = () => {
    const { t } = useTranslation('home')
    const sectionRef = useRef<HTMLElement>(null)
    const rightRef = useRef<HTMLDivElement>(null)
    const imageContainerRef = useRef<HTMLImageElement>(null)

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
                rightRef.current,
                { opacity: 0, x: 60 },
                { opacity: 1, x: 0, duration: 1, ease: 'power2.out' }
            )

            // Pin image dengan refresh dan onRefresh callback
            ScrollTrigger.create({
                trigger: imageContainerRef.current,
                start: 'top top',
                end: 'bottom top',
                pin: true,
                pinnedContainer: sectionRef.current,
                pinSpacing: true,
                id: 'journey-pin',
                refreshPriority: -1, // Lower priority to run after other ScrollTriggers
                onRefresh: () => {
                    // Callback saat refresh terjadi
                }
            })
        }

        // Delay initialization untuk memastikan layout component lain sudah stabil
        const timer = setTimeout(() => {
            initScrollTrigger()
            // Refresh semua ScrollTrigger setelah inisialisasi
            ScrollTrigger.refresh()
        }, 100)

        // Cleanup
        return () => {
            clearTimeout(timer)
            ScrollTrigger.getById('journey-pin')?.kill()
        }
    }, [sectionRef])

    // Effect untuk menangani resize dan refresh ScrollTrigger
    useEffect(() => {
        const handleResize = () => {
            // Delay refresh untuk memastikan layout sudah stabil
            setTimeout(() => {
                ScrollTrigger.refresh()
            }, 100)
        }

        // Listen untuk perubahan layout dari component lain
        const handleLayoutChange = () => {
            ScrollTrigger.refresh()
        }

        window.addEventListener('resize', handleResize)

        // Custom event listener jika component lain mengirim event perubahan layout
        window.addEventListener('layoutChange', handleLayoutChange)

        // Observer untuk mengwatch perubahan DOM pada component di atas Journey
        const observer = new MutationObserver(() => {
            // Delay refresh saat ada perubahan DOM
            setTimeout(() => {
                ScrollTrigger.refresh()
            }, 50)
        })

        // Watch changes pada parent container
        if (sectionRef.current?.parentElement) {
            observer.observe(sectionRef.current.parentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            })
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('layoutChange', handleLayoutChange)
            observer.disconnect()
        }
    }, [])

    return (
        <section ref={sectionRef} className=''>
            <Container className='pb-16 xl:pb-[116px]'>
                <div className='flex w-full flex-col gap-4 xl:flex-row xl:justify-between'>
                    <div className='flex flex-shrink-0 flex-col gap-4'>
                        <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white '>
                            <Trans i18nKey='cta.title' components={{ br: <br /> }}>
                                {t('journey.title')}
                            </Trans>
                        </h1>
                        <div className='hidden xl:block'>
                            <Button>{t('common:learn_more')}</Button>
                        </div>
                    </div>
                    <div className='flex  flex-col gap-6 xl:flex-row' ref={rightRef}>
                        <span className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile w-[400px]'>
                            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod
                            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
                            nostrud
                        </span>
                        <span className='text-grey-200 xl:text-paragraph-6-desktop text-paragraph-6-mobile w-[400px]'>
                            Exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis
                            autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel
                            illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui
                            blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
                        </span>
                    </div>
                    <div className='block xl:hidden'>
                        <Button>{t('common:learn_more')}</Button>
                    </div>
                </div>
            </Container>
            <div className='relative z-[11] h-[300px] w-full xl:h-[560px]'>
                <Image
                    src='/images/home/journey-hero.webp'
                    alt='journey'
                    fill
                    className='object-cover'
                    ref={imageContainerRef}
                    unoptimized
                />
            </div>
        </section>
    )
}

export default Journey
