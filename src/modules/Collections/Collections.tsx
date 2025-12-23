import Seo from '@components/Seo'
import { WooCommerce } from '@lib/api'
import CTA from '@modules/Collections/components/CTA'
import Hero from '@modules/Collections/components/Hero'
import Wrapper from '@modules/Collections/components/Wrapper'
import useCollectionsFilterStore from '@store/useCollectionsFilterStore'
import { useTranslation } from 'next-i18next'
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
    const { t } = useTranslation(['collection'])
    const filters = useCollectionsFilterStore.useFilters()
    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [total, setTotal] = useState<number | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const tabLabels = [t('home:highlight.tabs.watches'), t('home:highlight.tabs.accessories')]
    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [brandOptions, setBrandOptions] = useState<Array<{ id: string; name: string }>>([])

    const categoryId = selectedTab === 0 ? 15 : 16

    // Fetch brands once and keep in parent so Sidebar can receive via props
    useEffect(() => {
        let mounted = true
        const fetchBrands = async () => {
            try {
                const perPage = 100
                const first = await WooCommerce.get(`products/brands?page=1&per_page=${perPage}`)
                const firstData = first.data || []
                const totalHeader =
                    parseInt(first.headers?.['x-wp-total'] ?? first.headers?.['X-WP-Total'] ?? '0', 10) || null
                if (!mounted) return
                let allBrands = firstData

                if (totalHeader && totalHeader > firstData.length) {
                    const pages = Math.ceil(totalHeader / perPage)
                    const promises: Array<Promise<any>> = []
                    for (let p = 2; p <= pages; p++) {
                        promises.push(WooCommerce.get(`products/brands?page=${p}&per_page=${perPage}`))
                    }
                    const rest = await Promise.all(promises)
                    rest.forEach((r) => {
                        allBrands = allBrands.concat(r.data || [])
                    })
                }

                const normalized = (allBrands || []).map((b: any) => ({ id: String(b.id), name: b.name }))
                if (mounted) setBrandOptions(normalized)
            } catch (err) {
                console.error('Error fetching brands', err)
            }
        }

        fetchBrands()
        return () => {
            mounted = false
        }
    }, [])

    const fetchPage = async (pageToFetch: number, append = false) => {
        try {
            if (append) setIsLoadingMore(true)
            else setIsLoading(true)
            // Use proper WooCommerce pagination: `page` and `per_page`
            const perPage = 10
            const params: string[] = []
            params.push(`page=${pageToFetch}`)
            params.push(`per_page=${perPage}`)

            // If brand filters are applied, query by brand(s). Otherwise use category.
            if (filters?.brands && filters.brands.length > 0) {
                // API accepts comma-separated brand ids
                params.push(`brand=${filters.brands.join(',')}`)
            } else {
                params.push(`category=${categoryId}`)
            }

            const response = await WooCommerce.get(`products?${params.join('&')}`)
            const fetched = response.data || []
            const totalHeader =
                parseInt(response.headers?.['x-wp-total'] ?? response.headers?.['X-WP-Total'] ?? '0', 10) || null
            setTotal(totalHeader)

            if (append) setData((prev) => [...prev, ...fetched])
            else setData(fetched)

            setHasMore(fetched.length === perPage)
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
    }, [filters, selectedTab])

    const handleLoadMore = async () => {
        const nextPage = page + 1
        setPage(nextPage)
        await fetchPage(nextPage, true)
    }

    return (
        <>
            <Seo title={`The Watch Collections - ${tabLabels[selectedTab]}`} />
            <Hero />
            <Wrapper
                data={data}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                total={total}
                tabs={tabLabels}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                brandOptions={brandOptions}
            />
            <CTA />
        </>
    )
}

export default Collections
