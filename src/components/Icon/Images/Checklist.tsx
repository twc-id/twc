/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Checklist: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M13.8047 3.52876C14.0651 3.78911 14.0651 4.21122 13.8047 4.47157L6.4714 11.8049C6.21106 12.0653 5.78894 12.0653 5.5286 11.8049L2.19526 8.47157C1.93491 8.21122 1.93491 7.78911 2.19526 7.52876C2.45561 7.26841 2.87772 7.26841 3.13807 7.52876L6 10.3907L12.8619 3.52876C13.1223 3.26841 13.5444 3.26841 13.8047 3.52876Z'
            fill='currentColor'
        />
    </svg>
)
export default Checklist
