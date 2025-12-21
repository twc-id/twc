import Seo from '@components/Seo'
import { WooCommerce } from '@lib/api'
import CTA from '@modules/Collections/components/CTA'
import Hero from '@modules/Collections/components/Hero'
import Wrapper from '@modules/Collections/components/Wrapper'
import useCollectionsFilterStore from '@store/useCollectionsFilterStore'
import React, { useEffect, useState } from 'react'

// // Apply brand filter
// if (filters.brands.length > 0) {
//     filteredData = filteredData.filter((product: any) =>
//         product.brands?.some((brand: any) => filters.brands.includes(brand.id.toString()))
//     )
// }

// // Apply availability filter
// if (filters.availability.length > 0) {
//     filteredData = filteredData.filter((product: any) => {
//         const stockStatus = product.stock_status
//         return filters.availability.includes(stockStatus)
//     })
// }

// // Apply condition filter
// if (filters.condition.length > 0) {
//     filteredData = filteredData.filter((product: any) => {
//         const condition = product.meta_data?.find((meta: any) => meta.key === 'condition')?.value
//         return filters.condition.includes(condition)
//     })
// }

// // Apply gender filter
// if (filters.gender.length > 0) {
//     filteredData = filteredData.filter((product: any) => {
//         const gender = product.meta_data?.find((meta: any) => meta.key === 'gender')?.value
//         return filters.gender.includes(gender)
//     })
// }

// // Apply price range filter
// if (filters.priceRange.min || filters.priceRange.max) {
//     filteredData = filteredData.filter((product: any) => {
//         const price = parseFloat(product.price)
//         if (filters.priceRange.min && price < filters.priceRange.min) return false
//         if (filters.priceRange.max && price > filters.priceRange.max) return false
//         return true
//     })
// }

// // Apply sorting
// if (filters.sortBy !== 'default') {
//     filteredData = [...filteredData].sort((a: any, b: any) => {
//         switch (filters.sortBy) {
//             case 'price-asc':
//                 return parseFloat(a.price) - parseFloat(b.price)
//             case 'price-desc':
//                 return parseFloat(b.price) - parseFloat(a.price)
//             case 'name-asc':
//                 return a.name.localeCompare(b.name)
//             case 'name-desc':
//                 return b.name.localeCompare(a.name)
//             default:
//                 return 0
//         }
//     })
// }

const Collections = () => {
    const filters = useCollectionsFilterStore.useFilters()
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [total, setTotal] = useState<number | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const fetchPage = async (pageToFetch: number, append = false) => {
        try {
            if (append) setIsLoadingMore(true)
            else setIsLoading(true)

            const response = await WooCommerce.get(`products?offset=${pageToFetch}`)
            const fetched = response.data || []
            const totalHeader =
                parseInt(response.headers?.['x-wp-total'] ?? response.headers?.['X-WP-Total'] ?? '0', 10) || null
            setTotal(totalHeader)

            if (append) setData((prev) => [...prev, ...fetched])
            else setData(fetched)

            setHasMore(fetched.length === 10)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }

    useEffect(() => {
        setPage(1)
        fetchPage(1, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters])

    const handleLoadMore = async () => {
        const nextPage = page + 1
        setPage(nextPage)
        await fetchPage(nextPage, true)
    }

    return (
        <>
            <Seo title='Collections' />
            <Hero />
            <Wrapper
                data={data}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                total={total}
            />
            <CTA />
        </>
    )
}

export default Collections
