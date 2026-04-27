import classNames from '@lib/classnames'
import { ChangeEventHandler, InputHTMLAttributes } from 'react'

interface RadioButtonProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    value: string | number
    id?: string
    onChange: ChangeEventHandler<HTMLInputElement>
    disabled?: boolean
    buttonSize?: 'sm' | 'md'
    checked?: boolean
    noHover?: boolean
}

const sizeMap = {
    sm: {
        outer: 'w-4 h-4',
        inner: 'w-2.5 h-2.5'
    },
    md: {
        outer: 'w-5 h-5',
        inner: 'w-[10px] h-[10px]'
    }
}

const RadioButton = ({
    name,
    value,
    id = 'option',
    disabled = false,
    buttonSize = 'md',
    checked = false,
    noHover = false,
    onChange
}: RadioButtonProps) => {
    return (
        <label className='inline-flex cursor-pointer items-center' id={id}>
            <input
                type='radio'
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className='sr-only'
            />

            <span
                className={classNames(
                    'flex items-center justify-center rounded-full border-[1.5px] transition-all duration-100',
                    sizeMap[buttonSize].outer,

                    // default
                    'border-grey-black dark:border-grey-white',

                    // hover
                    !noHover &&
                        !disabled && [
                            'hover:bg-grey-black',
                            'hover:border-grey-black',
                            'dark:hover:bg-grey-white',
                            'dark:hover:border-grey-white'
                        ],

                    // checked
                    checked && ['bg-grey-white', 'border-grey-black', 'dark:bg-grey-black', 'dark:border-grey-white'],

                    // active
                    !disabled &&
                        'active:shadow-[0px_0px_0px_4px_rgba(226,242,243,0.5)] dark:active:shadow-[0px_0px_0px_4px_#122A2B]',

                    // disabled
                    disabled && [
                        'cursor-not-allowed',
                        'bg-grey-black/80',
                        'border-grey-black/80',
                        'dark:bg-grey-white/80',
                        'dark:border-grey-white/80'
                    ]
                )}
            >
                {/* inner dot */}
                {checked && (
                    <span
                        className={classNames(
                            'rounded-full',
                            sizeMap[buttonSize].inner,
                            disabled ? 'bg-grey-black/80 dark:bg-grey-white/80' : 'bg-grey-black dark:bg-grey-white'
                        )}
                    />
                )}
            </span>
        </label>
    )
}

export default RadioButton
