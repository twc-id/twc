/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const IndoFlag: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='20' height='15' viewBox='0 0 20 15' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clip-path='url(#clip0_3018_10329)'>
            <rect width='20' height='15' fill='white' />
            <path fill-rule='evenodd' clip-rule='evenodd' d='M0 0V15H20V0H0Z' fill='#E9E9E9' />
            <mask
                id='mask0_3018_10329'
                style={{ maskType: 'luminance' }}
                maskUnits='userSpaceOnUse'
                x='0'
                y='0'
                width='20'
                height='15'
            >
                <path fill-rule='evenodd' clip-rule='evenodd' d='M0 0V15H20V0H0Z' fill='white' />
            </mask>
            <g mask='url(#mask0_3018_10329)'>
                <path fill-rule='evenodd' clip-rule='evenodd' d='M0 0V7.5H20V0H0Z' fill='#E31D1C' />
            </g>
        </g>
        <defs>
            <clipPath id='clip0_3018_10329'>
                <rect width='20' height='15' fill='white' />
            </clipPath>
        </defs>
    </svg>
)
export default IndoFlag
