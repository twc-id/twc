/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Menu: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M3.89844 4.7998H20.0984V6.5998H3.89844V4.7998ZM3.89844 11.0998H20.0984V12.8998H3.89844V11.0998ZM3.89844 17.3998H20.0984V19.1998H3.89844V17.3998Z'
            fill='currentColor'
        />
    </svg>
)
export default Menu
