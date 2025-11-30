/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Diamond: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='6' height='12' viewBox='0 0 6 12' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path d='M2.99023 0L5.98042 5.65685L2.99023 11.3137L4.63481e-05 5.65685L2.99023 0Z' fill='#DDDDDD' />
    </svg>
)
export default Diamond
