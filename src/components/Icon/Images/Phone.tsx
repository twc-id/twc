/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Phone: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='24' height='25' viewBox='0 0 24 25' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_20_30440)'>
            <g clipPath='url(#clip1_20_30440)'>
                <path
                    d='M21 17.161V20.4229C21 21.5275 20.1046 22.4229 19 22.4229C10.1634 22.4229 3 15.2595 3 6.42285C3 5.31828 3.89543 4.42285 5 4.42285H8.26205C9.14526 4.42285 9.92391 5.00219 10.1777 5.84816L11.0143 8.6368C11.0671 8.81298 11.019 9.00396 10.8889 9.13403L9.30816 10.7148C9.30301 10.72 9.30011 10.727 9.30011 10.7342C9.30011 13.7103 11.7127 16.1229 14.6887 16.1229C14.696 16.1229 14.703 16.12 14.7082 16.1148L16.2889 14.5341C16.419 14.404 16.61 14.3559 16.7862 14.4087L19.5747 15.2453C20.4207 15.4991 21 16.2777 21 17.161Z'
                    fill='currentColor'
                />
            </g>
        </g>
        <defs>
            <clipPath id='clip0_20_30440'>
                <rect width='24' height='24' fill='white' transform='translate(0 0.922852)' />
            </clipPath>
            <clipPath id='clip1_20_30440'>
                <rect width='24' height='24' fill='white' transform='translate(0 0.922852)' />
            </clipPath>
        </defs>
    </svg>
)
export default Phone
