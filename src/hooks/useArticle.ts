import blogFetchApi, { blogDictionaryFetchApi } from '@pages/api/blogApi'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { AxiosError, AxiosRequestConfig } from 'axios'

export interface ArticleAuthor {
    id: number
    name: string
    url: string
    description: string
    link: string
    slug: string
    avatar_urls: {
        '24': string
        '48': string
        '96': string
    }
}

export interface ArticleCategory {
    id: number
    count: number
    description: string
    link: string
    name: string
    slug: string
    taxonomy: string
    parent: number
}

export interface ArticleTag {
    id: number
    count: number
    description: string
    link: string
    name: string
    slug: string
    taxonomy: string
}

export interface ArticleImage {
    id: number
    date: string
    slug: string
    type: string
    link: string
    title: {
        rendered: string
    }
    author: number
    caption: {
        rendered: string
    }
    alt_text: string
    media_type: string
    mime_type: string
    media_details: {
        width: number
        height: number
        file: string
        sizes: {
            [key: string]: {
                file: string
                width: number
                height: number
                mime_type: string
                source_url: string
            }
        }
    }
    source_url: string
}

export interface Article {
    id: number
    date: string
    date_gmt: string
    guid: {
        rendered: string
    }
    modified: string
    modified_gmt: string
    slug: string
    status: string
    type: string
    link: string
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
    author: number
    featured_media: number
    comment_status: string
    ping_status: string
    sticky: boolean
    template: string
    format: string
    meta: any[]
    categories: number[]
    tags: number[]
    uagb_excerpt: string
    reading_time: {
        minutes: number
        words: number
    }
    _embedded?: {
        author?: ArticleAuthor[]
        'wp:featuredmedia'?: ArticleImage[]
        'wp:term'?: ArticleCategory[][]
    }
}

export interface ArticlesResponse {
    data: Article[]
    totalPages: number
    totalPosts: number
}

export interface ArticleParams {
    page?: number
    per_page?: number
    search?: string
    categories?: number | string
    tags?: number | string
    author?: number
    orderby?: 'date' | 'id' | 'title' | 'slug' | 'modified'
    order?: 'asc' | 'desc'
    exclude?: number | string
    _fields?: string
    _embed?: boolean
    lang?: string
}

// Query keys factory
export const articleKeys = {
    all: ['articles'] as const,
    lists: () => [...articleKeys.all, 'list'] as const,
    list: (params: ArticleParams) => [...articleKeys.lists(), params] as const,
    details: () => [...articleKeys.all, 'detail'] as const,
    detail: (id: number) => [...articleKeys.details(), id] as const,
    categories: () => [...articleKeys.all, 'categories'] as const,
    tags: () => [...articleKeys.all, 'tags'] as const,
    authors: () => [...articleKeys.all, 'authors'] as const,
    author: (id: number) => [...articleKeys.authors(), id] as const
}

// Hooks

/**
 * Fetch list of articles with pagination and filters (custom endpoint with Polylang support)
 */
export const useArticles = (
    params: ArticleParams = {},
    options?: Omit<UseQueryOptions<ArticlesResponse, AxiosError>, 'queryKey' | 'queryFn'>
) => {
    const config: AxiosRequestConfig = {
        url: '/posts',
        method: 'GET',
        params: {
            per_page: 10,
            _embed: true,
            ...params
        }
    }

    return useQuery<ArticlesResponse, AxiosError>({
        queryKey: articleKeys.list(params),
        queryFn: async () => {
            const response = await blogFetchApi<Article[]>(config)
            return response
        },
        ...options
    })
}

/**
 * Fetch single article by ID
 */
export const useArticle = (
    id: number,
    params?: { lang?: string },
    options?: Omit<UseQueryOptions<Article, AxiosError>, 'queryKey' | 'queryFn'>
) => {
    const config: AxiosRequestConfig = {
        url: `/posts/${id}`,
        method: 'GET',
        params: {
            _embed: true,
            ...params
        }
    }

    return useQuery<Article, AxiosError>({
        queryKey: articleKeys.detail(id),
        queryFn: async () => {
            const response = await blogFetchApi<Article>(config)
            return response.data
        },
        enabled: !!id,
        ...options
    })
}

/**
 * Search articles by keyword
 */
export const useSearchArticles = (
    searchQuery: string,
    params: Omit<ArticleParams, 'search'> = {},
    options?: Omit<UseQueryOptions<ArticlesResponse, AxiosError>, 'queryKey' | 'queryFn'>
) => {
    const searchParams: ArticleParams = {
        search: searchQuery,
        per_page: 10,
        ...params
    }

    return useArticles(searchParams, {
        enabled: searchQuery.length > 0,
        ...options
    })
}

/**
 * Fetch article categories
 */
export const useArticleCategories = (
    options?: Omit<UseQueryOptions<ArticleCategory[], AxiosError>, 'queryKey' | 'queryFn'>
) => {
    const config: AxiosRequestConfig = {
        url: '/categories',
        method: 'GET',
        params: {
            per_page: 100
        }
    }

    return useQuery<ArticleCategory[], AxiosError>({
        queryKey: articleKeys.categories(),
        queryFn: async () => {
            const response = await blogDictionaryFetchApi<ArticleCategory[]>(config)
            return response.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options
    })
}

/**
 * Fetch article tags
 */
export const useArticleTags = (options?: Omit<UseQueryOptions<ArticleTag[], AxiosError>, 'queryKey' | 'queryFn'>) => {
    const config: AxiosRequestConfig = {
        url: '/tags',
        method: 'GET',
        params: {
            per_page: 100
        }
    }

    return useQuery<ArticleTag[], AxiosError>({
        queryKey: articleKeys.tags(),
        queryFn: async () => {
            const response = await blogDictionaryFetchApi<ArticleTag[]>(config)
            return response.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options
    })
}

/**
 * Fetch author by ID
 */
export const useAuthor = (
    authorId: number,
    options?: Omit<UseQueryOptions<ArticleAuthor, AxiosError>, 'queryKey' | 'queryFn'>
) => {
    const config: AxiosRequestConfig = {
        url: `/users/${authorId}`,
        method: 'GET'
    }

    return useQuery<ArticleAuthor, AxiosError>({
        queryKey: articleKeys.author(authorId),
        queryFn: async () => {
            const response = await blogDictionaryFetchApi<ArticleAuthor>(config)
            return response.data
        },
        enabled: !!authorId,
        staleTime: 10 * 60 * 1000, // 10 minutes
        ...options
    })
}

/**
 * Fetch articles by category
 */
export const useArticlesByCategory = (
    categoryId: number,
    params: Omit<ArticleParams, 'categories'> = {},
    options?: Omit<UseQueryOptions<ArticlesResponse, AxiosError>, 'queryKey' | 'queryFn'>
) => {
    return useArticles(
        {
            categories: categoryId,
            ...params
        },
        {
            enabled: !!categoryId,
            ...options
        }
    )
}

/**
 * Fetch articles by tag
 */
export const useArticlesByTag = (
    tagId: number,
    params: Omit<ArticleParams, 'tags'> = {},
    options?: Omit<UseQueryOptions<ArticlesResponse, AxiosError>, 'queryKey' | 'queryFn'>
) => {
    return useArticles(
        {
            tags: tagId,
            ...params
        },
        {
            enabled: !!tagId,
            ...options
        }
    )
}

export const useRelatedArticles = (
    articleId: number,
    categoryIds: number[],
    params: Omit<ArticleParams, 'categories' | 'exclude'> = {},
    options?: Omit<UseQueryOptions<ArticlesResponse, AxiosError>, 'queryKey' | 'queryFn'>
) => {
    const fields = [
        'id',
        'date_gmt',
        'slug',
        'title',
        'excerpt',
        '_links',
        '_embedded',
        'reading_time',
        'type',
        'old_slugs'
    ]

    const relatedParams: ArticleParams = {
        categories: categoryIds.join(','), // WP expects comma separated
        exclude: articleId,
        per_page: 4,
        _embed: true,
        _fields: fields.join(','),
        ...params
    }

    return useArticles(relatedParams, {
        enabled: categoryIds.length > 0 && !!articleId,
        staleTime: 5 * 60 * 1000,
        ...options
    })
}
