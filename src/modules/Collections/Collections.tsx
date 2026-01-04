import Seo from '@components/Seo'
import { WooCommerce } from '@lib/api'
import CTA from '@modules/Collections/components/CTA'
import Hero from '@modules/Collections/components/Hero'
import Wrapper from '@modules/Collections/components/Wrapper'
import useCollectionsFilterStore from '@store/useCollectionsFilterStore'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'

const TAB_MAP = {
    watches: 0,
    accessories: 1
} as const

type TabKey = keyof typeof TAB_MAP

const DEFAULT_TAB: TabKey = 'watches'

const Collections = () => {
    const { t } = useTranslation(['collection'])

    const [data, setData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [total, setTotal] = useState<number | null>(null)
    const [isLoadingMore, setIsLoadingMore] = useState(false)

    const [selectedTab, setSelectedTab] = useState<number>(0)
    const [isInitialized, setIsInitialized] = useState(false)
    const [brandOptions, setBrandOptions] = useState<Array<{ id: string; name: string }>>([])
    const [isLoadingBrands, setIsLoadingBrands] = useState(true)

    const router = useRouter()
    const setFilter = useCollectionsFilterStore.useSetFilter()

    const filters = useCollectionsFilterStore.useFilters()

    const categoryId = selectedTab === 0 ? 15 : 16
    const tabLabels = [t('home:highlight.tabs.watches'), t('home:highlight.tabs.accessories')]

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
                if (mounted) setIsLoadingBrands(false)
            } catch (err) {
                console.error('Error fetching brands', err)
                if (mounted) setIsLoadingBrands(false)
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

            // Build a single meta-array combining selected filters.
            // This sends one request to `products/by-meta` with multiple meta objects (can include multiple entries per key).
            const brandValues = filters?.brands || []
            const productBrandParam = brandValues.length > 0 ? brandValues.join(',') : ''

            // Sorting params (support price and date sorting)
            let orderByParam = ''
            let orderParam = ''
            if (filters?.sortBy) {
                if (filters.sortBy === 'price-asc' || filters.sortBy === 'price-desc') orderByParam = 'orderby=price'
                if (filters.sortBy === 'year-asc' || filters.sortBy === 'year-desc') orderByParam = 'orderby=date'

                if (filters.sortBy === 'price-asc' || filters.sortBy === 'year-asc') orderParam = 'order=asc'
                if (filters.sortBy === 'price-desc' || filters.sortBy === 'year-desc') orderParam = 'order=desc'
            }

            const metaArr: Array<any> = []

            // Condition: include is_new if selected, and include status+condition pairs for pre-owned selections.
            const conditionValues = filters?.condition || []
            const preOwnedMap: Record<string, string> = {
                'pre-owned-like-new': 'Like New',
                'pre-owned-very-good': 'Very Good',
                'pre-owned-good': 'Good',
                'pre-owned-fair': 'Fair',
                'pre-owned-incomplete': 'Incomplete'
            }
            if (conditionValues.length > 0) {
                if (conditionValues.includes('brand-new')) {
                    metaArr.push({ key: 'is_new', value: '1' })
                }
                const selectedPreOwned = conditionValues.filter((c: string) => c.startsWith('pre-owned-'))
                if (selectedPreOwned.length > 0) {
                    // add status once
                    metaArr.push({ key: 'basic-info-status', value: 'Pre-Owned' })
                    // add one entry per selected condition
                    selectedPreOwned.forEach((id: string) => {
                        const condValue = preOwnedMap[id]
                        if (!condValue) return
                        metaArr.push({ key: 'basic-info-condition', value: condValue })
                    })
                }
            }

            // Gender: add each selected gender as its own meta entry (multiple entries allowed)
            const genderValues = filters?.gender || []
            genderValues.forEach((g: string) => metaArr.push({ key: 'basic-info-gender', value: g }))

            // Availability: add each selected availability as `stock_status` meta entry
            // Availability values (will be sent as query param `stock_status` for /by-meta)
            const availabilityValues = filters?.availability || []

            // You can add other meta entries here (availability, price range as two entries etc.)

            // If no meta entries, no brand param, and no price range, fallback to products?
            const hasPriceRange = !!(filters.priceRange?.min || filters.priceRange?.max)
            const hasAvailability = availabilityValues.length > 0

            if (metaArr.length === 0 && !productBrandParam && !hasPriceRange && !hasAvailability) {
                params.push(`category=${categoryId}`)
                if (filters.priceRange?.min)
                    params.push(`min_price=${encodeURIComponent(String(filters.priceRange.min))}`)
                if (filters.priceRange?.max)
                    params.push(`max_price=${encodeURIComponent(String(filters.priceRange.max))}`)
                if (orderByParam) params.push(orderByParam)
                if (orderParam) params.push(orderParam)
                const response = await WooCommerce.get(`products?${params.join('&')}`)
                const fetched = response.data || []
                const totalHeader =
                    parseInt(response.headers?.['x-wp-total'] ?? response.headers?.['X-WP-Total'] ?? '0', 10) || null
                setTotal(totalHeader)

                if (append) {
                    setData((prev) => [...prev, ...fetched])
                } else {
                    setData(fetched)
                }

                setHasMore(fetched.length === perPage)
            } else {
                // Build single by-meta request with combined meta array and optional product_brand param

                const q: string[] = []
                q.push(`page=${pageToFetch}`)
                q.push(`per_page=${perPage}`)
                q.push(`category=${categoryId}`)
                if (filters.priceRange?.min) q.push(`min_price=${encodeURIComponent(String(filters.priceRange.min))}`)
                if (filters.priceRange?.max) q.push(`max_price=${encodeURIComponent(String(filters.priceRange.max))}`)
                if (productBrandParam) q.push(`product_brand=${productBrandParam}`)
                if (availabilityValues.length > 0) q.push(`stock_status=${availabilityValues.join(',')}`)
                if (orderByParam) q.push(orderByParam)
                if (orderParam) q.push(orderParam)
                const metaParam = encodeURIComponent(JSON.stringify(metaArr))
                const response = await WooCommerce.get(`products/by-meta?meta=${metaParam}&relation=AND&${q.join('&')}`)
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
                onTabChange={handleTabChange}
                brandOptions={brandOptions}
                brandLoading={isLoadingBrands}
            />
            <CTA />
        </>
    )
}

export default Collections
