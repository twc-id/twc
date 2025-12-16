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

const WhiteSpace = () => {
    const { t } = useTranslation('about')
    const sectionRef = useRef<HTMLElement>(null)
    const textRef = useRef<HTMLParagraphElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        let timeline: any = null
        let pinTrigger: any = null
        let timer: any = null
        let listener: any = null

        const init = () => {
            timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'restart none none reset'
                }
            })

            timeline.fromTo(
                textRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            )

            pinTrigger = ScrollTrigger.create({
                trigger: imageContainerRef.current,
                start: 'top top',
                end: '+=100%',
                pin: true,
                pinSpacing: false,
                id: 'whitespace-pin',
                pinnedContainer: sectionRef.current
            })

            timer = setTimeout(() => {
                ScrollTrigger.refresh()
            }, 100)
        }

        if ((window as any).__scrollSmoother) {
            init()
        } else {
            listener = () => init()
            window.addEventListener('scrollSmoother:created', listener)
        }

        return () => {
            if (listener) window.removeEventListener('scrollSmoother:created', listener)
            try {
                pinTrigger && pinTrigger.kill()
            } catch (e) {}
            if (timer) clearTimeout(timer)
            if (timeline) {
                try {
                    timeline.scrollTrigger?.kill()
                } catch (e) {}
                try {
                    timeline.kill()
                } catch (e) {}
            }
        }
    }, [])

    return (
        <section ref={sectionRef}>
            <Container className='py-16 xl:py-[160px]'>
                <p
                    className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-700 xl:w-[520px]'
                    ref={textRef}
                >
                    {t('white_space.description')}
                </p>
            </Container>
            <div ref={imageContainerRef} className='relative z-0 h-[300px] xl:h-[560px]'>
                <Image
                    src='/images/about-us/white-space.webp'
                    alt='The Watch Collections'
                    fill
                    className='object-cover'
                    unoptimized
                />
            </div>
        </section>
    )
}

export default WhiteSpace
