/* eslint-disable import/prefer-default-export */

const languages = [
    {
        code: 'id',
        name: 'Bahasa Indonesia'
    },
    {
        code: 'en',
        name: 'English'
    }
] as const

export type LanguagesCode = (typeof languages)[number]['code']

export const defaultLanguage = 'en'
