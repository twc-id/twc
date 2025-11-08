/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const ChartGreen: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='14' height='16' viewBox='0 0 14 16' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <path
            fill-rule='evenodd'
            clip-rule='evenodd'
            d='M4.14998 0.850006H2.84998V2.85001H0.849976V13.15H2.84998V15.15H4.14998V13.15H6.14998V2.85001H4.14998V0.850006ZM11.15 0.850006H9.84998V4.65801H7.84998V10.535H9.84998V15.15H11.15V10.535H13.15V4.65801H11.15V0.850006ZM2.14998 11.85V4.15001H4.84998V11.85H2.14998ZM9.14997 9.23401V5.95801H11.85V9.23401H9.14997Z'
            fill='currentColor'
        />
    </svg>
)
export default ChartGreen
