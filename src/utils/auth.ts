/* eslint-disable import/prefer-default-export */
import { APP_ENV } from '@constant/env'
import { isBrowser } from '@utils/browser'
import { OptionsType } from 'cookies-next/lib/types'

import { getCookie, removeCookie, setCookie } from './cookies'

const isDevelopment = APP_ENV?.toLocaleLowerCase() === 'development'
const hashKey = isDevelopment ? 'devuhash' : 'uhash'
const tokenKey = isDevelopment ? 'devbinalokahash' : 'binalokahash'

export const getAuth = (options?: OptionsType) => {
    const uhash = getCookie(hashKey, options) ?? undefined
    const binalokahash = getCookie(tokenKey, options) ?? undefined

    const checkAuth = Boolean((uhash && binalokahash) || binalokahash)

    return {
        token: checkAuth ? binalokahash : undefined,
        hash: uhash || undefined,
        isLoggedIn: checkAuth || false
    }
}

export const setAuth = ({ hash, token }: Auth) => {
    if (hash) setCookie(hashKey, hash)
    if (token) setCookie(tokenKey, token)

    return true
}

if (isBrowser && isDevelopment) {
    window.setAuth = setAuth
}

export const resetAuth = () => {
    removeCookie(hashKey)
    removeCookie(tokenKey)

    return true
}
