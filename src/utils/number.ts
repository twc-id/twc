/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js'

export const decimalPlaces = (number: number) => new BigNumber(number).dp() ?? 0
