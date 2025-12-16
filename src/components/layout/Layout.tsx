import BaseDialog from '@components/dialog/BaseDialog'
import Footer from '@components/Footer'
import Header from '@components/Header/Header'
import { inter, overpass } from '@helpers/font'
import useDialogStore from '@store/useDialogStore'
import gsap from 'gsap'
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import * as React from 'react'
import { When } from 'react-if'

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
}

interface LayoutProps extends React.PropsWithChildren<object> {
    currentPath: string
}

const pathExcludeFooter = ['/']

const Layout: React.FC<LayoutProps> = ({ children, currentPath }: LayoutProps) => {
    const smoothWrapperRef = React.useRef<HTMLDivElement>(null)
    const smoothContentRef = React.useRef<HTMLDivElement>(null)
    const smootherRef = React.useRef<ScrollSmoother | null>(null)

    //#region  //*=========== Store ===========
    const open = useDialogStore.useOpen()
    const state = useDialogStore.useState()
    const handleClose = useDialogStore.useHandleClose()
    const handleSubmit = useDialogStore.useHandleSubmit()
    //#endregion  //*======== Store ===========

    React.useEffect(() => {
        smootherRef.current = ScrollSmoother.create({
            wrapper: smoothWrapperRef.current,
            content: smoothContentRef.current,
            smooth: 1.2,
            effects: true,
            smoothTouch: false,
            normalizeScroll: false
        })
    })

    const shouldShowFooter = !pathExcludeFooter.some((path) => currentPath.startsWith(path))

    return (
        <div className={`${inter.className} ${overpass.variable}`}>
            <Header />
            <div className='relative -mt-20 overflow-hidden'>
                <div ref={smoothWrapperRef} id='smooth-wrapper-home'>
                    <div ref={smoothContentRef} id='smooth-content-home'>
                        {children}
                        <When condition={shouldShowFooter}>
                            <Footer />
                        </When>
                        <BaseDialog onClose={handleClose} onSubmit={handleSubmit} open={open} options={state} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout
