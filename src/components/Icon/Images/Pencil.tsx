/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Pencil: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='20' height='28' viewBox='0 0 20 28' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M12.796 16.2646L11.7355 15.2041L4.75 22.1896V23.2501H5.8105L12.796 16.2646ZM13.8565 15.2041L14.917 14.1436L13.8565 13.0831L12.796 14.1436L13.8565 15.2041ZM6.4315 24.7501H3.25V21.5678L13.3263 11.4916C13.4669 11.351 13.6576 11.272 13.8565 11.272C14.0554 11.272 14.2461 11.351 14.3868 11.4916L16.5085 13.6133C16.6491 13.754 16.7281 13.9447 16.7281 14.1436C16.7281 14.3424 16.6491 14.5332 16.5085 14.6738L6.43225 24.7501H6.4315Z'
            fill='currentColor'
        />
    </svg>
)
export default Pencil
