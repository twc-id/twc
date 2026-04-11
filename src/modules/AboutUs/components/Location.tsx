import Container from '@components/Container'
import Icons from '@components/Icon'
import { useGSAP } from '@gsap/react'
import { getWhatsAppLinkFromTemplate } from '@utils/whatsapp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Location = () => {
    const { t } = useTranslation('about')
    const sectionRef = useRef<HTMLElement>(null)
    const leftRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<HTMLDivElement>(null)
    const socialRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(leftRef.current, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' })

        timeline.fromTo(mapRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' })
        timeline.fromTo(socialRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    }, [])

    return (
        <section className='bg-grey-white pb-16 pt-14 xl:py-[116px]' ref={sectionRef} id='location'>
            <Container>
                <div className='flex flex-col items-center gap-8 xl:flex-row xl:gap-[120px]'>
                    <div className='flex w-full flex-col gap-9' ref={leftRef}>
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
                    </div>
                    {/* Map */}
                    <div className='w-full' ref={mapRef}>
                        <iframe
                            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.2537141670164!2d106.78613268380873!3d-6.096489678135313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a1d86895b6c51%3A0x1783317c43ba9423!2sTWC%20-%20The%20Watch%20Collections!5e0!3m2!1sid!2sid!4v1765118418097!5m2!1sid!2sid'
                            style={{ border: 0, filter: 'grayscale(100%)' }}
                            allowFullScreen={false}
                            className='h-[233px] w-full xl:h-[366px]'
                            loading='lazy'
                            referrerPolicy='no-referrer-when-downgrade'
                        ></iframe>
                    </div>
                    <div className='flex w-full flex-col gap-6 xl:hidden' ref={socialRef}>
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
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Location
