import { defaultLanguage } from '@constant/i18n'
import Collections from '@modules/Collections'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || defaultLanguage, ['components', 'common', 'pages', 'reserve']))
    },
    revalidate: 3600
})

export default Collections
