import Button from '@components/buttons/Button'
import { useTheme } from '@contexts/ThemeContext'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const SellReserve = () => {
    const { isDarkSection } = useTheme()
    const sectionRef = useRef<HTMLElement>(null)
    const sellRef = useRef<HTMLDivElement>(null)
    const reserveRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reset',
                onEnter: () => timeline.restart(),
                onEnterBack: () => timeline.restart()
            }
        })

        // Animasi kedua content fade in bersamaan
        timeline.fromTo(
            [sellRef.current, reserveRef.current],
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        )
    }, [])

    return (
        <section
            ref={sectionRef}
            className={`xl:py[160px] relative z-10 flex flex-col gap-2 px-4 py-16 xl:flex-row xl:px-5 ${
                isDarkSection ? 'bg-grey-black' : 'bg-white'
            }`}
        >
            <div
                ref={sellRef}
                style={{
                    backgroundImage:
                        "linear-gradient(174.63deg, rgba(1, 1, 1, 0) 51.23%, #010101 96.85%), url('/images/home/sell.webp')",
                    backgroundSize: '100% auto',
                    backgroundPositionY: 'top'
                    // backgroundRepeat: 'no-repeat'
                }}
                className='relative z-10 flex h-[464px] w-full flex-col items-start justify-end gap-4 p-5 xl:h-[888px] xl:p-20'
            >
                <h1 className='text-heading-2-desktop text-grey-white'>Sell Your Watch</h1>
                <Button>Learn More</Button>
            </div>
            <div
                ref={reserveRef}
                style={{
                    backgroundImage:
                        "linear-gradient(174.63deg, rgba(1, 1, 1, 0) 51.23%, #010101 96.85%), url('/images/home/reserve.webp')",
                    backgroundSize: '100% auto',
                    backgroundPositionY: 'top'
                    // backgroundRepeat: 'no-repeat'
                }}
                className='relative z-10 flex h-[464px] w-full flex-col items-start justify-end gap-4 p-5 xl:h-[888px] xl:p-20'
            >
                <h1 className='text-heading-2-desktop text-grey-white'>Reserve Your Watch</h1>
                <Button>Learn More</Button>
            </div>
        </section>
    )
}

export default SellReserve
