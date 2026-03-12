import Seo from '@components/Seo'
import { useAssets } from '@hooks/useAsset'
import { buildProductFiltersQuery, useProductBrands } from '@hooks/useProduct'
import { WooCommerce } from '@lib/api'
import CTA from '@modules/Collections/components/CTA'
import Hero from '@modules/Collections/components/Hero'
import Wrapper from '@modules/Collections/components/Wrapper'
import useCollectionsFilterStore from '@store/useCollectionsFilterStore'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useRef, useState } from 'react'

const TAB_MAP = {
    watches: 0,
    accessories: 1
} as const

type TabKey = keyof typeof TAB_MAP

const DEFAULT_TAB: TabKey = 'watches'

const Collections = () => {
    const { t } = useTranslation(['collection'])
    const { assets } = useAssets()

    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [total, setTotal] = useState<number | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [isInitialized, setIsInitialized] = useState(false)

    const router = useRouter()
    const setFilter = useCollectionsFilterStore.useSetFilter()
    const resetFilters = useCollectionsFilterStore.useResetFilters()

    const filters = useCollectionsFilterStore.useFilters()

    // Track if filters have been reset on mount
    const hasResetFiltersRef = useRef(false)

    const heroBanner = assets?.find((asset) => asset.name === 'our-collection-1')?.media?.url
    const ctaImage = assets?.find((asset) => asset.name === 'our-collection-2')?.media?.url

    const categoryId = selectedTab === 0 ? 15 : 16
    const tabLabels = [t('home:highlight.tabs.watches'), t('home:highlight.tabs.accessories')]

    // Use the product brands hook instead of manual fetching
    const { data: brands = [], isLoading: isLoadingBrands } = useProductBrands()

    // Transform brands to the format expected by the component
    const brandOptions = brands.map((b) => ({ id: String(b.id), name: b.name }))

    const fetchPage = async (pageToFetch: number, append = false) => {
        try {
            if (append) setIsLoadingMore(true)
            else setIsLoading(true)

            const perPage = 10
            const baseParams: string[] = [`page=${pageToFetch}`, `per_page=${perPage}`, `category=${categoryId}`]

            // Build filter queries using shared function from useProduct.ts
            const { queryParams: filterParams, metaArr, useMetaEndpoint } = buildProductFiltersQuery(filters || {})

            const hasFilters = useMetaEndpoint || filterParams.length > 0

            if (!hasFilters) {
                // No filters - use simple products endpoint
                const response = await WooCommerce.get(`products?${baseParams.join('&')}`)
                const fetched = response.data || []
                const totalHeader =
                    parseInt(response.headers?.['x-wp-total'] ?? response.headers?.['X-WP-Total'] ?? '0', 10) || null
                setTotal(totalHeader)

                if (append) setData((prev) => [...prev, ...fetched])
                else setData(fetched)

                setHasMore(fetched.length === perPage)
            } else {
                // Has filters - use by-meta endpoint
                const allParams = [...baseParams, ...filterParams]
                const metaParam = encodeURIComponent(JSON.stringify(metaArr))
                const response = await WooCommerce.get(
                    `products/by-meta?meta=${metaParam}&relation=AND&${allParams.join('&')}`
                )
                const fetched = response.data?.data || response.data || []
                const totalHeader =
                    parseInt(response.headers?.['x-wp-total'] ?? response.headers?.['X-WP-Total'] ?? '0', 10) || null
                setTotal(totalHeader)

                if (append) setData((prev) => [...prev, ...fetched])
                else setData(fetched)

                setHasMore(fetched.length === perPage)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setIsLoading(false)
            setIsLoadingMore(false)
        }
    }

    useEffect(() => {
        if (!router.isReady || !isInitialized) return
        setPage(1)
        fetchPage(1, false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, selectedTab, router.isReady, isInitialized])

    // Reset filters when component first mounts (when user navigates to collections page)
    // But preserve filters from URL query parameters
    useEffect(() => {
        if (!router.isReady || hasResetFiltersRef.current) return

        // Check if there are filter-related query parameters
        const hasFilterParams =
            router.query.product_brand ||
            router.query.availability ||
            router.query.condition ||
            router.query.gender ||
            router.query.min_price ||
            router.query.max_price ||
            router.query.sortby

        if (hasFilterParams) {
            // Set filters from URL query parameters instead of resetting
            if (router.query.product_brand) {
                const brandVal = Array.isArray(router.query.product_brand)
                    ? router.query.product_brand
                    : [router.query.product_brand]
                setFilter('brands', brandVal)
            }
            if (router.query.availability) {
                const availVal = Array.isArray(router.query.availability)
                    ? router.query.availability
                    : [router.query.availability]
                setFilter('availability', availVal)
            }
            if (router.query.condition) {
                const condVal = Array.isArray(router.query.condition)
                    ? router.query.condition
                    : [router.query.condition]
                setFilter('condition', condVal)
            }
            if (router.query.gender) {
                const genderVal = Array.isArray(router.query.gender) ? router.query.gender : [router.query.gender]
                setFilter('gender', genderVal)
            }
            if (router.query.min_price || router.query.max_price) {
                setFilter('priceRange', {
                    min: router.query.min_price ? String(router.query.min_price) : undefined,
                    max: router.query.max_price ? String(router.query.max_price) : undefined
                })
            }
            if (router.query.sortby) {
                const sortVal = router.query.sortby as string
                // Validate sortBy value
                if (['default', 'price-asc', 'price-desc', 'year-asc', 'year-desc'].includes(sortVal)) {
                    setFilter('sortBy', sortVal as 'default' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc')
                }
            }
        } else {
            // No filter params in URL, reset filters
            resetFilters()
        }

        hasResetFiltersRef.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady])

    const handleLoadMore = async () => {
        const nextPage = page + 1
        setPage(nextPage)
        await fetchPage(nextPage, true)
    }

    const handleTabChange = (idx: number) => {
        // hindari replace jika sama
        if (idx === selectedTab) return

        const tabKey: TabKey = idx === 0 ? 'watches' : 'accessories'

        // update selectedTab immediately so fetchPage uses correct category
        setSelectedTab(idx)

        // reset filters when switching to accessories
        if (tabKey === 'accessories') {
            setFilter('brands', [])
            setFilter('availability', [])
            setFilter('condition', [])
            setFilter('gender', [])
            setFilter('priceRange', {})
            setFilter('sortBy', 'default')
        }

        // update URL (remove tab param for watches, add for accessories)
        setTimeout(() => {
            router.replace(
                {
                    pathname: router.pathname,
                    query: tabKey === DEFAULT_TAB ? {} : { tab: tabKey }
                },
                undefined,
                { shallow: true }
            )
        }, 0)
    }

    // Sync tab from URL when user navigates with browser back/forward
    useEffect(() => {
        if (!router.isReady) return

        const tabFromUrl = (router.query.tab as TabKey) || DEFAULT_TAB
        const nextTabIndex = TAB_MAP[tabFromUrl]

        // Set tab from URL and mark as initialized
        if (nextTabIndex !== selectedTab) {
            setSelectedTab(nextTabIndex)

            // reset filters when navigating to accessories
            if (tabFromUrl === 'accessories') {
                setFilter('brands', [])
                setFilter('availability', [])
                setFilter('condition', [])
                setFilter('gender', [])
                setFilter('priceRange', {})
                setFilter('sortBy', 'default')
            }
        }

        // Mark as initialized after first sync
        if (!isInitialized) {
            setIsInitialized(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.tab, router.isReady])

    const decodeHTMLEntities = (text: string) => {
        if (typeof window === 'undefined') return text // SSR safety
        const txt = document.createElement('textarea')
        txt.innerHTML = text
        return txt.value
    }

    const filterBrandsName = brandOptions
        .filter((b) => filters.brands.includes(b.id))
        .map((b) => decodeHTMLEntities(b.name))

    const filterBrands = filterBrandsName.join(', ')

    const title = filterBrands
        ? `${filterBrands} | The Watch Collections`
        : 'The Watch Collections - Your proper wristgame supply'

    return (
        <>
            <Seo title={title} />
            <Hero image={heroBanner} />
            <Wrapper
                data={data}
                isLoading={isLoading}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
                total={total}
                tabs={tabLabels}
                selectedTab={selectedTab}
                onTabChange={handleTabChange}
                brandOptions={brandOptions}
                brandLoading={isLoadingBrands}
            />
            <CTA image={ctaImage} />
        </>
    )
}

export default Collections
