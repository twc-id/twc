/* eslint-disable react/no-unknown-property */
import * as React from 'react'

const Oval: React.FC<LoaderProps> = ({ width, height, color, label, radius = 18 }: LoaderProps) => (
    <>
        <style jsx>{`
            .spinner {
                animation: spin 1s ease infinite;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `}</style>
        <svg
            className='spinner'
            width={width}
            height={height}
            viewBox='0 0 38 38'
            xmlns='http://www.w3.org/2000/svg'
            stroke={color}
            aria-label={label}
        >
            <g fill='none' fillRule='evenodd'>
                <g transform='translate(1 1)' strokeWidth='2'>
                    <circle strokeOpacity='.5' cx='18' cy='18' r={radius} />
                    <path d='M36 18c0-9.94-8.06-18-18-18' />
                </g>
            </g>
        </svg>
    </>
)

export default Oval
