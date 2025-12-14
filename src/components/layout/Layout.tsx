import BaseDialog from '@components/dialog/BaseDialog'
import Footer from '@components/Footer'
import Header from '@components/Header/Header'
import { inter, overpass } from '@helpers/font'
import useDialogStore from '@store/useDialogStore'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import * as React from 'react'
import { When } from 'react-if'

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
}

interface LayoutProps extends React.PropsWithChildren<object> {
    currentPath: string
}

const pathExcludeFooter = ['/']

const Layout: React.FC<LayoutProps> = ({ children, currentPath }: LayoutProps) => {
    //#region  //*=========== Store ===========
    const open = useDialogStore.useOpen()
    const state = useDialogStore.useState()
    const handleClose = useDialogStore.useHandleClose()
    const handleSubmit = useDialogStore.useHandleSubmit()
    //#endregion  //*======== Store ===========

    const shouldShowFooter = !pathExcludeFooter.some((path) => currentPath.startsWith(path))

    return (
        <div className={`${inter.className} ${overpass.variable}`}>
            <Header />
            {children}
            <When condition={shouldShowFooter}>
                <Footer />
            </When>
            <BaseDialog onClose={handleClose} onSubmit={handleSubmit} open={open} options={state} />
        </div>
    )
}

export default Layout
