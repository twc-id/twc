/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const XClose: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_325_22198)'>
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M19.0711 4.65685C19.4616 5.04738 19.4616 5.68054 19.0711 6.07107L13.4142 11.7279L19.0711 17.3848C19.4616 17.7753 19.4616 18.4085 19.0711 18.799C18.6805 19.1895 18.0474 19.1895 17.6569 18.799L12 13.1421L6.34315 18.799C5.95262 19.1895 5.31946 19.1895 4.92893 18.799C4.53841 18.4085 4.53841 17.7753 4.92893 17.3848L10.5858 11.7279L4.92893 6.07107C4.53841 5.68054 4.53841 5.04738 4.92893 4.65685C5.31946 4.26633 5.95262 4.26633 6.34315 4.65685L12 10.3137L17.6569 4.65685C18.0474 4.26633 18.6805 4.26633 19.0711 4.65685Z'
                fill='currentColor'
            />
        </g>
        <defs>
            <clipPath id='clip0_325_22198'>
                <rect width='24' height='24' fill='white' />
            </clipPath>
        </defs>
    </svg>
)
export default XClose
