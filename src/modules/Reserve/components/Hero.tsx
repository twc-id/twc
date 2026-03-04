import Container from '@components/Container'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import React, { useRef, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const Hero = () => {
    const { t } = useTranslation('reserve')
    const [activeIndex, setActiveIndex] = useState(0)
    // const [viewportHeight, setViewportHeight] = useState(800) // fallback height
    const sectionRef = useRef<HTMLElement>(null)
    const leftImageRef = useRef<HTMLDivElement>(null)
    const rightItemsRef = useRef<HTMLDivElement>(null)
    const pinSectionRef = useRef<HTMLDivElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])
    const mobileImageRef = useRef<HTMLDivElement>(null)
    const mobileItemsRef = useRef<HTMLDivElement>(null)
    const isMobile = useMediaQuery({ maxWidth: 1279 })

    // // Set viewport height on client side
    // React.useEffect(() => {
    //     // Set immediately for better initial render
    //     setViewportHeight(typeof window !== 'undefined' ? window.innerHeight : 800)

    //     if (typeof window !== 'undefined') {
    //         const handleResize = () => setViewportHeight(window.innerHeight)
    //         window.addEventListener('resize', handleResize)
    //         return () => window.removeEventListener('resize', handleResize)
    //     }
    // }, [])

    const items = [
        {
            id: 1,
            image: '/images/reserve/carousel-1.webp',
            label: t('hero.items.1.title')
        },
        {
            id: 2,
            image: '/images/reserve/carousel-2.webp',
            label: t('hero.items.2.title')
        },
        {
            id: 3,
            image: '/images/reserve/carousel-3.webp',
            label: t('hero.items.3.title')
        }
    ]

    useGSAP(() => {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'bottom center',
                toggleActions: 'restart none none reset'
            }
        })

        timeline.fromTo(
            descriptionRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        )

        let pinTrigger: ScrollTrigger

        if (isMobile) {
            // Mobile layout: pin section with horizontal scroll for items
            if (mobileItemsRef.current) {
                pinTrigger = ScrollTrigger.create({
                    trigger: pinSectionRef.current,
                    start: 'top top',
                    end: '+=200%',
                    pin: true,
                    scrub: true, // Use true for smoother 1:1 scroll mapping
                    anticipatePin: 1, // Pre-calculate pin position for smoother experience
                    onUpdate: (self) => {
                        const progress = self.progress
                        const currentIndex = Math.min(Math.floor(progress * 3), 2)

                        setActiveIndex(currentIndex)

                        // Move items horizontally - use immediate set for smoother mobile
                        itemRefs.current.forEach((item, index) => {
                            if (!item) return

                            const isActive = index === currentIndex
                            const offsetFromActive = index - currentIndex
                            const xPosition = offsetFromActive * 180

                            // Use gsap.set for instant position update (no lag)
                            gsap.set(item, {
                                x: xPosition,
                                opacity: isActive ? 1 : 0.6,
                                scale: isActive ? 1 : 0.9
                            })
                        })
                    }
                })

                // Initialize mobile items horizontally
                itemRefs.current.forEach((item, index) => {
                    if (!item) return
                    gsap.set(item, {
                        x: index * 180,
                        opacity: index === 0 ? 1 : 0.6,
                        scale: index === 0 ? 1 : 0.9
                    })
                })
            }
        } else {
            // Desktop layout: existing vertical scroll logic
            if (pinSectionRef.current && rightItemsRef.current) {
                pinTrigger = ScrollTrigger.create({
                    trigger: pinSectionRef.current,
                    start: 'top top',
                    end: '+=100%',
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress
                        const currentIndex = Math.min(Math.floor(progress * 3), 2)

                        setActiveIndex(currentIndex)

                        // Center the active item vertically
                        itemRefs.current.forEach((item, index) => {
                            if (!item) return

                            const isActive = index === currentIndex
                            const offsetFromActive = index - currentIndex
                            const yPosition = offsetFromActive * 400

                            gsap.to(item, {
                                y: yPosition,
                                opacity: isActive ? 1 : 0.4,
                                scale: isActive ? 1 : 0.95,
                                duration: 0.6,
                                ease: 'power2.out'
                            })
                        })
                    }
                })

                // Initialize desktop items vertically
                itemRefs.current.forEach((item, index) => {
                    if (!item) return
                    gsap.set(item, {
                        y: index * 400,
                        opacity: index === 0 ? 1 : 0.4,
                        scale: index === 0 ? 1 : 0.95
                    })
                })
            }
        }

        // Pin image section
        const pinTriggerImage = ScrollTrigger.create({
            trigger: imageContainerRef.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            pinSpacing: false,
            id: 'reserve-hero-pin'
        })

        return () => {
            pinTriggerImage?.kill()
            pinTrigger?.kill()
        }
    }, [isMobile])

    // Animate mobile items when activeIndex changes
    React.useEffect(() => {
        if (!isMobile) return

        itemRefs.current.forEach((item, index) => {
            if (!item) return

            const isActive = index === activeIndex
            const offsetFromActive = index - activeIndex
            const xPosition = offsetFromActive * 180

            gsap.to(item, {
                x: xPosition,
                opacity: isActive ? 1 : 0.6,
                scale: isActive ? 1 : 0.9,
                duration: 0.5,
                ease: 'power2.out'
            })
        })
    }, [activeIndex, isMobile])

    return (
        <section ref={sectionRef} className='bg-grey-black pt-[200px] xl:pt-[240px]'>
            <Container className='pb-14 xl:pb-[116px]'>
                <h1 className='xl:text-heading-2-desktop text-heading-2-mobile text-grey-white line-clamp-3 xl:w-[585px]'>
                    {t('hero.title')}
                </h1>
            </Container>
            {isMobile ? (
                /* Mobile Layout - Vertical */
                <div className='flex w-full flex-col' ref={pinSectionRef}>
                    {/* Main Image - Mobile */}
                    <div ref={mobileImageRef} className='relative h-[400px] w-full overflow-hidden'>
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-500 ${
                                    activeIndex === index ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <Image
                                    src={item.image}
                                    alt='Reserve Hero Image'
                                    width={400}
                                    height={400}
                                    className='h-full w-full object-cover'
                                    unoptimized
                                />
                            </div>
                        ))}
                        {/* Text overlay - Mobile */}
                        <div className='absolute bottom-4 left-4'>
                            <h2 className='text-heading-3-mobile max-w-[280px] text-white'>{t('hero.subtitle')}</h2>
                        </div>
                    </div>

                    {/* Items Container - Mobile */}
                    <div className='mt-14 overflow-hidden px-4'>
                        <div ref={mobileItemsRef} className='relative flex h-[172px] items-center justify-center'>
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    ref={(el) => {
                                        itemRefs.current[index] = el
                                    }}
                                    className='absolute h-[172px] w-[172px] cursor-pointer'
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.label}
                                        width={172}
                                        height={172}
                                        className='h-full w-full object-cover'
                                        unoptimized
                                    />
                                    <div className='absolute bottom-2 left-2 overflow-hidden'>
                                        <div
                                            className={`transform transition-all duration-500 ease-out ${
                                                activeIndex === index
                                                    ? 'translate-y-0 opacity-100'
                                                    : 'translate-y-full opacity-0'
                                            }`}
                                        >
                                            <span className='text-subheading-3-mobile text-grey-white rounded px-2 py-1'>
                                                {item.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* Desktop Layout - Horizontal */
                <div className='flex w-full flex-row xl:gap-[152px]' ref={pinSectionRef}>
                    <div ref={leftImageRef} className='relative overflow-hidden xl:h-[940px] xl:w-[749px]'>
                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-500 ${
                                    activeIndex === index ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <Image
                                    src={item.image}
                                    alt='Reserve Hero Image'
                                    width={749}
                                    height={940}
                                    className='h-full w-full object-cover'
                                    unoptimized
                                />
                            </div>
                        ))}
                        {/* Text overlay */}
                        <div className='absolute bottom-8 left-4 xl:bottom-[160px] xl:left-[80px]'>
                            <h2 className='xl:text-heading-3-desktop text-heading-3-mobile max-w-[300px] text-white xl:max-w-[400px]'>
                                {t('hero.subtitle')}
                            </h2>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6 overflow-hidden xl:h-[940px]'>
                        <div
                            ref={rightItemsRef}
                            className='relative flex h-full items-center justify-center xl:w-[387px]'
                        >
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    ref={(el) => {
                                        itemRefs.current[index] = el
                                    }}
                                    className='absolute cursor-pointer xl:h-[387px] xl:w-[387px]'
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.label}
                                        width={387}
                                        height={387}
                                        className='h-full w-full object-cover'
                                        unoptimized
                                    />
                                    <div className='absolute bottom-4 left-4 overflow-hidden'>
                                        <div
                                            className={`transform transition-all duration-500 ease-out ${
                                                activeIndex === index
                                                    ? 'translate-y-0 opacity-100'
                                                    : 'translate-y-full opacity-0'
                                            }`}
                                        >
                                            <span className='text-grey-white xl:text-subheading-3-desktop text-subheading-3-mobile rounded px-3 py-1'>
                                                {item.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Description */}
            <Container>
                <div className='flex flex-row justify-end pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]' ref={descriptionRef}>
                    <p className='xl:text-paragraph-6-desktop text-paragraph-6-mobile text-grey-200 line-clamp-2 text-left xl:w-[400px]'>
                        {t('hero.description')}
                    </p>
                </div>
            </Container>
            <div ref={imageContainerRef} className='relative z-0 h-[300px] xl:h-[560px]'>
                <Image
                    src='/images/reserve/reserve-pin.webp'
                    alt='The Watch Collections'
                    fill
                    className='object-cover'
                    unoptimized
                />
            </div>
        </section>
    )
}

export default Hero
