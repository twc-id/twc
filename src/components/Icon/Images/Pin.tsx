/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Pin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M11.8355 21.1913C11.8355 21.1913 5.4043 14.1263 5.4043 9.5213C5.4043 4.08755 8.9593 2.8313 11.8355 2.8313C14.483 2.8313 17.8843 4.25255 17.8843 9.5213C17.8843 14.2763 11.8355 21.1913 11.8355 21.1913Z'
            stroke='black'
            stroke-width='1.125'
        />
        <path
            d='M11.6437 10.9388C13.0789 10.9388 14.2424 9.77533 14.2424 8.34008C14.2424 6.90483 13.0789 5.74133 11.6437 5.74133C10.2084 5.74133 9.04492 6.90483 9.04492 8.34008C9.04492 9.77533 10.2084 10.9388 11.6437 10.9388Z'
            stroke='black'
            stroke-width='1.125'
        />
    </svg>
)
export default Pin
