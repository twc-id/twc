import Button from '@components/buttons/Button'
import Container from '@components/Container'
import Icons from '@components/Icon'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import React, { useEffect, useRef, useState } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

// Declare Instagram Embeds type for window object
declare global {
    interface Window {
        instgrm?: {
            Embeds: {
                process: () => void
            }
        }
    }
}

const Instagram = () => {
    const [isLoading, setIsLoading] = useState(true)
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    // Instagram embed URLs
    const instagramPosts = [
        {
            id: 1,
            embedUrl: 'https://www.instagram.com/p/DRGmqrwEc1s/?utm_source=ig_embed&utm_campaign=loading',
            caption: 'INVISHIELD PROTECTIVE FILM - Keep your watch scratch-free'
        },
        {
            id: 2,
            embedUrl: 'https://www.instagram.com/p/DNb6WaNzmtA/?utm_source=ig_embed&utm_campaign=loading',
            caption: 'TWC - The Watch Collections'
        },
        {
            id: 3,
            embedUrl: 'https://www.instagram.com/p/DNnToR5xplH/?utm_source=ig_embed&utm_campaign=loading',
            caption: 'TWC - The Watch Collections'
        },
        {
            id: 4,
            embedUrl: 'https://www.instagram.com/p/DR3_2Omkf5t/?utm_source=ig_embed&utm_campaign=loading',
            caption: 'TWC - The Watch Collections'
        }
    ]

    useEffect(() => {
        // Load Instagram embed script
        const script = document.createElement('script')
        script.src = 'https://www.instagram.com/embed.js'
        script.async = true
        script.onload = () => {
            setIsLoading(false)
            // Process embeds after script loads
            if (window.instgrm) {
                window.instgrm.Embeds.process()
            }
        }
        document.body.appendChild(script)

        return () => {
            // Cleanup script on unmount
            const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]')
            if (existingScript) {
                document.body.removeChild(existingScript)
            }
        }
    }, [])

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

        timeline.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })

        timeline.fromTo(
            buttonRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
            '-=0.7'
        )

        timeline.fromTo(
            '.instagram-post-item',
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.15
            },
            '-=0.5'
        )
    }, [isLoading])

    if (isLoading) {
        return (
            <section className='bg-grey-white py-16 xl:py-[116px]'>
                <Container>
                    <div className='text-center'>
                        <p>Loading Instagram posts...</p>
                    </div>
                </Container>
            </section>
        )
    }

    return (
        <section ref={sectionRef} className='bg-grey-white relative z-[12] pb-16 pt-14 xl:pb-[160px] xl:pt-[116px]'>
            <Container>
                <div className='flex w-full flex-col items-center gap-16 xl:gap-10'>
                    {/* Header */}
                    <div className='flex flex-col items-center gap-1 text-center'>
                        <h2 ref={titleRef} className='text-heading-2-desktop text-grey-black mb-2'>
                            New in Instagram
                        </h2>
                        <p className='text-grey-500 mb-6'>@thewatchcollections</p>
                        <Button ref={buttonRef} variant='secondaryInverse' className='xl:mt-9'>
                            Follow Us
                        </Button>
                    </div>

                    {/* Instagram Photos Grid - menggunakan embed tapi dikustomisasi */}
                    <div className='scrollbar-hide -mx-4 flex w-[calc(100%+32px)] flex-row gap-2 overflow-x-auto px-4 xl:mx-0 xl:w-full xl:justify-between xl:overflow-visible xl:px-0'>
                        {instagramPosts.map((post) => (
                            <div
                                key={post.id}
                                className='instagram-post-item relative h-[419px] w-[314px] flex-shrink-0 overflow-hidden rounded-lg'
                            >
                                {/* Instagram Embed - akan di-replace oleh script Instagram */}
                                <blockquote
                                    className='instagram-media'
                                    data-instgrm-permalink={post.embedUrl}
                                    data-instgrm-version='14'
                                    style={{
                                        background: '#FFF',
                                        border: '0',
                                        borderRadius: '8px',
                                        margin: '0',
                                        maxWidth: 'none',
                                        minWidth: 'auto',
                                        padding: '0',
                                        width: '100%',
                                        height: '100%'
                                    }}
                                >
                                    {/* Fallback content while loading */}
                                    <div
                                        style={{
                                            backgroundColor: '#f4f4f4',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '8px'
                                        }}
                                        className='xl:h-[419px] xl:w-[314px]'
                                    >
                                        <div
                                            style={{
                                                fontSize: '14px',
                                                color: '#8e8e8e',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <p>Loading Instagram post...</p>
                                        </div>
                                    </div>
                                </blockquote>
                            </div>
                        ))}
                    </div>

                    {/* Find Us in Social Media */}
                    <div className='flex w-full flex-col justify-between gap-8 xl:flex-row xl:items-center xl:pt-10'>
                        <h3 className='text-heading-3-desktop text-grey-black flex-shrink-0 whitespace-pre-line '>
                            Find Us in <br className='hidden xl:block' /> Social Media
                        </h3>
                        <div className='grid flex-shrink-0 grid-cols-2 grid-rows-2 flex-row gap-x-5  gap-y-5 xl:flex xl:gap-[72px]'>
                            <a
                                href='https://instagram.com/thewatchcollections'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4'
                            >
                                <Icons
                                    icon='Instagram'
                                    width={32}
                                    height={32}
                                    className='text-grey-900 hover:text-grey-500'
                                />

                                <span className='text-grey-500 text-paragraph-6-desktop'>@thewatchcollections</span>
                            </a>
                            <a
                                href='https://instagram.com/thewatchcollections'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4'
                            >
                                <Icons
                                    icon='Youtube'
                                    width={32}
                                    height={32}
                                    className='text-grey-900 hover:text-grey-500'
                                />

                                <span className='text-grey-500 text-paragraph-6-desktop'>@thewatchcollections</span>
                            </a>
                            <a
                                href='https://instagram.com/thewatchcollections'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4'
                            >
                                <Icons
                                    icon='Tiktok'
                                    width={32}
                                    height={32}
                                    className='text-grey-900 hover:text-grey-500'
                                />

                                <span className='text-grey-500 text-paragraph-6-desktop'>@thewatchcollections</span>
                            </a>
                            <a
                                href='https://instagram.com/thewatchcollections'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4'
                            >
                                <Icons
                                    icon='LinkedIn'
                                    width={32}
                                    height={32}
                                    className='text-grey-900 hover:text-grey-500'
                                />

                                <span className='text-grey-500 text-paragraph-6-desktop'>@thewatchcollections</span>
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Instagram
