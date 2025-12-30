import CTADetail from '@modules/Collections/components/CTADetail'
import DetailItem from '@modules/Collections/components/DetailItem'
import Suggestion from '@modules/Collections/components/Suggestion'
import React from 'react'

interface PageProps {
    product?: any
    priceHistory: any[]
    productPrice: any
}

const Detail: React.FC<PageProps> = ({ product, priceHistory, productPrice }) => {
    return (
        <>
            <DetailItem product={product} priceHistory={priceHistory} productPrice={productPrice} />
            <Suggestion products={product} />
            <CTADetail />
        </>
    )
}

export default Detail
