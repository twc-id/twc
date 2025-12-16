import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Hero = () => {
    const { t } = useTranslation('about')
    const sectionRef = useRef<HTMLElement>(null)
    const h1Ref = useRef<HTMLHeadingElement>(null)
    const paragraphRef = useRef<HTMLParagraphElement>(null)

    useGSAP(() => {
        let timeline: any = null
        let timer: any = null
        let listener: any = null

        const init = () => {
            timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    id: 'about-hero-animation',
                    toggleActions: 'restart none none reset',
                    onEnter: () => timeline.restart(),
                    onEnterBack: () => timeline.restart()
                }
            })

            timeline.fromTo(h1Ref.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' })

            timeline.fromTo(
                paragraphRef.current,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            )

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
            if (timer) clearTimeout(timer)
            if (timeline) {
                try {
                    timeline.scrollTrigger?.kill()
                } catch (e) {
                    //
                }
                try {
                    timeline.kill()
                } catch (e) {
                    //
                }
            }
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className='relative h-[848px] w-full xl:h-[960px]'
            style={{
                backgroundImage: `linear-gradient(180deg, rgba(1, 1, 1, 0) 45.47%, #010101 74.94%), url('/images/about-us/hero.webp')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transform: 'translate(0px, 0px) !important'
            }}
        >
            <div className='absolute inset-x-0 bottom-0 z-10 pb-5 xl:bottom-[121px] xl:pb-20'>
                <Container>
                    <div className='flex w-full flex-col items-start justify-between gap-6 xl:flex-row xl:items-end xl:gap-4'>
                        <h1
                            className='xl:text-heading-1-desktop text-heading-1-mobile text-grey-white line-clamp-2 w-[350px] xl:w-[483px]'
                            ref={h1Ref}
                        >
                            {t('hero.title')}
                        </h1>
                        <p
                            className='text-grey-200 xl:text-paragraph-5-desktop text-paragraph-5-mobile line-clamp-3 w-[288px]'
                            ref={paragraphRef}
                        >
                            {t('hero.description')}
                        </p>
                    </div>
                </Container>
            </div>
        </section>
    )
}

export default Hero
