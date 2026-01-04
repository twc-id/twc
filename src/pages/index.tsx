import { defaultLanguage } from '@constant/i18n'
import Home from '@modules/Home'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || defaultLanguage, ['components', 'common', 'pages', 'home']))
    },
    revalidate: 600
})

export default Home
