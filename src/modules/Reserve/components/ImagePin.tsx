import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

const ImagePin = () => {
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

            // Pin image dengan refresh dan onRefresh callback
            ScrollTrigger.create({
                trigger: imageContainerRef.current,
                start: 'top top',
                end: 'bottom top',
                pin: true,
                pinnedContainer: sectionRef.current,
                pinSpacing: true,
                id: 'image-pin',
                refreshPriority: -1 // Lower priority to run after other ScrollTriggers
            })
        }

        // Delay initialization untuk memastikan layout component lain sudah stabil
        const timer = setTimeout(() => {
            initScrollTrigger()
            // Refresh semua ScrollTrigger setelah inisialisasi
            ScrollTrigger.refresh()
        }, 100)

        return () => {
            clearTimeout(timer)
            ScrollTrigger.getById('image-pin')?.kill()
        }
    }, [sectionRef])

    useEffect(() => {
        const handleResize = () => {
            // Delay refresh untuk memastikan layout sudah stabil
            setTimeout(() => {
                ScrollTrigger.refresh()
            }, 100)
        }

        // Listen untuk perubahan layout dari component lain
        const handleLayoutChange = () => {
            ScrollTrigger.refresh()
        }

        window.addEventListener('resize', handleResize)

        // Custom event listener jika component lain mengirim event perubahan layout
        window.addEventListener('layoutChange', handleLayoutChange)

        // Use a ResizeObserver (lighter) with a debounced refresh.
        // Keep a one-shot MutationObserver fallback for attribute changes.
        let resizeObserver: ResizeObserver | null = null
        let mo: MutationObserver | null = null
        let refreshTimer: any = null

        const scheduleRefresh = (delay = 100) => {
            clearTimeout(refreshTimer)
            refreshTimer = setTimeout(() => {
                ScrollTrigger.refresh()
            }, delay)
        }

        if (sectionRef.current?.parentElement) {
            try {
                resizeObserver = new ResizeObserver(() => {
                    scheduleRefresh(100)
                })
                resizeObserver.observe(sectionRef.current.parentElement)
            } catch (e) {
                // ResizeObserver may not be available in some environments; fall back to mutation observer below
            }

            // Fallback one-shot MutationObserver to catch class/style changes
            mo = new MutationObserver(() => {
                scheduleRefresh(50)
                if (mo) {
                    mo.disconnect()
                    mo = null
                }
            })
            mo.observe(sectionRef.current.parentElement, {
                attributes: true,
                attributeFilter: ['style', 'class']
            })
        }

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('layoutChange', handleLayoutChange)
            if (resizeObserver) resizeObserver.disconnect()
            if (mo) mo.disconnect()
            clearTimeout(refreshTimer)
        }
    }, [])
    return (
        <section ref={sectionRef} className=' h-[300px] xl:h-[560px]'>
            <div ref={imageContainerRef} className='relative z-0 h-[300px] xl:h-[560px]'>
                <Image
                    src='/images/reserve/reserve-pin-2.webp'
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
