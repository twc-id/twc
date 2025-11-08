import BigNumber from 'bignumber.js'
import numeral from 'numeral'

import { decimalPlaces } from './number'

if (numeral.locales['rk-id'] === undefined) {
    numeral.register('locale', 'rk-id', {
        delimiters: {
            thousands: '.',
            decimal: ','
        },
        abbreviations: {
            thousand: 'K',
            million: 'M',
            billion: 'B',
            trillion: 'T'
        },
        ordinal(number) {
            return number === 1 ? 'st' : 'th'
        },
        currency: {
            symbol: 'Rp'
        }
    })
}

export const removeTrailingZero = (num: string) => {
    const decimalIndex = num.indexOf(',')
    if (decimalIndex !== -1) {
        let trimmedNum = num
        while (trimmedNum.endsWith('0')) {
            trimmedNum = trimmedNum.slice(0, -1)
        }
        if (trimmedNum.endsWith(',')) {
            trimmedNum = trimmedNum.slice(0, -1)
        }
        return trimmedNum
    }
    return num
}

numeral.locale('rk-id')

export enum ROUNDING {
    ROUND = BigNumber.ROUND_HALF_UP,
    UP = BigNumber.ROUND_UP,
    DOWN = BigNumber.ROUND_DOWN
}

interface Options {
    precision?: number | null
    rounding?: ROUNDING
    noTrailingZero?: boolean
}

const format = {
    decimalSeparator: ',',
    groupSeparator: '.',
    groupSize: 3
}

export const formatNumber = (number: number, options?: Options) => {
    if (typeof options?.precision !== 'undefined' && options?.precision !== null) {
        return new BigNumber(number)
            .dp((options?.precision as number) + 1, ROUNDING.DOWN as BigNumber.RoundingMode)
            .toFormat(options?.precision as number, options?.rounding as BigNumber.RoundingMode, format)
    }

    return new BigNumber(number).toFormat(format)
}

export type Locale = 'id' | 'en'

export const formatNumberLocale = (number: number, locale: Locale, options?: Options) => {
    const formatLocale = {
        decimalSeparator: locale === 'id' ? ',' : '.',
        groupSeparator: locale === 'id' ? '.' : ',',
        groupSize: 3
    }

    if (typeof options?.precision !== 'undefined' && options?.precision !== null) {
        return new BigNumber(number)
            .dp((options?.precision as number) + 1, ROUNDING.DOWN as BigNumber.RoundingMode)
            .toFormat(options?.precision as number, options?.rounding as BigNumber.RoundingMode, formatLocale)
    }

    return new BigNumber(number).toFormat(formatLocale)
}

export const formatRupiah = (number: number, options?: Options) =>
    `Rp${formatNumber(number, { precision: 0, ...options })}`

export const formatRupiahPrefix = (number: number, options?: Options) => {
    let formattedNumber = formatNumber(Math.abs(number), {
        precision: 0,
        ...options
    })

    formattedNumber = formattedNumber.replace('-', '')

    if (number < 0) {
        return `-Rp${formattedNumber}`
    }
    if (number > 0) {
        return `+Rp${formattedNumber}`
    }

    return `Rp${formattedNumber}`
}

export const formatCoin = (number: number, options?: Options, maxDecimal = 8) => {
    let newOptions: Options = { ...options }
    const decimal = decimalPlaces(number)

    if (decimal > maxDecimal && !options?.precision) {
        newOptions = {
            ...newOptions,
            precision: maxDecimal
        }
    }

    if (options?.precision === 0) {
        newOptions = {
            ...newOptions,
            precision: 0
        }
    }
    const formattedNumber = formatNumber(number, newOptions)
    const noTrailingZero = removeTrailingZero(formattedNumber)

    return options?.noTrailingZero ? noTrailingZero : formattedNumber
}

export const formatShare = (number: number, options?: Options) =>
    formatCoin(number, { noTrailingZero: true, ...options }, 9)

export const formatUSD = (number: number, options?: Options) => {
    const dp = new BigNumber(number).dp() || 0
    const isDecimal = dp > 0
    const precision = isDecimal ? 2 : 0

    return `$${formatNumber(number, {
        precision,
        rounding: ROUNDING.DOWN,
        ...options
    })}`
}

export const formatUSDPrefix = (number: number, options?: Options) => {
    const dp = new BigNumber(number).dp() || 0
    const isDecimal = dp > 0
    const precision = isDecimal ? 2 : 0
    const formattedNumber = formatNumber(Math.abs(number), {
        precision,
        rounding: ROUNDING.DOWN,
        ...options
    })

    if (number < 0) {
        return `-$${formattedNumber}`
    }
    if (number > 0) {
        return `+$${formattedNumber}`
    }

    return `$${formattedNumber}`
}
export const getCoinDecimal = (price: number) => (price < 100000 ? 2 : 4)

export const formatAbbreviatedNumber = (
    number: number,
    options?: {
        format?: string
        prefix?: string
        predictive?: boolean
        nonPlusSymbol?: boolean
    }
) => {
    if (typeof options?.format !== 'undefined') {
        return numeral(number).format(options?.format).toUpperCase()
    }

    if (typeof options?.prefix !== 'undefined') {
        const formated = numeral(options?.predictive ? Math.abs(number) : number)
            .format('0.0a')
            .toUpperCase()
        if (options?.predictive) {
            if (number < 0) {
                return `-${options.prefix}${formated}`
            }
            if (number > 0) {
                return options?.nonPlusSymbol ? `${options.prefix}${formated}` : `+${options.prefix}${formated}`
            }
        }

        return `${options?.prefix}0`
    }

    return numeral(number).format('0.0a').toUpperCase()
}

interface Extra {
    prefix?: string
    suffix?: string
}

export const formatAbbreviatedNumberFull = (number: number, extra?: Extra, predictive?: boolean) => {
    const formated = formatAbbreviatedNumber(predictive ? Math.abs(number) : number, { format: '0.[00]a' })
        .replace('M', ' Million')
        .replace('B', ' Billion')
        .replace('T', ' Trillion')

    if (extra?.prefix) {
        if (predictive) {
            if (number < 0) {
                return `-${extra.prefix}${formated}`
            }
            if (number > 0) {
                return `+${extra.prefix}${formated}`
            }
        }
        return `${extra.prefix}${formated}`
    }

    if (extra?.suffix) {
        return `${formated}${extra.suffix}`
    }

    return formated
}
