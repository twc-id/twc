/* eslint-disable import/prefer-default-export */
import { Inter, Overpass } from 'next/font/google'

export const inter = Inter({
    variable: '--font-inter',
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap'
})

export const overpass = Overpass({
    variable: '--font-overpass',
    weight: ['300', '400', '500', '600', '700', '800'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap'
})
