import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import { useComponentVisibility } from '@hooks/useComponentVisibility'
import CTA from '@modules/Reserve/components/CTA'
import Hero from '@modules/Reserve/components/Hero'
import HowToReserve from '@modules/Reserve/components/HowToReserve'
import ImagePin from '@modules/Reserve/components/ImagePin'
import ReserveTimepiece from '@modules/Reserve/components/ReserveTimepiece'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'

const Reserve = () => {
    const { t } = useTranslation('reserve')
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

    const heroImage1 = assets?.find((asset) => asset.name === 'reserve-1')?.media?.url
    const heroImage2 = assets?.find((asset) => asset.name === 'reserve-2')?.media?.url
    const heroImage3 = assets?.find((asset) => asset.name === 'reserve-3')?.media?.url
    const reserveImagePin = assets?.find((asset) => asset.name === 'reserve-5')?.media?.url
    const imagePin = assets?.find((asset) => asset.name === 'reserve-6')?.media?.url
    const reserveImage1 = assets?.find((asset) => asset.name === 'reserve-7')?.media?.url
    const reserveImage2 = assets?.find((asset) => asset.name === 'reserve-8')?.media?.url
    const reserveImage3 = assets?.find((asset) => asset.name === 'reserve-9')?.media?.url
    const reserveImage4 = assets?.find((asset) => asset.name === 'reserve-10')?.media?.url
    const ctaImage = assets?.find((asset) => asset.name === 'reserve-11')?.media?.url

    const showWatchTextSection = visibility?.reserve_watch_text_section ?? false

    return (
        <div className='bg-grey-black'>
            <Seo title={t('title')} />
            <Hero
                heroImage1={heroImage1}
                heroImage2={heroImage2}
                heroImage3={heroImage3}
                imagePin={reserveImagePin}
                showWatchTextSection={showWatchTextSection}
            />
            <ReserveTimepiece />
            <ImagePin image={imagePin} />
            <HowToReserve
                reserveImage1={reserveImage1}
                reserveImage2={reserveImage2}
                reserveImage3={reserveImage3}
                reserveImage4={reserveImage4}
            />
            <CTA image={ctaImage} />
        </div>
    )
}

export default Reserve
