import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import Benefit from '@modules/Sell/components/Benefit'
import Consign from '@modules/Sell/components/Consign'
import CTA from '@modules/Sell/components/CTA'
import Faq from '@modules/Sell/components/Faq'
import Hero from '@modules/Sell/components/Hero'
import HowToSell from '@modules/Sell/components/HowToSell'
import WhiteSpace from '@modules/Sell/components/WhiteSpace'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { useTranslation } from 'next-i18next'
import React, { useEffect } from 'react'

const Sell = () => {
    const { t } = useTranslation('sell')
    const { assets } = useAssets()

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
    const heroImage = assets?.find((asset) => asset.name === 'sell-1')?.media.url
    const howToSellImage1 = assets?.find((asset) => asset.name === 'sell-2')?.media.url
    const howToSellImage2 = assets?.find((asset) => asset.name === 'sell-3')?.media.url
    const howToSellImage3 = assets?.find((asset) => asset.name === 'sell-4')?.media.url
    const howToSellImage4 = assets?.find((asset) => asset.name === 'sell-5')?.media.url
    const sellPin = assets?.find((asset) => asset.name === 'sell-6')?.media.url
    const consignImage1 = assets?.find((asset) => asset.name === 'sell-7')?.media.url
    const consignImage2 = assets?.find((asset) => asset.name === 'sell-8')?.media.url
    const consignImage3 = assets?.find((asset) => asset.name === 'sell-9')?.media.url
    const consignImage4 = assets?.find((asset) => asset.name === 'sell-10')?.media.url
    const ctaImage = assets?.find((asset) => asset.name === 'sell-11')?.media.url

    return (
        <>
            <Seo title={t('title')} />
            <Hero image={heroImage} />
            <WhiteSpace />
            <Benefit />
            <HowToSell
                images={{
                    step1: howToSellImage1,
                    step2: howToSellImage2,
                    step3: howToSellImage3,
                    step4: howToSellImage4,
                    pin: sellPin
                }}
            />
            <Consign
                images={{
                    step1: consignImage1,
                    step2: consignImage2,
                    step3: consignImage3,
                    step4: consignImage4
                }}
            />
            <Faq />
            <CTA image={ctaImage} />
        </>
    )
}

export default Sell
