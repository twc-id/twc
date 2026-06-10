import { API_URL } from '@constant/env'
import { useQuery } from '@tanstack/react-query'

export interface InstagramPost {
    id: string
    url: string
}

const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
    const response = await fetch(`${API_URL}instagram`)

    if (!response.ok) {
        throw new Error('Failed to fetch Instagram posts')
    }

    return response.json()
}

export const useInstagramPosts = () => {
    return useQuery({
        queryKey: ['instagram-posts'],
        queryFn: fetchInstagramPosts,
        staleTime: 5 * 60 * 1000,
        retry: 1
    })
}
