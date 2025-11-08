/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const ChevronVertical: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
    return (
        <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
            <path
                d='M5.8335 12.5L10.0002 16.6667L14.1668 12.5M5.8335 7.50004L10.0002 3.33337L14.1668 7.50004'
                stroke='#697586'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    )
}
export default ChevronVertical
