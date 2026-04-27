import { defaultLanguage } from '@constant/i18n'
import TermsCondition from '@modules/TermsCondition'
import { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale || defaultLanguage, [
            'components',
            'common',
            'pages',
            'privacy-terms'
        ])),
        locale: locale || defaultLanguage
    },
    revalidate: 600
})

export default TermsCondition
