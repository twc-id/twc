/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Camera: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_238_14091)'>
            <path
                d='M1 3H19V15C19 16.1046 18.1046 17 17 17H3C1.89543 17 1 16.1046 1 15V3Z'
                stroke='currentColor'
                stroke-width='2'
                stroke-linejoin='round'
            />
            <circle
                cx='10'
                cy='10'
                r='3'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
            />
            <path
                d='M15 -4.37114e-08L17 0'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
            />
        </g>
        <defs>
            <clipPath id='clip0_238_14091'>
                <rect width='20' height='20' fill='currentColor' />
            </clipPath>
        </defs>
    </svg>
)
export default Camera
