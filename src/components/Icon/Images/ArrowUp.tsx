/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const ArrowUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='8' height='8' viewBox='0 0 8 8' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_68_26118)'>
            <path
                d='M7.48241 3.56515C7.45641 3.62746 7.39576 3.66812 7.32846 3.66812H5.50274V7.83338C5.50274 7.92535 5.42809 8 5.33612 8H2.67034C2.57837 8 2.50373 7.92535 2.50373 7.83338V3.6681H0.671009C0.603704 3.6681 0.543052 3.62744 0.517061 3.56546C0.491397 3.50316 0.505393 3.43151 0.553049 3.38385L3.87694 0.0489674C3.90826 0.0176497 3.95059 -1.62125e-05 3.9949 -1.62125e-05C4.03921 -1.62125e-05 4.08154 0.0176497 4.11286 0.0486393L7.44642 3.38353C7.49407 3.4312 7.5084 3.50283 7.48241 3.56515Z'
                fill='currentColor'
            />
        </g>
        <defs>
            <clipPath id='clip0_68_26118'>
                <rect width='8' height='8' fill='white' />
            </clipPath>
        </defs>
    </svg>
)
export default ArrowUp
