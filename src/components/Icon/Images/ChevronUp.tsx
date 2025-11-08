/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const ChevronUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M9.99956 9.204L6.28706 12.9165L5.22656 11.856L9.99956 7.083L14.7726 11.856L13.7121 12.9165L9.99956 9.204Z'
            fill='currentColor'
        />
    </svg>
)
export default ChevronUp
