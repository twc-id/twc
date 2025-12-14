import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { useTranslation } from 'next-i18next'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const WhiteSpace = () => {
    const { t } = useTranslation('sell')
    const sectionRef = useRef<HTMLElement>(null)
    const textRef = useRef<HTMLParagraphElement>(null)

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                id: 'sell-whitespace-animation',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(textRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })

        return () => {
            timeline.scrollTrigger?.kill()
        }
    }, [])

    return (
        <section ref={sectionRef}>
            <Container className='pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'>
                <p
                    className='xl:text-subheading-1-desktop text-subheading-1-mobile text-grey-500 dark:text-grey-200 xl:w-[520px]'
                    ref={textRef}
                >
                    {t('white_space.description')}
                </p>
            </Container>
        </section>
    )
}

export default WhiteSpace
