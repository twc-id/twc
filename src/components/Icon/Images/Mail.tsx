/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Mail: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_20_30446)'>
            <g clipPath='url(#clip1_20_30446)'>
                <path
                    d='M4.5 5.42285C3.39543 5.42285 2.5 6.31828 2.5 7.42285V18.4229C2.5 19.5275 3.39543 20.4229 4.5 20.4229H20.5C21.6046 20.4229 22.5 19.5275 22.5 18.4229V7.42285C22.5 6.31828 21.6046 5.42285 20.5 5.42285H4.5ZM5.4912 7.85608L11.6813 13.2209C12.1512 13.6281 12.8488 13.6281 13.3187 13.2209L19.5088 7.85608C19.8218 7.5848 20.2955 7.61864 20.5668 7.93165C20.838 8.24467 20.8042 8.71834 20.4912 8.98962L14.3011 14.3545C13.2674 15.2503 11.7326 15.2503 10.6989 14.3545L4.5088 8.98962C4.19579 8.71834 4.16195 8.24467 4.43323 7.93165C4.70451 7.61864 5.17818 7.5848 5.4912 7.85608Z'
                    fill='currentColor'
                />
            </g>
        </g>
        <defs>
            <clipPath id='clip0_20_30446'>
                <rect width='24' height='24' fill='white' transform='translate(0.5 0.922852)' />
            </clipPath>
            <clipPath id='clip1_20_30446'>
                <rect width='24' height='24' fill='white' transform='translate(0.5 0.922852)' />
            </clipPath>
        </defs>
    </svg>
)
export default Mail
