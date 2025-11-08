/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const ArrowDownFilled: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_20_28903)'>
            <path
                d='M1.17085 1.36035C0.752927 1.36035 0.519434 1.84264 0.778646 2.17047L4.603 7.00721C4.80318 7.26039 5.18723 7.26039 5.38742 7.00721L9.21177 2.17047C9.47099 1.84264 9.23749 1.36035 8.81956 1.36035H1.17085Z'
                fill='currentColor'
            />
        </g>
        <defs>
            <clipPath id='clip0_20_28903'>
                <rect width='10' height='7' fill='white' transform='translate(0 0.5)' />
            </clipPath>
        </defs>
    </svg>
)
export default ArrowDownFilled
