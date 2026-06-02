import { defaultLanguage } from '@constant/i18n'
import { WooCommerce } from '@lib/api'
import Detail from '@modules/Collections/Detail'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // No cache: fetch fresh data from WooCommerce on every request so API changes
    // (product detail, price history) appear immediately.
    ctx.res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate')

    let product: any = null
    let priceHistory: any[] = []
    try {
        const raw = ctx.params?.slug
        const slug = Array.isArray(raw) ? raw[raw.length - 1] : String(raw ?? '')
        if (!slug) return { notFound: true }

        const resp = await WooCommerce.get(`products?slug=${encodeURIComponent(slug)}&per_page=1`)
        const products = resp.data || []
        if (!products || products.length === 0) return { notFound: true }

        product = products[0]

        try {
            const priceHistRes = await WooCommerce.get(`price-history/${product.id}`)
            priceHistory = priceHistRes.data || []
        } catch (e) {
            priceHistory = []
        }
    } catch (err) {
        return { notFound: true }
    }

    return {
        props: {
            product,
            priceHistory,
            ...(await serverSideTranslations(ctx.locale || defaultLanguage, [
                'components',
                'pages',
                'common',
                'home',
                'collection'
            ]))
        }
    }
}

export default Detail
