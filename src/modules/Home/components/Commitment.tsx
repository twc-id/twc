import Icons from '@components/Icon'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Commitment = () => {
    const { t } = useTranslation('home')
    const titleRef = useRef<HTMLHeadingElement>(null)
    const descRef = useRef<HTMLHeadingElement>(null)
    const sectionRef = useRef<HTMLDivElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(titleRef.current, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' })

        timeline.fromTo(
            descRef.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
            '-=0.5' // overlap with previous animation
        )

        // Pin image saat scroll - dengan ID untuk debugging
        const pinTrigger = ScrollTrigger.create({
            trigger: imageContainerRef.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            pinSpacing: false,
            id: 'commitment-pin',
            pinnedContainer: sectionRef.current
        })

        // Cleanup
        return () => {
            pinTrigger.kill()
        }
    }, [])

    return (
        <section ref={sectionRef}>
            <div className='bg-grey-black relative flex flex-col items-center justify-center gap-6 px-4 py-16 text-center xl:py-[160px]'>
                <h1 ref={titleRef} className='text-heading-2-mobile text-grey-white xl:text-heading-2-desktop'>
                    {t('commitment.title')}
                </h1>
                <Icons icon='Diamond' className='text-grey-100' />
                <h3 ref={descRef} className='text-paragraph-6-mobile text-grey-100 xl:text-paragraph-6-desktop'>
                    {t('commitment.description')}
                </h3>
            </div>
            <div ref={imageContainerRef} className='relative z-0 h-[300px] xl:h-[560px]'>
                <Image src='/images/home/commitment.webp' alt='commitment' fill className='object-cover' />
            </div>
        </section>
    )
}

export default Commitment
