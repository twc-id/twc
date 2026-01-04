import { defaultLanguage } from '@constant/i18n'
import AboutUs from '@modules/AboutUs'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || defaultLanguage, ['components', 'common', 'pages', 'about']))
    },
    revalidate: 600
})

export default AboutUs
