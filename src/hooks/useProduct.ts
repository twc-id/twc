import { WooCommerce } from '@lib/api'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

// ==================== TYPES ====================

export interface ProductBrand {
    id: number
    name: string
    slug: string
}

export interface ProductCategory {
    id: number
    name: string
    slug: string
}

export interface ProductImage {
    id: number
    src: string
    name: string
    alt: string
}

export interface ProductMetaData {
    id: number
    key: string
    value: any
}

export interface Product {
    id: number
    name: string
    slug: string
    permalink: string
    date_created: string
    date_modified: string
    type: string
    status: string
    featured: boolean
    catalog_visibility: string
    description: string
    short_description: string
    sku: string
    price: string
    regular_price: string
    sale_price: string
    on_sale: boolean
    purchasable: boolean
    total_sales: number
    virtual: boolean
    downloadable: boolean
    categories: ProductCategory[]
    brands?: ProductBrand[]
    images: ProductImage[]
    attributes: any[]
    meta_data: ProductMetaData[]
    stock_status: string
    stock_quantity: number | null
    manage_stock: boolean
    backorders: string
    backorders_allowed: boolean
    related_ids?: number[]
}

export interface ProductPrice {
    id: number
    product_id: number
    price: string
    stock_status: string
    stock_quantity: number | null
    updated_at: string
}

export interface PriceHistory {
    id: number
    product_id: number
    price: string
    recorded_at: string
}

export interface ProductsResponse {
    data: Product[]
    total: number | null
    totalPages: number | null
    hasMore: boolean
}

export type SortByOption = 'default' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc'

export interface ProductFilters {
    brands?: string[]
    condition?: string[]
    gender?: string[]
    availability?: string[]
    priceRange?: {
        min?: string
        max?: string
    }
    sortBy?: SortByOption
}

export interface ProductParams {
    page?: number
    per_page?: number
    category?: number | number[]
    slug?: string
    include?: number[]
    search?: string
    orderby?: 'date' | 'id' | 'title' | 'slug' | 'modified' | 'price'
    order?: 'asc' | 'desc'
    filters?: ProductFilters
}

// ==================== API FUNCTIONS ====================

/**
 * Build filter query parameters from ProductFilters
 * Returns object with queryParams array and metaArr array for by-meta endpoint
 */
export const buildProductFiltersQuery = (filters: ProductFilters) => {
    const queryParams: string[] = []
    const metaArr: Array<any> = []
    let useMetaEndpoint = false

    // Sorting
    if (filters.sortBy) {
        if (filters.sortBy === 'price-asc' || filters.sortBy === 'price-desc') {
            queryParams.push('orderby=price')
        }
        if (filters.sortBy === 'year-asc' || filters.sortBy === 'year-desc') {
            queryParams.push('orderby=date')
        }
        if (filters.sortBy === 'price-asc' || filters.sortBy === 'year-asc') {
            queryParams.push('order=asc')
        }
        if (filters.sortBy === 'price-desc' || filters.sortBy === 'year-desc') {
            queryParams.push('order=desc')
        }
    }

    // Brands
    if (filters.brands && filters.brands.length > 0) {
        queryParams.push(`product_brand=${filters.brands.join(',')}`)
        useMetaEndpoint = true
    }

    // Condition mapping
    const preOwnedMap: Record<string, string> = {
        'pre-owned-unworn': 'Unworn',
        'pre-owned-like-new': 'Like New',
        'pre-owned-very-mint': 'Very Mint',
        'pre-owned-mint': 'Mint',
        'pre-owned-good': 'Good'
    }

    if (filters.condition && filters.condition.length > 0) {
        if (filters.condition.includes('brand-new')) {
            metaArr.push({ key: 'is_new', value: '1' })
            useMetaEndpoint = true
        }

        if (filters.condition.includes('new-old-stock')) {
            metaArr.push({ key: 'basic-info-status', value: 'New Old Stock' })
            useMetaEndpoint = true
        }

        const selectedPreOwned = filters.condition.filter((c: string) => c.startsWith('pre-owned-'))
        if (selectedPreOwned.length > 0) {
            metaArr.push({ key: 'basic-info-status', value: 'Pre-Owned' })
            selectedPreOwned.forEach((id: string) => {
                const condValue = preOwnedMap[id]
                if (condValue) {
                    metaArr.push({ key: 'basic-info-condition', value: condValue })
                }
            })
            useMetaEndpoint = true
        }
    }

    // Gender
    if (filters.gender && filters.gender.length > 0) {
        filters.gender.forEach((g: string) => {
            metaArr.push({ key: 'basic-info-gender', value: g })
        })
        useMetaEndpoint = true
    }

    // Availability
    if (filters.availability && filters.availability.length > 0) {
        queryParams.push(`stock_status=${filters.availability.join(',')}`)
        useMetaEndpoint = true
    }

    // Price range
    if (filters.priceRange?.min) {
        queryParams.push(`min_price=${encodeURIComponent(String(filters.priceRange.min))}`)
    }
    if (filters.priceRange?.max) {
        queryParams.push(`max_price=${encodeURIComponent(String(filters.priceRange.max))}`)
    }

    return { queryParams, metaArr, useMetaEndpoint }
}

/**
 * Fetch products with optional filters and pagination
 */
const fetchProducts = async (params?: ProductParams): Promise<ProductsResponse> => {
    try {
        const perPage = params?.per_page || 10
        const page = params?.page || 1
        const queryParams: string[] = []

        queryParams.push(`page=${page}`)
        queryParams.push(`per_page=${perPage}`)

        if (params?.category) {
            const categoryId = Array.isArray(params.category) ? params.category.join(',') : params.category
            queryParams.push(`category=${categoryId}`)
        }

        if (params?.slug) {
            queryParams.push(`slug=${encodeURIComponent(params.slug)}`)
        }

        if (params?.include && params.include.length > 0) {
            queryParams.push(`include=${params.include.join(',')}`)
        }

        if (params?.search) {
            queryParams.push(`search=${encodeURIComponent(params.search)}`)
        }

        // Build filter queries using shared function
        let metaArr: Array<any> = []
        let useMetaEndpoint = false

        if (params?.filters) {
            const filterQuery = buildProductFiltersQuery(params.filters)
            queryParams.push(...filterQuery.queryParams)
            metaArr = filterQuery.metaArr
            useMetaEndpoint = filterQuery.useMetaEndpoint
        }

        let response
        if (useMetaEndpoint && metaArr.length > 0) {
            const metaParam = encodeURIComponent(JSON.stringify(metaArr))
            response = await WooCommerce.get(`products/by-meta?meta=${metaParam}&relation=AND&${queryParams.join('&')}`)
        } else {
            response = await WooCommerce.get(`products?${queryParams.join('&')}`)
        }

        const data = response.data?.data || response.data || []
        const totalHeader =
            parseInt(response.headers?.['x-wp-total'] ?? response.headers?.['X-WP-Total'] ?? '0', 10) || null

        return {
            data,
            total: totalHeader,
            totalPages: totalHeader ? Math.ceil(totalHeader / perPage) : null,
            hasMore: data.length === perPage
        }
    } catch (error) {
        console.error('Error fetching products:', error)
        throw error
    }
}

/**
 * Fetch a single product by ID
 */
const fetchProductById = async (id: number): Promise<Product> => {
    try {
        const response = await WooCommerce.get(`products/${id}`)
        return response.data
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error)
        throw error
    }
}

/**
 * Fetch a single product by slug
 */
const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
        const response = await WooCommerce.get(`products?slug=${encodeURIComponent(slug)}&per_page=1`)
        const products = response.data || []
        return products.length > 0 ? products[0] : null
    } catch (error) {
        console.error(`Error fetching product by slug ${slug}:`, error)
        throw error
    }
}

/**
 * Fetch product price (real-time pricing)
 */
const fetchProductPrice = async (productId: number): Promise<ProductPrice | null> => {
    try {
        const response = await WooCommerce.get(`product-price/${productId}`)
        return response.data ?? null
    } catch (error) {
        console.error(`Error fetching price for product ${productId}:`, error)
        return null
    }
}

/**
 * Fetch product price history
 */
const fetchPriceHistory = async (productId: number): Promise<PriceHistory[]> => {
    try {
        const response = await WooCommerce.get(`price-history/${productId}`)
        return response.data || []
    } catch (error) {
        console.error(`Error fetching price history for product ${productId}:`, error)
        return []
    }
}

/**
 * Fetch product brands
 */
const fetchProductBrands = async (): Promise<ProductBrand[]> => {
    try {
        const perPage = 100
        const first = await WooCommerce.get(`products/brands?page=1&per_page=${perPage}`)
        const firstData = first.data || []
        const totalHeader = parseInt(first.headers?.['x-wp-total'] ?? first.headers?.['X-WP-Total'] ?? '0', 10) || null

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

        return allBrands.map((b: any) => ({
            id: b.id,
            name: b.name,
            slug: b.slug
        }))
    } catch (error) {
        console.error('Error fetching product brands:', error)
        return []
    }
}

/**
 * Fetch related products
 */
const fetchRelatedProducts = async (productId: number, limit: number = 4): Promise<Product[]> => {
    try {
        // First get the product to find related IDs
        const productRes = await WooCommerce.get(`products/${productId}`)
        const product = productRes.data
        const relatedIds = product.related_ids || []

        if (relatedIds.length === 0) return []

        const includeParam = relatedIds.slice(0, limit).join(',')
        const response = await WooCommerce.get(`products?include=${includeParam}&per_page=${limit}`)
        return response.data || []
    } catch (error) {
        console.error(`Error fetching related products for ${productId}:`, error)
        return []
    }
}

// ==================== HOOKS ====================

/**
 * Hook to fetch products with filters and pagination
 */
export const useProducts = (
    params?: ProductParams,
    options?: Omit<UseQueryOptions<ProductsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<ProductsResponse, Error>({
        queryKey: ['products', params],
        queryFn: () => fetchProducts(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options
    })
}

/**
 * Hook to fetch a single product by ID
 */
export const useProduct = (id: number, options?: Omit<UseQueryOptions<Product, Error>, 'queryKey' | 'queryFn'>) => {
    return useQuery<Product, Error>({
        queryKey: ['product', id],
        queryFn: () => fetchProductById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        ...options
    })
}

/**
 * Hook to fetch a single product by slug
 */
export const useProductBySlug = (
    slug: string,
    options?: Omit<UseQueryOptions<Product | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<Product | null, Error>({
        queryKey: ['product', 'slug', slug],
        queryFn: () => fetchProductBySlug(slug),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        ...options
    })
}

/**
 * Hook to fetch product price (real-time)
 */
export const useProductPrice = (
    productId: number,
    options?: Omit<UseQueryOptions<ProductPrice | null, Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<ProductPrice | null, Error>({
        queryKey: ['product-price', productId],
        queryFn: () => fetchProductPrice(productId),
        enabled: !!productId,
        staleTime: 30 * 1000, // 30 seconds - price changes frequently
        refetchInterval: 60 * 1000, // Refetch every minute
        ...options
    })
}

/**
 * Hook to fetch product price history
 */
export const usePriceHistory = (
    productId: number,
    options?: Omit<UseQueryOptions<PriceHistory[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<PriceHistory[], Error>({
        queryKey: ['price-history', productId],
        queryFn: () => fetchPriceHistory(productId),
        enabled: !!productId,
        staleTime: 5 * 60 * 1000,
        ...options
    })
}

/**
 * Hook to fetch all product brands
 */
export const useProductBrands = (options?: Omit<UseQueryOptions<ProductBrand[], Error>, 'queryKey' | 'queryFn'>) => {
    return useQuery<ProductBrand[], Error>({
        queryKey: ['product-brands'],
        queryFn: fetchProductBrands,
        staleTime: 30 * 60 * 1000, // 30 minutes - brands don't change often
        ...options
    })
}

/**
 * Hook to fetch related products
 */
export const useRelatedProducts = (
    productId: number,
    limit: number = 4,
    options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<Product[], Error>({
        queryKey: ['related-products', productId, limit],
        queryFn: () => fetchRelatedProducts(productId, limit),
        enabled: !!productId,
        staleTime: 5 * 60 * 1000,
        ...options
    })
}

// Export API functions for direct use if needed
export {
    fetchPriceHistory,
    fetchProductBrands,
    fetchProductById,
    fetchProductBySlug,
    fetchProductPrice,
    fetchProducts,
    fetchRelatedProducts
}
