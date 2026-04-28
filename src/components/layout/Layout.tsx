import BaseDialog from '@components/dialog/BaseDialog'
import Footer from '@components/Footer'
import Header from '@components/Header/Header'
import { inter, overpass } from '@helpers/font'
import useDialogStore from '@store/useDialogStore'
import { useRouter } from 'next/router'
import * as React from 'react'

interface LayoutProps extends React.PropsWithChildren<object> {}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter()

    //#region  //*=========== Store ===========
    const open = useDialogStore.useOpen()
    const state = useDialogStore.useState()
    const handleClose = useDialogStore.useHandleClose()
    const handleSubmit = useDialogStore.useHandleSubmit()
    //#endregion  //*======== Store ===========

    React.useEffect(() => {
        // Scroll to hash element using native scrollIntoView
        const scrollToHash = (hash?: string) => {
            const targetId = (hash || window.location.hash || '').replace('#', '')
            if (!targetId) return

            window.dispatchEvent(new CustomEvent('closeMobileMenu'))

            let attempts = 0
            const maxAttempts = 20
            const interval = setInterval(() => {
                const el = document.getElementById(targetId)
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' })
                    clearInterval(interval)
                } else if (++attempts >= maxAttempts) {
                    clearInterval(interval)
                }
            }, 50)
        }

        // Initial hash check
        if (typeof window !== 'undefined' && window.location.hash) {
            setTimeout(() => scrollToHash(window.location.hash), 50)
        }

        const handleHashChange = (event: HashChangeEvent) => {
            event.preventDefault()
            const hash = event.newURL?.split('#')[1] || window.location.hash?.replace('#', '')
            if (hash) {
                setTimeout(() => scrollToHash(`#${hash}`), 50)
            }
        }

        const handleHashLinkClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement
            const anchor = target.closest('a')

            const isRootHashLink = anchor && anchor.pathname === '/' && anchor.hash
            const isSamePageHashLink = anchor && anchor.hash && anchor.pathname === window.location.pathname

            if (isRootHashLink || isSamePageHashLink) {
                event.preventDefault()
                event.stopPropagation()

                if (isRootHashLink && window.location.pathname !== '/') {
                    const hash = anchor.hash
                    router.push(`/${hash}`, undefined, { scroll: false })
                    return
                }

                const hash = anchor.hash
                if (window.location.hash !== hash) {
                    window.location.hash = hash
                } else {
                    scrollToHash(hash)
                }
            }
        }

        window.addEventListener('hashchange', handleHashChange)
        window.addEventListener('click', handleHashLinkClick, true)

        const onRouteChangeComplete = (url: string, { shallow }: { shallow: boolean }) => {
            if (shallow) return
            const hashIndex = url.indexOf('#')
            if (hashIndex !== -1) {
                const hash = url.substring(hashIndex)
                setTimeout(() => scrollToHash(hash), 100)
            } else {
                window.scrollTo(0, 0)
            }
        }

        router.events.on('routeChangeComplete', onRouteChangeComplete)

        return () => {
            router.events.off('routeChangeComplete', onRouteChangeComplete)
            window.removeEventListener('hashchange', handleHashChange)
            window.removeEventListener('click', handleHashLinkClick, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={`${inter.className} ${overpass.variable}`}>
            <Header />
            <div className='relative' style={{ overflowX: 'clip', overflowY: 'visible' }}>
                <div id='smooth-wrapper-home'>
                    <div id='smooth-content-home'>
                        {children}
                        <Footer />
                    </div>
                </div>
            </div>
            <BaseDialog onClose={handleClose} onSubmit={handleSubmit} open={open} options={state} />
        </div>
    )
}

export default Layout
