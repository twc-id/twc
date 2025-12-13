import BaseDialog from '@components/dialog/BaseDialog'
import Footer from '@components/Footer'
import Header from '@components/Header/Header'
import { inter, overpass } from '@helpers/font'
import useDialogStore from '@store/useDialogStore'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import * as React from 'react'

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

export default function Layout({ children }: { children: React.ReactNode }) {
    //#region  //*=========== Store ===========
    const open = useDialogStore.useOpen()
    const state = useDialogStore.useState()
    const handleClose = useDialogStore.useHandleClose()
    const handleSubmit = useDialogStore.useHandleSubmit()
    //#endregion  //*======== Store ===========

    // Initialize ScrollSmoother for global smooth scrolling
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                const smoother = ScrollSmoother.create({
                    wrapper: '#smooth-wrapper',
                    content: '#smooth-content',
                    smooth: 1.2, // seconds it takes to catch up
                    effects: true, // look for data-speed and data-lag attributes
                    smoothTouch: 0.1, // much less on touch devices
                    normalizeScroll: true // prevents address bar from showing/hiding on mobile
                })

                return () => {
                    smoother?.kill()
                }
            }, 100)

            return () => {
                clearTimeout(timer)
            }
        }
    }, [])

    return (
        <div className={`${inter.className} ${overpass.variable}`}>
            <Header />
            <div id='smooth-wrapper'>
                <div id='smooth-content'>
                    {children}
                    <Footer />
                </div>
            </div>
            <BaseDialog onClose={handleClose} onSubmit={handleSubmit} open={open} options={state} />
        </div>
    )
}
