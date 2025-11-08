/* eslint-disable import/prefer-default-export */
import { Unbounded } from 'next/font/google'

export const unbounded = Unbounded({
    variable: '--font-unbounded',
    weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap'
})
