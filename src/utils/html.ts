/* eslint-disable import/prefer-default-export */
import DOMPurify from 'isomorphic-dompurify'

export const sanitizeHtml = (html: string) =>
    DOMPurify.sanitize(html, {
        ADD_TAGS: ['iframe']
    })

export const wrapTableWithFigure = async (html: string) => {
    const { load } = await import('cheerio')

    const $ = load(html, null, false)
    $('table').wrap('<figure></figure>')

    return $.html()
}

export const decodeHtml = (html: string): string => {
    if (typeof document !== 'undefined') {
        const el = document.createElement('div')
        el.innerHTML = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
        return el.textContent || ''
    }
    return html.replace(/<[^>]*>/g, '')
}

export const getTextFromHtml = async (html: string) => {
    const { load } = await import('cheerio')

    const $ = load(html, null, false)
    return $.text().trim()
}
