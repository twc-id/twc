import { defaultLanguage } from '@constant/i18n'
import Sell from '@modules/Sell'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || defaultLanguage, ['components', 'common', 'pages', 'sell']))
    },
    revalidate: 600
})

export default Sell
