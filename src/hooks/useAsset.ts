import { API_URL } from '@constant/env'
import { useQuery } from '@tanstack/react-query'

export interface AssetMediaSizes {
    [key: string]: {
        url: string
        width: number
        height: number
    }
}

export interface AssetMedia {
    id: number
    title: string
    alt: string
    caption: string
    description: string
    mime_type: string
    url: string
    file_size: number
    width: number
    height: number
    sizes: AssetMediaSizes
}

export interface VideoBanner {
    sub_header: string
    title: string
    sub_footer: string
}
export interface VideoBannerLocalized {
    [key: string]: VideoBanner
}

export interface Asset {
    id: number
    name: string
    label: string
    media_type: string
    description: string
    media_id: number
    media: AssetMedia
    created_at: string
    updated_at: string
    video_banner?: VideoBannerLocalized
}

export interface AssetsResponse {
    data: Asset[]
    totalPages: number
    totalAssets: number
}

export interface AssetParams {
    page?: number
    per_page?: number
    search?: string
    media_type?: string | string[]
    orderby?: 'date' | 'id' | 'title' | 'slug' | 'modified'
    order?: 'asc' | 'desc'
}

// API functions
const fetchAssets = async (): Promise<AssetsResponse> => {
    const url = `${API_URL}asset`
    const response = await fetch(url, {
        method: 'GET'
    })

    if (!response.ok) {
        throw new Error('Failed to fetch assets')
    }

    return response.json()
}

export const useAssets = (params?: AssetParams) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['assets', params],
        queryFn: () => fetchAssets(),
        staleTime: 5 * 60 * 1000 // 5 minutes
    })
    const assets = data?.data
    return { assets, isLoading, error }
}
