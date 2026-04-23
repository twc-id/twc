export const isProd = process.env.NODE_ENV === 'production'
export const isLocal = process.env.NODE_ENV === 'development'

export const showLogger = isLocal ? true : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true'

export const API_URL = process.env.NEXT_PUBLIC_API_URL
export const API_WP_URL = process.env.NEXT_PUBLIC_WP_URL
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV

export const CONSUMER_KEY = process.env.NEXT_PUBLIC_CONSUMER_KEY
export const CONSUMER_SECRET = process.env.NEXT_PUBLIC_CONSUMER_SECRET

export const NEWSLETTER_API_URL = process.env.NEXT_PUBLIC_NEWSLETTER_API_URL
export const NEWSLETTER_CLIENT_KEY = process.env.NEXT_PUBLIC_NEWSLETTER_CLIENT_KEY
export const NEWSLETTER_CLIENT_SECRET = process.env.NEXT_PUBLIC_NEWSLETTER_CLIENT_SECRET

export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN
export const COOKIE_PREFIX = process.env.NEXT_PUBLIC_COOKIE_PREFIX
export const APP_VERSION = '2.2.6'
