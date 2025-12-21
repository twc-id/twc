import classNames from '@lib/classnames'
import React, { useCallback } from 'react'

import Checkbox, { CheckboxProps } from './Checkbox'

interface ChecklistProps extends Omit<CheckboxProps, 'size'>, React.PropsWithChildren {
    size: 'sm' | 'md'
    textClassName?: string
}

const Checklist = ({ size, children, textClassName, onChange, ...props }: ChecklistProps) => {
    const getCheckboxSize = useCallback(() => {
        if (size === 'sm') {
            return 'sm'
        }

        return 'md'
    }, [size])

    return (
        <div
            className={classNames('flex items-center gap-2', {
                'gap-3': size === 'md',
                'cursor-pointer': !!onChange
            })}
            onClick={() => onChange && onChange(!props.checked)}
        >
            <div className='w-fit'>
                <Checkbox size={getCheckboxSize()} {...props} />
            </div>
            <span className={classNames('text-grey-black dark:text-grey-white', textClassName)}>{children}</span>
        </div>
    )
}

export default Checklist
