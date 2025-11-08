/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const ChecklistCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            d='M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM10.4245 7.42353L7.93303 9.9236C7.6993 10.1581 7.31976 10.159 7.08497 9.92552L5.57644 8.42546C5.34147 8.1918 5.3404 7.8119 5.57406 7.57693C5.80771 7.34196 6.18761 7.34089 6.42258 7.57454L7.50611 8.652L9.57452 6.57647C9.80843 6.34175 10.1883 6.3411 10.423 6.57501C10.6578 6.80892 10.6584 7.18882 10.4245 7.42353Z'
            fill='currentColor'
        />
    </svg>
)
export default ChecklistCircle
