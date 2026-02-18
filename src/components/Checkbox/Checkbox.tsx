import Icons from '@components/Icon'
import classNames from '@lib/classnames'
import React, { useCallback } from 'react'
import { When } from 'react-if'

export interface CheckboxProps {
    size?: 'sm' | 'md'
    circle?: boolean
    checked?: boolean
    error?: boolean
    onChange?: (checked: boolean) => void
}

const Checkbox = ({ size = 'md', circle, checked, error, onChange }: CheckboxProps) => {
    const getSize = useCallback(() => {
        if (size === 'sm') {
            return 12
        }

        return 14
    }, [size])

    return (
        <div
            className={classNames(
                'border-grey-black dark:border-grey-white text-grey-black dark:text-grey-white flex items-center justify-center border',
                {
                    'bg-background-subtle-teal dark:bg-dark-background-subtle-teal border-grey-black dark:border-grey-white border':
                        checked,
                    'h-4 w-4 rounded-[2.67px]': size === 'sm',
                    'h-6 w-6 rounded-[4px]': size === 'md',
                    'rounded-full': circle,
                    'bg-error-500 border-error-500 text-error-500 border': error,
                    'cursor-pointer': !!onChange
                }
            )}
            onClick={() => {
                if (onChange) {
                    onChange(!checked)
                }
            }}
        >
            <When condition={checked}>
                <Icons icon='Checklist' width={getSize()} height={getSize()} />
            </When>
        </div>
    )
}

export default Checkbox
