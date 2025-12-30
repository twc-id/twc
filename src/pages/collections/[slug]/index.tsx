import { defaultLanguage } from '@constant/i18n'
import { WooCommerce } from '@lib/api'
import Detail from '@modules/Collections/Detail'
import { GetStaticPaths, GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticPaths: GetStaticPaths = async () => {
    try {
        const perPage = 100
        const first = await WooCommerce.get(`products?page=1&per_page=${perPage}`)
        const firstData = first.data || []
        const totalHeader = parseInt(first.headers?.['x-wp-total'] ?? first.headers?.['X-WP-Total'] ?? '0', 10) || null

        let allProducts = firstData
        if (totalHeader && totalHeader > firstData.length) {
            const pages = Math.ceil(totalHeader / perPage)
            const promises: Array<Promise<any>> = []
            for (let p = 2; p <= pages; p++) promises.push(WooCommerce.get(`products?page=${p}&per_page=${perPage}`))
            const rest = await Promise.all(promises)
            rest.forEach((r) => {
                allProducts = allProducts.concat(r.data || [])
            })
        }

        const paths = (allProducts || []).map((p: any) => ({ params: { slug: String(p.slug) } }))

        return { paths, fallback: 'blocking' }
    } catch (err) {
        console.error('Error building product paths', err)
        return { paths: [], fallback: 'blocking' }
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    console.log(ctx, 'called here')
    try {
        const raw = ctx.params?.slug
        const slug = Array.isArray(raw) ? raw[raw.length - 1] : String(raw ?? '')
        if (!slug) return { notFound: true }

        const resp = await WooCommerce.get(`products?slug=${encodeURIComponent(slug)}&per_page=1`)
        const products = resp.data || []
        if (!products || products.length === 0) return { notFound: true }

        const product = products[0]

        // fetch price history and product price in parallel (non-blocking failures)
        let priceHistory: any[] = []
        let productPrice: any = null

        const [priceHistRes, productPriceRes] = await Promise.allSettled([
            WooCommerce.get(`price-history/${product.id}`),
            WooCommerce.get(`product-price/${product.id}`)
        ])

        if (priceHistRes.status === 'fulfilled') {
            try {
                priceHistory = priceHistRes.value.data || []
            } catch (e) {
                priceHistory = []
            }
        } else {
            priceHistory = []
        }

        if (productPriceRes.status === 'fulfilled') {
            try {
                productPrice = productPriceRes.value.data || null
            } catch (e) {
                productPrice = null
            }
        } else {
            productPrice = null
        }

        return {
            props: {
                product,
                priceHistory,
                productPrice,
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
    } catch (err) {
        return { notFound: true }
    }
}

export default Detail
