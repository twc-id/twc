/* eslint-disable no-console */
import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import { useComponentVisibility } from '@hooks/useComponentVisibility'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import React, { useEffect } from 'react'

import Commitment from './components/Commitment'
import CTA from './components/CTA'
import Hero from './components/Hero'
import Highlight from './components/Highlight'
import Journey from './components/Journey'
import Review from './components/Review'
import SellReserve from './components/SellReserve'
import SocialMedia from './components/SocialMedia'
import TimePieceService from './components/TimePieceService'

const Home = () => {
    const { assets } = useAssets()
    const { data: visibility } = useComponentVisibility()

    // Kill ScrollSmoother on Home page to enable CSS sticky and remove GSAP dependency
    useEffect(() => {
        let cancelled = false

        const killSmoother = () => {
            if (cancelled) return
            const smoother = (window as any).scrollSmootherInstance
            if (!smoother) return

            const currentScroll = smoother.scrollTop()
            smoother.kill()
            ;(window as any).scrollSmootherInstance = null

            const wrapper = document.getElementById('smooth-wrapper-home')
            const contentEl = document.getElementById('smooth-content-home')
            if (wrapper) wrapper.removeAttribute('style')
            if (contentEl) contentEl.removeAttribute('style')

            // Override ancestor overflow-hidden to enable CSS sticky
            const parentDiv = wrapper?.parentElement
            if (parentDiv) {
                parentDiv.style.overflowX = 'clip'
                parentDiv.style.overflowY = 'visible'
            }

            window.scrollTo(0, currentScroll)

            // GSAP sets body overflow async after kill — poll to override
            let clearAttempts = 0
            const setBodyOverflow = () => {
                document.body.style.overflow = 'visible'
                clearAttempts++
                if (clearAttempts < 10) {
                    requestAnimationFrame(setBodyOverflow)
                }
            }
            setBodyOverflow()
        }

        const smoother = (window as any).scrollSmootherInstance
        if (smoother) {
            killSmoother()
        } else {
            requestAnimationFrame(() => killSmoother())
        }

        return () => {
            cancelled = true
            document.body.style.removeProperty('overflow')

            const wrapper = document.getElementById('smooth-wrapper-home')
            const content = document.getElementById('smooth-content-home')
            const parentDiv = wrapper?.parentElement
            if (parentDiv) parentDiv.style.overflow = ''

            if (wrapper && content) {
                const isMobileCheck = window.matchMedia('(max-width: 1279px)').matches
                const newSmoother = ScrollSmoother.create({
                    wrapper,
                    content,
                    smooth: 0.8,
                    effects: false,
                    smoothTouch: isMobileCheck ? 0.3 : false,
                    normalizeScroll: false
                })
                ;(window as any).scrollSmootherInstance = newSmoother
            }
        }
    }, [])

    const commitmentImage = assets?.find((asset) => asset.name === 'home-1')?.media?.url
    const journeyImage = assets?.find((asset) => asset.name === 'home-2')?.media?.url
    console.log(journeyImage)
    const ctaImage = assets?.find((asset) => asset.name === 'home-3')?.media?.url
    const sellImage = assets?.find((asset) => asset.name === 'home-4')?.media?.url
    const reviewImage = assets?.find((asset) => asset.name === 'home-5')?.media?.url

    const service1Image = assets?.find((asset) => asset.name === 'home-service-6')?.media?.url
    const service2Image = assets?.find((asset) => asset.name === 'home-service-7')?.media?.url
    const service3Image = assets?.find((asset) => asset.name === 'home-service-8')?.media?.url

    const showTestimonial = visibility?.homepage_testimonial ?? false
    const showNewInInstagram = visibility?.homepage_new_in_instagram ?? false

    return (
        <>
            <Seo />
            <Hero />
            <Commitment image={commitmentImage} />
            <Highlight />
            <SellReserve sell={sellImage} reserve={reviewImage} />
            <TimePieceService service1={service1Image} service2={service2Image} service3={service3Image} />
            <Journey image={journeyImage} />
            {showTestimonial && <Review />}
            {showNewInInstagram && <SocialMedia />}

            <CTA image={ctaImage} showNewInInstagram={showNewInInstagram} />
        </>
    )
}

export default Home
