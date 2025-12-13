import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import React, { useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const JourneyImage = () => {
    const imageContainerRef = useRef<HTMLDivElement>(null)
    const sectionRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        // Pin image saat scroll - dengan ID untuk debugging
        const pinTrigger = ScrollTrigger.create({
            trigger: imageContainerRef.current,
            start: 'top top',
            end: '+=100%',
            pin: true,
            pinSpacing: false,
            id: 'journey-pin'
        })

        // Cleanup
        return () => {
            pinTrigger.kill()
        }
    }, [])
    return (
        <div ref={sectionRef} className='pb-16 xl:pb-[116px]'>
            <div ref={imageContainerRef} className='relative z-[11] h-[300px] w-full xl:h-[560px]'>
                <Image src='/images/home/journey-hero.webp' alt='journey' fill className='object-cover' />
            </div>
        </div>
    )
}

export default JourneyImage
