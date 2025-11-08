/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { toast } from '@components/Toast'
import copyToClipboard from 'copy-to-clipboard'

export const copy = (text: string) => {
    copyToClipboard(text)
    toast.success('Copied to clipboard')
}

export const getCurrentClipboard = async () => {
    const text = await navigator.clipboard.readText()
    return text
}
