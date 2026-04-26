import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import { useProductPrice } from '@hooks/useProduct'
import CTADetail from '@modules/Collections/components/CTADetail'
import DetailItem from '@modules/Collections/components/DetailItem'
import Suggestion from '@modules/Collections/components/Suggestion'
import useProductStore from '@store/useProductStore'
import React, { useEffect } from 'react'

interface PageProps {
    product?: any
    priceHistory: any[]
}

const Detail: React.FC<PageProps> = ({ product, priceHistory }) => {
    // Use the product price hook instead of manual fetching
    const { data: productPrice } = useProductPrice(product?.id)
    const { assets } = useAssets()
    const setCurrentProduct = useProductStore((s) => s.setCurrentProduct)

    useEffect(() => {
        setCurrentProduct(product)
        return () => setCurrentProduct(null)
    }, [product, setCurrentProduct])
    const imageCta = assets?.find((asset) => asset.name === 'product-detail-1')?.media?.url

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
            <CTADetail image={imageCta} />
        </>
    )
}

export default Detail
