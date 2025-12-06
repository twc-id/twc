import DismissableToast from '@components/DismissableToast'
import Layout from '@components/layout/Layout'
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppProps } from 'next/app'
import Head from 'next/head'
import Router from 'next/router'
import { appWithTranslation } from 'next-i18next'
import nProgress from 'nprogress'
import { useState } from 'react'

// Updated imports to use alias format
import '@styles/globals.css'
import '@styles/nprogress.css'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

const MyApp = ({ Component, pageProps }: AppProps) => {
    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient}>
            <Head>
                <meta name='viewport' content='width=device-width, initial-scale=1' />
            </Head>
            <HydrationBoundary state={pageProps.dehydratedState}>
                <Layout>
                    <DismissableToast />
                    <Component {...pageProps} />
                </Layout>
            </HydrationBoundary>
        </QueryClientProvider>
    )
}

export default appWithTranslation(MyApp)
