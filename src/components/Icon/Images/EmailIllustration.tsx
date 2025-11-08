/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const EmailIllustration: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='76' height='76' viewBox='0 0 76 76' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <rect x='10' y='10' width='56' height='56' rx='28' fill='#E4D4FB' fill-opacity='0.8' />
        <rect x='5' y='5' width='66' height='66' rx='33' stroke='#E4D4FB' stroke-opacity='0.4' stroke-width='10' />
        <path
            d='M26.333 32.1667L35.8587 38.8348C36.6301 39.3747 37.0158 39.6447 37.4353 39.7493C37.8059 39.8416 38.1935 39.8416 38.564 39.7493C38.9836 39.6447 39.3692 39.3747 40.1406 38.8348L49.6663 32.1667M31.933 47.3334H44.0663C46.0265 47.3334 47.0066 47.3334 47.7553 46.9519C48.4139 46.6164 48.9493 46.081 49.2849 45.4224C49.6663 44.6737 49.6663 43.6936 49.6663 41.7334V34.2667C49.6663 32.3066 49.6663 31.3265 49.2849 30.5778C48.9493 29.9192 48.4139 29.3838 47.7553 29.0482C47.0066 28.6667 46.0265 28.6667 44.0663 28.6667H31.933C29.9728 28.6667 28.9927 28.6667 28.244 29.0482C27.5855 29.3838 27.05 29.9192 26.7145 30.5778C26.333 31.3265 26.333 32.3066 26.333 34.2667V41.7334C26.333 43.6936 26.333 44.6737 26.7145 45.4224C27.05 46.081 27.5855 46.6164 28.244 46.9519C28.9927 47.3334 29.9728 47.3334 31.933 47.3334Z'
            stroke='#7927ED'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
    </svg>
)
export default EmailIllustration
