/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react'

const Chat: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
        <g clipPath='url(#clip0_20_30452)'>
            <g clipPath='url(#clip1_20_30452)'>
                <path
                    d='M19.5 4.92285H5.5C4.39543 4.92285 3.5 5.81828 3.5 6.92285V15.9229C3.5 17.0275 4.39543 17.9229 5.5 17.9229H9.5V20.7158C9.5 21.1612 10.0386 21.3843 10.3535 21.0693L13.5 17.9229H19.5C20.6046 17.9229 21.5 17.0275 21.5 15.9229V6.92285C21.5 5.81828 20.6046 4.92285 19.5 4.92285Z'
                    fill='currentColor'
                />
            </g>
        </g>
        <defs>
            <clipPath id='clip0_20_30452'>
                <rect width='24' height='24' fill='white' transform='translate(0.5 0.922852)' />
            </clipPath>
            <clipPath id='clip1_20_30452'>
                <rect width='24' height='24' fill='white' transform='translate(0.5 0.922852)' />
            </clipPath>
        </defs>
    </svg>
)
export default Chat
