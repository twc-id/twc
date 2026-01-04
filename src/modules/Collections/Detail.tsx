import Seo from '@components/Seo'
import { WooCommerce } from '@lib/api'
import CTADetail from '@modules/Collections/components/CTADetail'
import DetailItem from '@modules/Collections/components/DetailItem'
import Suggestion from '@modules/Collections/components/Suggestion'
import React, { useEffect, useState } from 'react'

interface PageProps {
    product?: any
    priceHistory: any[]
}

const Detail: React.FC<PageProps> = ({ product, priceHistory }) => {
    const [productPrice, setProductPrice] = useState<any | null>(null)

    useEffect(() => {
        let mounted = true
        const fetchPrice = async () => {
            try {
                if (!product?.id) return
                const res = await WooCommerce.get(`product-price/${product.id}`)
                if (!mounted) return
                setProductPrice(res?.data ?? null)
            } catch (e) {
                if (mounted) setProductPrice(null)
            }
        }

        fetchPrice()
        return () => {
            mounted = false
        }
    }, [product?.id])
    const title = `${product?.brands?.[0]?.name} - ${product?.name}`
    const titleCapitalized = title
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    return (
        <>
            <Seo title={titleCapitalized} description={titleCapitalized} />
            <DetailItem product={product} priceHistory={priceHistory} productPrice={productPrice} />
            <Suggestion products={product} />
            <CTADetail />
        </>
    )
}

export default Detail
