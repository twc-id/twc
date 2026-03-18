import { API_URL } from '@constant/env'
import { useQuery } from '@tanstack/react-query'

export interface ComponentVisibility {
    homepage_testimonial: boolean
    homepage_new_in_instagram: boolean
    about_temukan_kami: boolean
    reserve_watch_text_section: boolean
    footer_store_location: boolean
}

const fetchComponentVisibility = async (): Promise<ComponentVisibility> => {
    const response = await fetch(`${API_URL}component-visibility`)

    if (!response.ok) {
        throw new Error('Failed to fetch component visibility')
    }

    return response.json()
}

export const useComponentVisibility = () => {
    return useQuery({
        queryKey: ['component-visibility'],
        queryFn: fetchComponentVisibility,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1
    })
}
