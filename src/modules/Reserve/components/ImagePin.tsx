import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const ImagePin = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const imageContainerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        if (!sectionRef.current || !imageContainerRef.current) return

        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top'
        })

        // Pin image dengan refresh dan onRefresh callback
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            markers: true,
            pin: true,
            pinnedContainer: sectionRef.current,
            pinSpacing: true,
            id: 'image-pin'
        })
    })

    return (
        <section ref={sectionRef} className='h-[300px] xl:h-[560px]'>
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

export default ImagePin
