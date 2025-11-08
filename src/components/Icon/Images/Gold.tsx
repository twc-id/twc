/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Gold: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_67_21577)'>
            <rect width='32' height='32' rx='8' fill='#08192B' fillOpacity='0.1' />
            <path
                d='M25 6H7C6.44772 6 6 6.44772 6 7V25C6 25.5523 6.44772 26 7 26H25C25.5523 26 26 25.5523 26 25V7C26 6.44772 25.5523 6 25 6Z'
                fill='#F7D31D'
                stroke='#DFBF19'
                strokeWidth='2'
            />
            <path
                d='M11.3371 19.0002L11.7331 17.7022H14.0761L14.4831 19.0002H16.4301L13.7901 11.4102H12.0301L9.39014 19.0002H11.3371ZM12.9101 13.9402L13.6031 16.1842H12.2061L12.9101 13.9402ZM21.6124 13.5002H19.9624V16.6352C19.9624 17.3942 19.7534 17.7022 19.1924 17.7022C18.6424 17.7022 18.4664 17.3722 18.4664 16.6242V13.5002H16.8164V16.9322C16.8164 18.5822 17.7624 19.1102 18.8404 19.1102C19.5224 19.1102 19.7754 18.9232 19.9954 18.5712V19.0002H21.6124V13.5002Z'
                fill='#A78C03'
            />
        </g>
        <defs>
            <clipPath id='clip0_67_21577'>
                <rect width='32' height='32' rx='8' fill='white' />
            </clipPath>
        </defs>
    </svg>
)
export default Gold
