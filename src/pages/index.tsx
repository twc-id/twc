import { defaultLanguage } from '@constant/i18n'
import Home from '@modules/Home'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || defaultLanguage, ['components', 'common', 'pages', 'home']))
    }
})

export default Home
