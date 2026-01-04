import { defaultLanguage } from '@constant/i18n'
import Reserve from '@modules/Reserve'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || defaultLanguage, ['components', 'common', 'pages', 'reserve']))
    },
    revalidate: 600
})

export default Reserve
