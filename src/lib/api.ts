import { API_URL } from '@constant/env'
import { getAuth, resetAuth } from '@utils/auth'

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

export default api
