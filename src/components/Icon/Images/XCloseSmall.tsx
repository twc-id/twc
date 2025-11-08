/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const XCloseSmall: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <mask
            id='mask0_63_2601'
            style={{
                maskType: 'alpha'
            }}
            maskUnits='userSpaceOnUse'
            x='0'
            y='0'
            width='24'
            height='24'
        >
            <rect width='24' height='24' fill='#D9D9D9' />
        </mask>
        <g mask='url(#mask0_63_2601)'>
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.18539 16.7398C6.7941 16.3501 6.79287 15.7169 7.18263 15.3256L10.4691 12.0263L7.16981 8.73986C6.77852 8.3501 6.77729 7.71694 7.16705 7.32565C7.55682 6.93437 8.18998 6.93313 8.58126 7.3229L11.8806 10.6094L15.167 7.31007C15.5568 6.91879 16.19 6.91755 16.5812 7.30732C16.9725 7.69708 16.9738 8.33024 16.584 8.72153L13.2975 12.0208L16.5968 15.3073C16.9881 15.6971 16.9893 16.3302 16.5996 16.7215C16.2098 17.1128 15.5767 17.114 15.1854 16.7243L11.8861 13.4378L8.5996 16.7371C8.20984 17.1284 7.57667 17.1296 7.18539 16.7398Z'
                fill='currentColor'
            />
        </g>
    </svg>
)
export default XCloseSmall
