/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const MinusCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_1036_10786)'>
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M10.0026 2.50016C5.86047 2.50016 2.5026 5.85803 2.5026 10.0002C2.5026 14.1423 5.86047 17.5002 10.0026 17.5002C14.1447 17.5002 17.5026 14.1423 17.5026 10.0002C17.5026 5.85803 14.1447 2.50016 10.0026 2.50016ZM0.835938 10.0002C0.835938 4.93755 4.93999 0.833496 10.0026 0.833496C15.0652 0.833496 19.1693 4.93755 19.1693 10.0002C19.1693 15.0628 15.0652 19.1668 10.0026 19.1668C4.93999 19.1668 0.835938 15.0628 0.835938 10.0002ZM5.83594 10.0002C5.83594 9.53992 6.20903 9.16683 6.66927 9.16683H13.3359C13.7962 9.16683 14.1693 9.53992 14.1693 10.0002C14.1693 10.4604 13.7962 10.8335 13.3359 10.8335H6.66927C6.20903 10.8335 5.83594 10.4604 5.83594 10.0002Z'
                fill='currentColor'
            />
        </g>
        <defs>
            <clipPath id='clip0_1036_10786'>
                <rect width='20' height='20' fill='currentCollr' />
            </clipPath>
        </defs>
    </svg>
)
export default MinusCircle
