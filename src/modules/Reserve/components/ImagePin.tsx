import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const ImagePin = ({ image }: { image?: string }) => {
    const sectionRef = useRef<HTMLElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const initScrollTrigger = () => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'restart none none reset'
            })

            // Pin image with anticipatePin for smoother experience
            ScrollTrigger.create({
                trigger: imageContainerRef.current,
                start: 'top top',
                end: 'bottom top',
                pin: true,
                pinnedContainer: sectionRef.current,
                pinSpacing: true,
                id: 'image-pin',
                refreshPriority: -1,
                anticipatePin: 1 // Pre-calculate pin position for smoother experience
            })
        }

        // Initialize after layout is stable
        const timer = setTimeout(() => {
            initScrollTrigger()
            ScrollTrigger.refresh()
        }, 100)

        return () => {
            clearTimeout(timer)
            ScrollTrigger.getById('image-pin')?.kill()
        }
    }, [])

    return (
        <section ref={sectionRef} className='h-[300px] xl:h-[560px]'>
            <div ref={imageContainerRef} className='relative z-0 h-[300px] xl:h-[560px]'>
                <Image
                    priority
                    src={image || ''}
                    alt='The Watch Collections'
                    fill
                    className='object-cover'
                    unoptimized
                />
            </div>
        </section>
    )
}

export default ImagePin
