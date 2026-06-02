/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Facebook: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='12' height='19' viewBox='0 0 12 19' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_3655_2656)'>
            <path
                d='M10.3178 10.6453L10.8434 7.22035H7.55708V4.9978C7.55708 4.06081 8.01615 3.14747 9.48799 3.14747H10.982V0.231506C10.982 0.231506 9.62623 0.00012207 8.32996 0.00012207C5.62358 0.00012207 3.85456 1.64051 3.85456 4.61007V7.22035H0.846191V10.6453H3.85456V18.9249H7.55708V10.6453H10.3178Z'
                fill='currentColor'
            />
        </g>
        <defs>
            <clipPath id='clip0_3655_2656'>
                <rect width='11.828' height='18.9247' fill='white' />
            </clipPath>
        </defs>
    </svg>
)
export default Facebook
