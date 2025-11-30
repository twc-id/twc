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

const WooCommerce = new WooCommerceRestApi({
    url: 'https://mediumpurple-pig-833607.hostingersite.com',
    consumerKey: CONSUMER_KEY ?? '',
    consumerSecret: CONSUMER_SECRET ?? '',
    version: 'wc/v3',
    queryStringAuth: true
})

export { WooCommerce }

export default api
