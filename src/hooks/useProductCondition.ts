import { API_URL } from '@constant/env'
import { useQuery } from '@tanstack/react-query'

// ==================== TYPES ====================

export interface ProductCondition {
    id: number
    name: string
    name_id: string
    description_en: string
    description_id: string
    sort_order: number
}

export interface ProductConditionsResponse {
    data: ProductCondition[]
}

// ==================== API FUNCTION ====================

const fetchProductCondition = async (name: string): Promise<ProductCondition | null> => {
    try {
        const response = await fetch(`${API_URL}product-conditions?name=${encodeURIComponent(name)}`)

        if (!response.ok) {
            console.warn(`Failed to fetch product condition: ${response.status}`)
            return null
        }

        const result: ProductConditionsResponse = await response.json()

        if (result.data && result.data.length > 0) {
            return result.data[0]
        }

        return null
    } catch (error) {
        console.warn('Error fetching product condition:', error)
        return null
    }
}

// ==================== HOOK ====================

export const useProductCondition = (name: string, productId?: string | number, options?: { enabled?: boolean }) => {
    return useQuery({
        queryKey: ['product-condition', name, productId],
        queryFn: () => fetchProductCondition(name),
        enabled: !!name && options?.enabled !== false,
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24 // 24 hours
    })
}
