import { API_WP_URL } from '@constant/env'
import axios, { AxiosRequestConfig, getAdapter } from 'axios'
import { throttleAdapterEnhancer } from 'axios-extensions'

const client = axios.create({
    baseURL: API_WP_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    adapter: throttleAdapterEnhancer(getAdapter(axios.defaults.adapter))
})

const blogFetchApi = async <T = any>(
    config: AxiosRequestConfig
): Promise<{ data: T; totalPages: number; totalPosts: number }> => {
    const request = await client(config)
    return {
        data: request.data,
        totalPages: Number(request.headers['x-wp-totalpages'] ?? 1),
        totalPosts: Number(request.headers['x-wp-total'] ?? 0)
    }
}

const clientFetchDictionary = axios.create({
    baseURL: API_WP_URL,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    adapter: throttleAdapterEnhancer(getAdapter(axios.defaults.adapter))
})

export const blogDictionaryFetchApi = async <T = any>(
    config: AxiosRequestConfig
): Promise<{ data: T; totalPages: number; totalPosts: number }> => {
    const request = await clientFetchDictionary(config)
    return {
        data: request.data,
        totalPages: Number(request.headers['x-wp-totalpages'] ?? 1),
        totalPosts: Number(request.headers['x-wp-total'] ?? 0)
    }
}

export default blogFetchApi
