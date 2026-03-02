import { API_URL, CONSUMER_KEY, CONSUMER_SECRET } from '@constant/env'
import { getAuth, resetAuth } from '@utils/auth'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api' // Supports ESM

const api = async (endpoint: string, options?: RequestInit) => {
    const { token } = getAuth()
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            ...options?.headers
        }
    })

    if (response.status === 401) {
        resetAuth()
        localStorage.removeItem('email')
        throw new Error('Unauthorized')
    }

    return response
}

interface WooCommerceConfig {
    url?: string
    consumerKey?: string
    consumerSecret?: string
    version?: string
    queryStringAuth?: boolean
}

const createWooCommerceInstance = (config?: WooCommerceConfig) => {
    const consumerKey = config?.consumerKey ?? CONSUMER_KEY ?? ''
    const consumerSecret = config?.consumerSecret ?? CONSUMER_SECRET ?? ''

    const toBase64 = (str: string) => {
        if (typeof window !== 'undefined' && typeof window.btoa === 'function') return btoa(str)
        // Node.js environment
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const Buffer = require('buffer').Buffer
        return Buffer.from(str).toString('base64')
    }

    const authHeader = `Basic ${toBase64(`${consumerKey}:${consumerSecret}`)}`

    return new WooCommerceRestApi({
        url: config?.url ?? 'https://store.thewatchcollections.com',
        consumerKey,
        consumerSecret,
        version: config?.version ?? ('wc/v3' as any),
        // prefer header-based auth by default (safer over HTTPS)
        queryStringAuth: config?.queryStringAuth ?? false,
        axiosConfig: {
            headers: {
                Authorization: authHeader
            }
        }
    })
}

const WooCommerce = createWooCommerceInstance()

export { createWooCommerceInstance, WooCommerce }

export default api
