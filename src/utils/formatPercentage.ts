/* eslint-disable import/prefer-default-export */
import { formatNumber, ROUNDING } from '@utils/currency'

export const formatChangePercentage = (
    value: number,
    prefix: 'symbol' | 'none' = 'symbol',
    precision: number | null = 2
) => {
    const formatted = `${formatNumber(Math.abs(value), {
        precision,
        rounding: ROUNDING.DOWN
    })}%`

    if (prefix === 'symbol') {
        if (value > 0) {
            return `+${formatted}`
        }

        if (value < 0) {
            return `-${formatted}`
        }
    }

    return formatted
}
