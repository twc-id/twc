/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Oil: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_67_21600)'>
            <rect width='32' height='32' rx='8' fill='#08192B' fillOpacity='0.1' />
            <path
                d='M7 6V8H8V15H7V17H8V24H7V26H25V24H24V17H25V15H24V8H25V6H7ZM16 11.2402L16.8223 12.4316C17.4773 13.3806 19 15.722 19 17C19 18.654 17.654 20 16 20C14.346 20 13 18.654 13 17C13 15.722 14.5227 13.3796 15.1777 12.4316L16 11.2402Z'
                fill='#7C7C7C'
            />
        </g>
        <defs>
            <clipPath id='clip0_67_21600'>
                <rect width='32' height='32' rx='8' fill='white' />
            </clipPath>
        </defs>
    </svg>
)
export default Oil
