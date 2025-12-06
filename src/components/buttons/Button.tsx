/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/button-has-type */
import Loader from '@components/Loader'
import classNames from '@lib/classnames'
import { cva, type VariantProps } from 'class-variance-authority'
import React from 'react'

// const disabledOutline: string[] = [
//     'disabled:bg-[#F4F6F8]',
//     'border-text-transparent-10',
//     'disabled:border-none',
//     'disabled:text-[#BBC2C8]'
// ]

const buttonVariants = cva(
    [
        'border',
        'text-center',
        'focus:outline-none',
        'disabled:cursor-not-allowed',
        'flex',
        'items-center',
        'justify-center',
        'gap-2'
    ],
    {
        variants: {
            variant: {
                primary: [
                    'bg-grey-white',
                    'hover:bg-opacity-80',
                    'disabled:bg-[#F4F6F8]',
                    'text-grey-black',
                    'disabled:text-[#BBC2C8]',
                    'border',
                    'border-grey-black'
                ],
                secondary: [
                    'bg-grey-black',
                    'hover:bg-opacity-80',
                    '!text-grey-white',
                    'border-none',
                    'dark:border',
                    'hover:border',
                    'hover:border-grey-white'
                ]
                // danger: [
                //     'bg-error-500',
                //     'hover:bg-opacity-80',
                //     'disabled:bg-[#F4F6F8]',
                //     'text-white',
                //     'disabled:text-[#BBC2C8]',
                //     'border-none'
                // ],
                // dangerOutline: [
                //     'bg-transparent',
                //     '!border-error-500',
                //     'text-error-500',
                //     'hover:bg-error-100',
                //     ...disabledOutline
                // ],
                // gray: [
                //     'bg-gray-[#F4F6F8]',
                //     'hover:bg-opacity-80',
                //     'disabled:bg-[#F4F6F8]',
                //     'text-gray-500',
                //     ...disabledOutline
                // ],
                // grayOutline: ['bg-transparent', ...disabledOutline],
                // primaryOutline: ['bg-transparent', 'border-primary-500', 'text-primary-500', ...disabledOutline]
            },
            size: {
                sm: ['py-2', 'px-3.5', 'text-xs', 'font-bold'],
                md: ['py-2.5', 'px-5', 'text-button-3-desktop']
            },
            block: {
                true: 'w-full'
            }
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
            block: false
        }
    }
)

export type ButtonVariant = VariantProps<typeof buttonVariants>['variant']

export interface ButtonProps
    extends VariantProps<typeof buttonVariants>,
        React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    loading?: boolean
}

const Button = ({ variant, size, children, block, className, loading, ...rest }: ButtonProps) => (
    <button {...rest} className={classNames(buttonVariants({ variant, size, block }), className)}>
        {loading ? <Loader type='ThreeDots' width={32} height={24} /> : children}
    </button>
)

export default Button
