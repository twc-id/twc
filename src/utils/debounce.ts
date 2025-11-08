/* eslint-disable @typescript-eslint/ban-types */
const debounce = (func: Function, timeout = 300) => {
    let timer: NodeJS.Timeout

    return (...args: any) => {
        clearTimeout(timer)

        timer = setTimeout(() => {
            func.apply(this, args)
        }, timeout)
    }
}

export default debounce
