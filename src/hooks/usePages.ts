import blogFetchApi from '@pages/api/blogApi'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError, AxiosRequestConfig } from 'axios'

export interface Page {
    id: number
    slug: string
    date: string
    modified: string
    modified_gmt: string
    title: {
        rendered: string
    }
    content: {
        rendered: string
        protected: boolean
    }
    excerpt: {
        rendered: string
        protected: boolean
    }
    link: string
    _embedded?: any
}

export const pageKeys = {
    all: ['pages'] as const,
    lists: () => [...pageKeys.all, 'list'] as const,
    list: (slug: string | string[]) => [...pageKeys.lists(), slug] as const,
    details: () => [...pageKeys.all, 'detail'] as const,
    detail: (slug: string) => [...pageKeys.details(), slug] as const
}

/**
 * Fetch page(s) by slug. Accepts a single slug string (returns `Page`) or
 * an array of slugs (returns `Page[]`). Uses the WP REST `pages` endpoint.
 */
export const usePages = (
    slug: string | string[],
    params: { _embed?: boolean; _fields?: string; per_page?: number } = {},
    options?: Omit<UseQueryOptions<Page | Page[], AxiosError>, 'queryKey' | 'queryFn'>
) => {
    const enabled = !!slug && (Array.isArray(slug) ? slug.length > 0 : true)

    return useQuery<Page | Page[], AxiosError>({
        queryKey: Array.isArray(slug) ? pageKeys.list(slug) : pageKeys.detail(slug as string),
        queryFn: async () => {
            if (Array.isArray(slug)) {
                const promises = slug.map((s) => {
                    const cfg: AxiosRequestConfig = {
                        url: '/pages',
                        method: 'GET',
                        params: {
                            slug: s,
                            _embed: params._embed ?? true,
                            ...params
                        }
                    }
                    return blogFetchApi<Page[]>(cfg).then((res) => res.data[0])
                })

                const pages = await Promise.all(promises)
                return pages
            }

            const cfg: AxiosRequestConfig = {
                url: '/pages',
                method: 'GET',
                params: {
                    slug: slug as string,
                    _embed: params._embed ?? true,
                    ...params
                }
            }

            const response = await blogFetchApi<Page[]>(cfg)
            return response.data[0]
        },
        enabled,
        ...options
    })
}

export default usePages
