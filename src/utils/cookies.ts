import { COOKIE_DOMAIN, COOKIE_PREFIX } from '@constant/env'
import * as cookie from 'cookies-next'
import { OptionsType } from 'cookies-next/lib/types'

let defaultOptions: OptionsType = {
    path: '/',
    maxAge: 86400
}

if (COOKIE_DOMAIN) {
    defaultOptions = Object.assign(defaultOptions, {
        domain: `.${COOKIE_DOMAIN}`
    })
}

export const formatCookieName = (name: string) => `${COOKIE_PREFIX ?? ''}${name}`

export const getCookie = (name: string, options?: OptionsType) =>
    cookie.getCookie(formatCookieName(name), Object.assign(defaultOptions, options))
export const setCookie = (name: string, value: string, options?: OptionsType) =>
    cookie.setCookie(formatCookieName(name), value, Object.assign(defaultOptions, options))
export const removeCookie = (name: string, options?: OptionsType) =>
    cookie.deleteCookie(formatCookieName(name), Object.assign(defaultOptions, options))
