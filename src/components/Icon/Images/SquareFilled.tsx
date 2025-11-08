/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const SquareFilled: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M3.89844 3.8999H11.0984V11.0999H3.89844V3.8999ZM3.89844 12.8999H11.0984V20.0999H3.89844V12.8999ZM12.8984 3.8999H20.0984V11.0999H12.8984V3.8999ZM12.8984 12.8999H20.0984V20.0999H12.8984V12.8999Z'
            fill='currentColor'
        />
    </svg>
)
export default SquareFilled
