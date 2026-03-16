import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Trans, useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Hero = ({ image }: { image?: string }) => {
    const { t } = useTranslation('sell')
    const sectionRef = useRef<HTMLElement>(null)
    const h1Ref = useRef<HTMLHeadingElement>(null)
    const paragraphRef = useRef<HTMLParagraphElement>(null)

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                id: 'sell-hero-animation',
                toggleActions: 'restart none none reset',
                onEnter: () => timeline.restart(),
                onEnterBack: () => timeline.restart()
            }
        })

        // Animasi fade untuk h3 dengan durasi lebih lama
        timeline.fromTo(h1Ref.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' })

        // Animasi h1 muncul dari bawah setelah h3 selesai
        timeline.fromTo(
            paragraphRef.current,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        )

        return () => {
            timeline.scrollTrigger?.kill()
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className='relative h-[80dvh] w-full'
            style={{
                backgroundImage: `radial-gradient(97.37% 97.37% at 77.39% 40.5%, rgba(1, 1, 1, 0) 0%, #010101 100%), url('${image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className='absolute inset-x-0 bottom-10 z-10 xl:bottom-[72px]'>
                <Container>
                    <div className='flex w-full flex-col justify-end gap-6 xl:items-end xl:gap-2'>
                        <h1
                            className='xl:text-heading-1-desktop text-heading-1-mobile text-grey-white line-clamp-3 xl:line-clamp-2 xl:w-[700px] xl:text-right'
                            ref={h1Ref}
                        >
                            <Trans i18nKey='sell:hero.title' components={{ br: <br className='block xl:hidden' /> }}>
                                {t('hero.title')}
                            </Trans>
                        </h1>
                        <p
                            className='text-grey-200 xl:text-paragraph-5-desktop text-paragraph-5-mobile'
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
