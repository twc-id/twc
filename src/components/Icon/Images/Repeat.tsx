/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Repeat: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M14.25 2L16.5 4.25L14.25 6.5M5.25 17L3 14.75L5.25 12.5'
            stroke='currentColor'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
        />
        <path
            d='M16.5 4.25H8.25C6.85761 4.25 5.52226 4.80312 4.53769 5.78769C3.55312 6.77226 3 8.10761 3 9.5M3 14.75H11.25C12.6424 14.75 13.9777 14.1969 14.9623 13.2123C15.9469 12.2277 16.5 10.8924 16.5 9.5'
            stroke='currentColor'
            stroke-width='1.5'
            stroke-linecap='round'
        />
    </svg>
)
export default Repeat
