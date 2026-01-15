/* eslint-disable react/jsx-props-no-spreading */
import Icons from '@components/Icon'
import classNames from '@lib/classnames'
import React, { ClipboardEventHandler, InputHTMLAttributes, MutableRefObject, useState } from 'react'
import { When } from 'react-if'
import { IMaskMixin } from 'react-imask'
import { ReactElement } from 'react-imask/dist/mixin'

type Value = string
type TypeInput = 'text' | 'tel' | 'number' | 'password' | 'checkbox' | 'radio'

interface MaskedPattern {
    /**
     * The input masking
     */
    mask?: StringConstructor | NumberConstructor | string | RegExp
    /**
     * The thousands separator
     */
    thousandsSeparator?: string
    /**
     * The decimal separator
     */
    radix?: string
    /**
     * Digits after point (for Number Input)
     */
    scale?: number
}
export interface InputProps extends MaskedPattern, React.PropsWithChildren {
    /**
     * The name for input
     */
    name?: string
    /**
     * The label text displayed before (on the top side of) the input field
     */
    label?: string | React.ReactNode
    /**
     * The label text className
     */
    labelClassName?: string
    /**
     * The suffix icon for the label
     */
    labelSuffix?: React.ReactNode
    /**
     * The prefix icon for the Input
     */
    prefix?: React.ReactNode
    /**
     * The short hint is displayed in the input field before the user enters a value.
     */
    placeholder?: string
    /**
     * The input content value
     */
    value?: string
    /**
     * Callback when user input
     */
    onChange?: (value: Value) => void
    /**
     * Callback when user blur input
     */
    onBlur?: (value: Value) => void
    /**
     * Callback when user paste on input
     */
    onPaste?: ClipboardEventHandler<ReactElement> | undefined
    /**
     * Whether the input is disabled
     */
    disabled?: boolean
    /**
     * The suffix icon for the Input
     */
    suffix?: React.ReactNode
    /**
     * Error message input
     */
    error?: string | boolean
    /**
     * Success input
     */
    success?: string
    /**
     * Reusable blocks for masked patterns
     */
    blocks?: {
        [key: string]: MaskedPattern
    }
    /**
     * The max number (for Number Input)
     */
    max?: number
    /**
     * The min number (for Number Input)
     */
    min?: number
    /**
     * Set the className of wrapper input
     */
    className?: string
    /**
     * Set the panel className of group input
     */
    groupClassName?: string
    /**
     * Set the className of input field
     */
    inputClassName?: string
    /**
     * Set the className of error message
     */
    errorClassName?: string
    /**
     * Set the className of success message
     */
    successClassName?: string
    /**
     * Set the className of prefix
     */
    prefixClassName?: string
    /**
     /**
      * Set the className of suffix
      */
    suffixClassName?: string
    /**
     * Set the className of hint
     */
    hintClassName?: string
    /**
     * Set the required input
     */
    required?: boolean
    /**
     * Set the type input
     */
    type?: TypeInput
    /**
     * Set lazy attribute
     */
    lazy?: boolean
    /**
     * Set input wrapper ref attribute
     */
    inputWrapperRef?: MutableRefObject<HTMLInputElement>
    /**
     * Set inputref attribute
     */
    inputRef?: MutableRefObject<HTMLInputElement>
    /**
     * Set autocomplete attribute
     */
    autoComplete?: string
    /**
     * Set autofocus attribute
     */
    autoFocus?: boolean
    /**
     * Add component at Input right side.
     */
    inputRightSide?: React.ReactNode
    /**
     * only change on focus
     */
    onlyChangeOnFocus?: boolean
    /**
     * size input
     */
    size?: 'sm' | 'md'
    /**
     * Show hint text
     */
    hint?: string
    /**
     * readOnly for select component
     */
    isReadOnly?: boolean
    /**
     * Aria-label for
     */
    ariaLabel?: string
    /**
     * Callback when user input
     */
    onFocus?: () => void
    style?: React.CSSProperties
}

const MaskedStyledInput = IMaskMixin(({ inputRef, ...props }) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    // Generate unique ID for autofill styling
    const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

    return (
        <input
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
            ref={inputRef as React.Ref<HTMLInputElement>}
            className={classNames(
                inputId,
                'text-grey-200 hover:border-outline-color-teal focus:!caret-grey-700 dark:focus:!caret-grey-700 placeholder:!text-grey-200 placeholder:dark:!text-grey-200 h-[-webkit-fill-available] w-full flex-1 border-none bg-[transparent] !outline-none !ring-transparent',
                {
                    'cursor-not-allowed': props.disabled
                },
                props.className
            )}
        />
    )
})

const Input: React.FC<InputProps> = ({
    name,
    label,
    labelClassName,
    labelSuffix,
    prefix,
    placeholder,
    value,
    onChange,
    onBlur,
    onPaste,
    disabled,
    suffix,
    error,
    success,
    mask = String,
    blocks,
    thousandsSeparator,
    radix,
    scale,
    max,
    min,
    className,
    groupClassName,
    inputClassName,
    errorClassName,
    successClassName,
    prefixClassName,
    suffixClassName,
    required,
    type,
    lazy,
    inputWrapperRef,
    inputRef,
    autoComplete,
    autoFocus,
    inputRightSide,
    onlyChangeOnFocus,
    size,
    hint,
    hintClassName,
    isReadOnly,
    ariaLabel,
    onFocus,
    style
}: InputProps) => {
    const [focus, setFocus] = useState(false)

    const handleChange = (newValue: string) => {
        const isSameValue = value === newValue || (typeof value === 'undefined' && newValue === '')
        if (isSameValue) return

        if (!onlyChangeOnFocus) {
            onChange?.(newValue)
            return
        }

        if (focus) {
            onChange?.(newValue)
        }
    }

    const handleFocus = () => {
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)

        const isSameValue = value === '' || typeof value === 'undefined'
        if (isSameValue) return

        onBlur?.(value as Value)
    }

    return (
        <div className={classNames(groupClassName)}>
            <When condition={!!label}>
                <div>
                    <span
                        className={classNames(
                            labelClassName,
                            size === 'sm' ? 'text-[10px]' : 'text-xs',
                            'text-gray-700'
                        )}
                    >
                        {label}
                        <When condition={required}>
                            <span className={classNames('text-xs text-[#C9353F]')}>*</span>
                        </When>
                    </span>
                    <When condition={!!labelSuffix}>
                        <div>{labelSuffix}</div>
                    </When>
                </div>
            </When>
            <div ref={inputWrapperRef} className='flex justify-between gap-1'>
                <span
                    className={classNames(
                        ' flex w-full items-center overflow-hidden rounded-xl border bg-white  transition-[border] duration-100',
                        {
                            'h-11 px-4 py-3': size === 'md',
                            'h-10 px-3': size === 'sm',
                            '!border-primary-300': focus,
                            '!border-text-transparent-15 !bg-gray-200': disabled,
                            '!border-[#C9353F] hover:!border-[#C9353F]': error,
                            'hover:border-primary-300': !error && !disabled
                        },
                        className
                    )}
                >
                    <When condition={!!prefix}>
                        <div className={classNames('flex', prefixClassName)}>{prefix}</div>
                    </When>
                    <MaskedStyledInput
                        data-testid='twc-input'
                        readOnly={isReadOnly}
                        name={name}
                        value={value}
                        placeholder={placeholder}
                        onAccept={handleChange}
                        onFocus={onFocus || handleFocus}
                        onBlur={handleBlur}
                        disabled={disabled}
                        mask={mask as NumberConstructor}
                        blocks={blocks as any}
                        unmask={true as false}
                        thousandsSeparator={thousandsSeparator}
                        radix={radix}
                        scale={scale}
                        max={max}
                        min={min}
                        type={type}
                        lazy={lazy}
                        onPaste={onPaste}
                        inputRef={(referrence: HTMLInputElement) => {
                            if (inputRef) {
                                // eslint-disable-next-line no-param-reassign
                                inputRef.current = referrence
                            }
                        }}
                        className={inputClassName}
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        aria-label={ariaLabel}
                        style={{ ...style }}
                    />
                    <When condition={!!suffix}>
                        <div className={classNames('ml-1 flex', suffixClassName)}>{suffix}</div>
                    </When>
                </span>
            </div>
            {inputRightSide}
            <When condition={hint && !error}>
                <span className={classNames(hintClassName, 'mr-[10px]', size === 'sm' ? 'text-[10px]' : '')}>
                    {hint}
                </span>
            </When>
            <When condition={error}>
                <span
                    className={classNames(errorClassName, 'mr-[10px] flex flex-row gap-1 pt-2 text-xs text-[#C9353F]')}
                >
                    <Icons icon='Interuption' /> {error}
                </span>
            </When>
            <When condition={success}>
                <span className={classNames(successClassName, 'text-primary-300 mr-[10px] text-xs')}>{success}</span>
            </When>
        </div>
    )
}

export default Input
