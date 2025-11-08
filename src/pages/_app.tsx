import DismissableToast from '@components/DismissableToast'
import Layout from '@components/layout/Layout'
import { AppProps } from 'next/app'
import Router from 'next/router'
import { appWithTranslation } from 'next-i18next'
import nProgress from 'nprogress'

// Updated imports to use alias format
import '@styles/globals.css'
import '@styles/nprogress.css'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)

const MyApp = ({ Component, pageProps }: AppProps) => (
    <Layout>
        <DismissableToast />
        <Component {...pageProps} />
    </Layout>
)

export default appWithTranslation(MyApp)
