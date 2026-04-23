import { toast } from '@components/Toast'
import { NEWSLETTER_API_URL, NEWSLETTER_CLIENT_KEY, NEWSLETTER_CLIENT_SECRET } from '@constant/env'
import axios from 'axios'
import { useState } from 'react'

export const useNewsletterSubscription = () => {
    const [loading, setLoading] = useState(false)

    const subscribe = async (email: string) => {
        // Validate email
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error('Please enter a valid email address')
            return { success: false, message: 'Invalid email address' }
        }
        const name = email.split('@')[0]

        setLoading(true)

        try {
            // Create Basic Auth header
            const auth = Buffer.from(`${NEWSLETTER_CLIENT_KEY}:${NEWSLETTER_CLIENT_SECRET}`).toString('base64')

            // Call Newsletter Plugin API - POST /subscribers endpoint
            const response = await axios.post(
                `${NEWSLETTER_API_URL}`,
                {
                    email,
                    status: 'confirmed',
                    first_name: name
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Basic ${auth}`
                    }
                }
            )

            toast.success('Successfully subscribed to newsletter!', {
                position: 'top-center'
            })

            return {
                success: true,
                message: 'Successfully subscribed to newsletter',
                data: response.data
            }
        } catch (error: any) {
            console.error('Newsletter subscription error:', error)

            let errorMessage = 'An error occurred. Please try again.'

            // Handle axios error
            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage
            }

            toast.error(errorMessage)

            return {
                success: false,
                message: errorMessage
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        subscribe,
        loading
    }
}

export default useNewsletterSubscription
