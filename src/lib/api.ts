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
    return new WooCommerceRestApi({
        url: config?.url ?? 'https://mediumpurple-pig-833607.hostingersite.com',
        consumerKey: config?.consumerKey ?? CONSUMER_KEY ?? '',
        consumerSecret: config?.consumerSecret ?? CONSUMER_SECRET ?? '',
        version: config?.version ?? ('wc/v3' as any),
        queryStringAuth: config?.queryStringAuth ?? true
    })
}

const WooCommerce = createWooCommerceInstance()

export { createWooCommerceInstance, WooCommerce }

export default api
