import Router from 'next/router'
import { useEffect } from 'react'

import { trackPageView } from './ga'

export const useGATracking = () => {
    useEffect(() => {
        const handleRouteChange = (url: string) => {
            trackPageView(url)
        }

        Router.events.on('routeChangeComplete', handleRouteChange)

        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [])
}
