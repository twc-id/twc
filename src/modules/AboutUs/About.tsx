import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import { useComponentVisibility } from '@hooks/useComponentVisibility'
import CTA from '@modules/AboutUs/components/CTA'
import Hero from '@modules/AboutUs/components/Hero'
import Journey from '@modules/AboutUs/components/Journey'
import Location from '@modules/AboutUs/components/Location'
import Service from '@modules/AboutUs/components/Service'
import WhiteSpace from '@modules/AboutUs/components/WhiteSpace'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'

const About = () => {
    const { t } = useTranslation('about')
    const { assets } = useAssets()
    const { data: visibility } = useComponentVisibility()

    // Kill ScrollSmoother to enable CSS sticky and remove GSAP dependency
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

            const parentDiv = wrapper?.parentElement
            if (parentDiv) {
                parentDiv.style.overflowX = 'clip'
                parentDiv.style.overflowY = 'visible'
            }

            window.scrollTo(0, currentScroll)

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

    const heroBanner = assets?.find((asset) => asset.name === 'about-us-hero')?.media?.url
    const whiteSpaceImage = assets?.find((asset) => asset.name === 'about-us-1')?.media?.url
    const journeyImage = assets?.find((asset) => asset.name === 'about-us-2')?.media?.url
    const serviceImage = assets?.find((asset) => asset.name === 'about-us-3')?.media?.url
    const cta = assets?.find((asset) => asset.name === 'about-us-4')?.media?.url

    const showTemukanKami = visibility?.about_temukan_kami ?? false

    return (
        <>
            <Seo title={t('title')} />
            <Hero image={heroBanner} />
            <WhiteSpace image={whiteSpaceImage} />
            <Journey image={journeyImage} />
            <Service image={serviceImage} />
            {showTemukanKami && <Location />}
            <CTA image={cta} showTemukanKami={showTemukanKami} />
        </>
    )
}

export default About
