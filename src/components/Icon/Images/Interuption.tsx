/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Interuption: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1ZM7.25 10.5C7.25 10.9142 7.58579 11.25 8 11.25C8.41421 11.25 8.75 10.9142 8.75 10.5C8.75 10.0858 8.41421 9.75 8 9.75C7.58579 9.75 7.25 10.0858 7.25 10.5ZM7.99951 8.5C8.27565 8.5 8.49951 8.27614 8.49951 8V5.5C8.49951 5.22386 8.27565 5 7.99951 5C7.72337 5 7.49951 5.22386 7.49951 5.5V8C7.49951 8.27614 7.72337 8.5 7.99951 8.5Z'
            fill='currentColor'
        />
    </svg>
)
export default Interuption
