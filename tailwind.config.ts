import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

import fontSize from './src/tailwind-config/font-sizes.config'

export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontSize: fontSize as any,
            fontFamily: {
                primary: ['Inter', ...defaultTheme.fontFamily.sans],
                inter: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
                overpass: ['var(--font-overpass)', ...defaultTheme.fontFamily.sans]
            },
            colors: {
                primary: {
                    50: 'rgb(var(--tw-color-primary-50) / <alpha-value>)',
                    100: 'rgb(var(--tw-color-primary-100) / <alpha-value>)',
                    200: 'rgb(var(--tw-color-primary-200) / <alpha-value>)',
                    300: 'rgb(var(--tw-color-primary-300) / <alpha-value>)',
                    400: 'rgb(var(--tw-color-primary-400) / <alpha-value>)',
                    500: 'rgb(var(--tw-color-primary-500) / <alpha-value>)',
                    600: 'rgb(var(--tw-color-primary-600) / <alpha-value>)',
                    700: 'rgb(var(--tw-color-primary-700) / <alpha-value>)',
                    800: 'rgb(var(--tw-color-primary-800) / <alpha-value>)',
                    900: 'rgb(var(--tw-color-primary-900) / <alpha-value>)',
                    950: 'rgb(var(--tw-color-primary-950) / <alpha-value>)'
                },
                grey: {
                    white: '#FEFEFE',
                    50: '#E9EAEC',
                    100: '#DDDDDD',
                    200: '#A0A0A0',
                    500: '#595959',
                    700: '#3E3E3E',
                    black: '#010101'
                },
                accent: { 'price-light': '#B5A995', 'price-dark': '#90806F' },
                dark: {
                    'button-secondary-on-dark-default': 'rgba(254, 254, 254, 0)',
                    'button-secondary-on-dark-hover': 'rgba(254, 254, 254, 0.2)',
                    'button-secondary-on-dark-press': 'rgba(254, 254, 254, 0.4)'
                },
                'dropdown-menu-overlay': 'rgba(1, 1, 1, 0.8)',
                'selected-watch-overlay': 'rgba(218, 218, 218, 0.25)',
                'button-primary-default': 'rgba(254, 254, 254, 0.4)',
                'button-primary-hover': 'rgba(254, 254, 254, 0.5)',
                'button-primary-press': 'rgba(254, 254, 254, 0.6)',
                'button-arrow-default': 'rgba(254, 254, 254, 0.2)',
                'button-arrow-press': 'rgba(254, 254, 254, 0.6)',
                'button-secondary-on-white-default': 'rgba(1, 1, 1, 0)',
                'button-secondary-on-white-hover': 'rgba(1, 1, 1, 0.1)',
                'button-secondary-on-white-press': 'rgba(1, 1, 1, 0.2)',
                error: { 500: '#B72136' },
                success: { 200: '#2CBE1D', 500: '#229A16' }
            },

            keyframes: {
                flicker: {
                    '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
                        opacity: '0.99',
                        filter: 'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))'
                    },
                    '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
                        opacity: '0.4',
                        filter: 'none'
                    }
                },
                shimmer: {
                    '0%': {
                        backgroundPosition: '-700px 0'
                    },
                    '100%': {
                        backgroundPosition: '700px 0'
                    }
                }
            },
            animation: {
                flicker: 'flicker 3s linear infinite',
                shimmer: 'shimmer 1.3s linear infinite'
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('tailwind-scrollbar'),
        plugin(function ({ addUtilities, theme }) {
            const fontSizes = theme('fontSize') || {}
            const newUtilities: Record<string, any> = {}

            Object.keys(fontSizes).forEach((key) => {
                const value = fontSizes[key]
                if (Array.isArray(value) && value[1]?.fontFamily) {
                    const fontFamily = value[1].fontFamily
                    let fontFamilyValue = ''

                    if (fontFamily === 'Inter') {
                        fontFamilyValue = 'var(--font-inter)'
                    } else if (fontFamily === 'Overpass') {
                        fontFamilyValue = 'var(--font-overpass)'
                    }

                    if (fontFamilyValue) {
                        newUtilities[`.text-${key}`] = {
                            fontFamily: fontFamilyValue
                        }
                    }
                }
            })

            addUtilities(newUtilities)
        })
    ]
} satisfies Config
