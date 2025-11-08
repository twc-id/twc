/* eslint-disable import/prefer-default-export */

export const getRedirectHref = (path: string) => {
    if (path === '/' || path.includes('register') || path.includes('login')) {
        return '/api/auth/login'
    }

    return `/api/auth/login?redirect=${path}`
}
