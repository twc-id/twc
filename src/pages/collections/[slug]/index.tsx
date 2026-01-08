import { defaultLanguage } from '@constant/i18n'
import { WooCommerce } from '@lib/api'
import Detail from '@modules/Collections/Detail'
import { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticPaths: GetStaticPaths = async () => {
    // Avoid fetching every product at build time (can be very slow for large catalogs).
    // Use on-demand rendering with `fallback: 'blocking'` so pages are generated when first requested.
    return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
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

        // `productPrice` (harga/stok yang berubah sangat cepat) dipindahkan ke client-side
        // sehingga halaman tetap SSG + ISR dan tidak tergantung pada data realtime per-build.
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
        },
        revalidate: 60
    }
}

export default Detail
