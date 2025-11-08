import clsx, { ClassArray } from 'clsx'
import { twMerge } from 'tailwind-merge'

const classNames = (...inputs: ClassArray) => {
    return twMerge(clsx(...inputs))
}

export default classNames
