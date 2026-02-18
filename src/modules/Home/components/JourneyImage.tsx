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
        if (!imageContainerRef.current) return

        // Get actual height of the image container
        const containerHeight = imageContainerRef.current.offsetHeight
        // Calculate pin distance (container height + some buffer)
        const pinDistance = Math.max(containerHeight * 0.5, 200) // At least 200px or 50% of container height

        // Pin image saat scroll - dengan ID untuk debugging
        const pinTrigger = ScrollTrigger.create({
            trigger: imageContainerRef.current,
            start: 'top top',
            end: `+=${pinDistance}`,
            pin: true,
            pinSpacing: false,
            id: 'journey-image-pin',
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // Log untuk debugging jika perlu
                if (process.env.NODE_ENV === 'development' && self.direction === 1) {
                    console.log('[JourneyImage Pin] progress:', self.progress.toFixed(2))
                }
            }
        })

        // Cleanup
        return () => {
            pinTrigger.kill()
        }
    }, [])

    return (
        <div ref={sectionRef} className='pb-16 xl:pb-[116px]'>
            <div ref={imageContainerRef} className='relative z-[11] h-[300px] w-full xl:h-[560px]'>
                <Image src='/images/home/journey-hero.webp' alt='journey' fill className='object-cover' unoptimized />
            </div>
        </div>
    )
}

export default JourneyImage
