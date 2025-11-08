/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const PlusCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM7.99951 5.5C8.27565 5.5 8.49951 5.72386 8.49951 6V7.5H9.99951C10.2757 7.5 10.4995 7.72386 10.4995 8C10.4995 8.27614 10.2757 8.5 9.99951 8.5H8.49951V10C8.49951 10.2761 8.27565 10.5 7.99951 10.5C7.72337 10.5 7.49951 10.2761 7.49951 10V8.5H5.99951C5.72337 8.5 5.49951 8.27614 5.49951 8C5.49951 7.72386 5.72337 7.5 5.99951 7.5H7.49951V6C7.49951 5.72386 7.72337 5.5 7.99951 5.5Z'
            fill='currentColor'
        />
    </svg>
)
export default PlusCircle
