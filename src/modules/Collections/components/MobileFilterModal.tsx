import Button from '@components/buttons/Button'
import { Checklist } from '@components/Checkbox'
import Input from '@components/forms/Input'
import Icons from '@components/Icon'
import RadioButton from '@components/RadioButton'
import { Dialog, Transition } from '@headlessui/react'
import classNames from '@lib/classnames'
import debounce from 'lodash/debounce'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useCollapse } from 'react-collapsed'

interface CollapseProps {
    title: string
    defaultExpanded?: boolean
    children: React.ReactNode
    showCount?: boolean
    count?: number
}

const Collapse = ({ title, defaultExpanded, children, showCount, count }: CollapseProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)
    const { getToggleProps, getCollapseProps } = useCollapse({ isExpanded })

    return (
        <div className='border-grey-100 border-b py-3'>
            <button
                className='flex w-full items-center justify-between text-left'
                {...getToggleProps({
                    onClick: () => setIsExpanded(!isExpanded)
                })}
            >
                <h4 className='text-subheading-4-mobile text-grey-black dark:text-grey-white flex items-center gap-2'>
                    {title.toUpperCase()}
                    {showCount && count !== undefined && count > 0 && (
                        <span className='text-paragraph-7-mobile text-grey-400'>({count})</span>
                    )}
                </h4>

                <Icons
                    icon='ChevronDown'
                    width={16}
                    height={16}
                    className={classNames('text-grey-500 dark:text-grey-400 transition-transform ', {
                        'rotate-180': isExpanded
                    })}
                />
            </button>
            <div {...getCollapseProps()}>
                <div className='mt-2'>{children}</div>
            </div>
        </div>
    )
}

interface MobileFilterModalProps {
    open: boolean
    onClose: () => void
    onApply: (filters: any) => void
    initialFilters: any
    brandOptions?: Array<{ id: string; name: string }>
}

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
    open,
    onClose,
    onApply,
    initialFilters,
    brandOptions = []
}) => {
    // Local temporary filter state
    const [tempFilters, setTempFilters] = useState(initialFilters)

    // Sync with initial filters when modal opens
    useEffect(() => {
        if (open) {
            setTempFilters(initialFilters)
        }
    }, [open, initialFilters])

    const metaData = [
        {
            key: 'brands' as const,
            label: 'Brands',
            type: 'checkbox' as const
        },
        {
            key: 'availability' as const,
            label: 'Availability',
            type: 'checkbox' as const
        },
        {
            key: 'condition' as const,
            label: 'Conditions',
            type: 'checkbox' as const
        },
        {
            key: 'gender' as const,
            label: 'Genders',
            type: 'checkbox' as const
        },
        {
            key: 'priceRange' as const,
            label: 'Price Range',
            type: 'range' as const
        },
        {
            key: 'sortBy' as const,
            label: 'Sort By',
            type: 'radio' as const
        }
    ]

    const availabilityOptions = [
        { id: 'instock', name: 'Available' },
        { id: 'outofstock', name: 'Need Reservation' }
    ]

    const conditionOptions = [
        { id: 'brand-new', name: 'Brand New' },
        { id: 'pre-owned-like-new', name: 'Pre-Owned' }
    ]

    const genderOptions = [
        { id: 'men', name: 'Men' },
        { id: 'women', name: 'Women' }
    ]

    const sortByOptions = [
        { id: 'default', name: 'Newest Arrival' },
        { id: 'year-asc', name: 'Year: Newest first' },
        { id: 'year-desc', name: 'Year: Oldest first' },
        { id: 'price-desc', name: 'Price: High to low' },
        { id: 'price-asc', name: 'Price: Low to high' }
    ]

    const [localMin, setLocalMin] = useState<string>(tempFilters.priceRange.min ?? '')
    const [localMax, setLocalMax] = useState<string>(tempFilters.priceRange.max ?? '')

    useEffect(() => {
        setLocalMin(tempFilters.priceRange.min ?? '')
        setLocalMax(tempFilters.priceRange.max ?? '')
    }, [tempFilters.priceRange.min, tempFilters.priceRange.max])

    const applyPriceRange = useMemo(
        () =>
            debounce((min?: string, max?: string) => {
                setTempFilters((prev: any) => ({
                    ...prev,
                    priceRange: { min, max }
                }))
            }, 500),
        []
    )

    useEffect(() => {
        return () => {
            applyPriceRange.cancel()
        }
    }, [applyPriceRange])

    const setTempFilter = (key: string, value: any) => {
        setTempFilters((prev: any) => ({
            ...prev,
            [key]: value
        }))
    }

    const resetIndividualFilter = (key: (typeof metaData)[0]['key']) => {
        if (key === 'brands' || key === 'availability' || key === 'condition' || key === 'gender') {
            setTempFilter(key, [])
        } else if (key === 'priceRange') {
            setTempFilter('priceRange', {})
            setLocalMin('')
            setLocalMax('')
        } else if (key === 'sortBy') {
            setTempFilter('sortBy', 'default')
        }
    }

    const resetAllFilters = () => {
        setTempFilters({
            brands: [],
            availability: [],
            condition: [],
            gender: [],
            priceRange: {},
            sortBy: 'default'
        })
        setLocalMin('')
        setLocalMax('')
    }

    const hasActiveFilter = (key: (typeof metaData)[0]['key']) => {
        if (key === 'brands' || key === 'availability' || key === 'condition' || key === 'gender') {
            return tempFilters[key].length > 0
        } else if (key === 'priceRange') {
            return !!(tempFilters.priceRange.min || tempFilters.priceRange.max)
        } else if (key === 'sortBy') {
            return tempFilters.sortBy !== 'default'
        }
        return false
    }

    const handleApply = () => {
        onApply(tempFilters)
        onClose()
    }

    const renderFilterOptions = (item: (typeof metaData)[0]) => {
        const { key, type } = item
        const hasActive = hasActiveFilter(key)

        if (type === 'checkbox') {
            let options: Array<{ id: string; name: string }> = []

            if (key === 'brands') options = brandOptions
            else if (key === 'availability') options = availabilityOptions
            else if (key === 'condition') options = conditionOptions
            else if (key === 'gender') options = genderOptions

            // Split into two columns for brands
            const isDoubleColumn = key === 'brands'
            const midPoint = isDoubleColumn ? Math.ceil(options.length / 2) : options.length
            const leftColumn = options.slice(0, midPoint)
            const rightColumn = isDoubleColumn ? options.slice(midPoint) : []

            return (
                <div className='flex flex-col gap-4'>
                    <div
                        className={classNames('flex gap-4', {
                            'flex-row': isDoubleColumn,
                            'flex-col': !isDoubleColumn
                        })}
                    >
                        <div className='flex flex-1 flex-col gap-4'>
                            {leftColumn.map((option) => (
                                <Checklist
                                    key={option.id}
                                    onChange={(e) => {
                                        const currentValues = tempFilters[key]
                                        let newValues: string[]
                                        if (e) {
                                            newValues = [...currentValues, option.id]
                                        } else {
                                            newValues = currentValues.filter((id: string) => id !== option.id)
                                        }
                                        setTempFilter(key, newValues)
                                    }}
                                    checked={tempFilters[key].includes(option.id)}
                                    textClassName='text-paragraph-7-mobile'
                                    size='sm'
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: option.name
                                        }}
                                    />
                                </Checklist>
                            ))}
                        </div>
                        {isDoubleColumn && rightColumn.length > 0 && (
                            <div className='flex flex-1 flex-col gap-4'>
                                {rightColumn.map((option) => (
                                    <Checklist
                                        key={option.id}
                                        onChange={(e) => {
                                            const currentValues = tempFilters[key]
                                            let newValues: string[]
                                            if (e) {
                                                newValues = [...currentValues, option.id]
                                            } else {
                                                newValues = currentValues.filter((id: string) => id !== option.id)
                                            }
                                            setTempFilter(key, newValues)
                                        }}
                                        checked={tempFilters[key].includes(option.id)}
                                        textClassName='text-paragraph-7-mobile'
                                        size='sm'
                                    >
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: option.name
                                            }}
                                        />
                                    </Checklist>
                                ))}
                            </div>
                        )}
                    </div>
                    {hasActive && (
                        <button
                            onClick={() => resetIndividualFilter(key)}
                            className='text-body-2-mobile text-grey-500 text-left font-normal uppercase hover:opacity-70'
                        >
                            RESET
                        </button>
                    )}
                </div>
            )
        }

        if (type === 'range') {
            return (
                <div className='flex flex-col gap-3'>
                    <div className='flex items-center gap-2'>
                        <Input
                            type='number'
                            placeholder='From'
                            value={localMin}
                            onChange={(e) => {
                                setLocalMin(e)
                                applyPriceRange(e, localMax)
                            }}
                        />

                        <span className='text-grey-400'>-</span>

                        <Input
                            type='number'
                            placeholder='To'
                            value={localMax}
                            onChange={(e) => {
                                setLocalMax(e)
                                applyPriceRange(localMin, e)
                            }}
                        />
                    </div>
                    {/* Price range quick-select radios */}
                    <div className='flex flex-col gap-2'>
                        {(() => {
                            const priceQuickOptions: Array<{ id: string; min: string; max?: string; label: string }> = [
                                { id: '0-1000000000', min: '0', max: '1000000000', label: 'IDR 0 - IDR 1M' },
                                {
                                    id: '1000000000-5000000000',
                                    min: '1000000000',
                                    max: '5000000000',
                                    label: 'IDR 1M - IDR 5M'
                                },
                                {
                                    id: '6000000000-10000000000',
                                    min: '6000000000',
                                    max: '10000000000',
                                    label: 'IDR 6M - IDR 10M'
                                },
                                { id: '10000000000-plus', min: '10000000000', max: undefined, label: 'IDR >10M' }
                            ]

                            return priceQuickOptions.map((opt) => (
                                <div className='flex items-center gap-2' key={opt.id}>
                                    <RadioButton
                                        onChange={() =>
                                            setTempFilter('priceRange', {
                                                min: opt.min,
                                                max: opt.max
                                            })
                                        }
                                        checked={
                                            (tempFilters.priceRange.min ?? undefined) === opt.min &&
                                            (tempFilters.priceRange.max ?? undefined) === opt.max
                                        }
                                        name='price-range'
                                        value={opt.id}
                                        buttonSize='sm'
                                    />
                                    <span
                                        className='text-paragraph-7-mobile text-grey-black dark:text-grey-white cursor-pointer'
                                        onClick={() =>
                                            setTempFilter('priceRange', {
                                                min: opt.min,
                                                max: opt.max
                                            })
                                        }
                                    >
                                        {opt.label}
                                    </span>
                                </div>
                            ))
                        })()}
                    </div>

                    {hasActive && (
                        <button
                            onClick={() => resetIndividualFilter(key)}
                            className='text-body-2-mobile text-grey-500 text-left font-normal uppercase hover:opacity-70'
                        >
                            RESET
                        </button>
                    )}
                </div>
            )
        }

        if (type === 'radio') {
            return (
                <div className='flex flex-col gap-4'>
                    {sortByOptions.map((option) => (
                        <div className='flex flex-row gap-2' key={option.id}>
                            <RadioButton
                                key={option?.id}
                                onChange={() => setTempFilter('sortBy', option?.id)}
                                checked={tempFilters.sortBy === option?.id}
                                name='sort-by'
                                value={option?.id}
                                buttonSize='sm'
                            />
                            <span
                                className='text-paragraph-7-mobile text-grey-black dark:text-grey-white cursor-pointer'
                                onClick={() => setTempFilter('sortBy', option?.id)}
                            >
                                {option?.name}
                            </span>
                        </div>
                    ))}
                    {hasActive && (
                        <button
                            onClick={() => resetIndividualFilter(key)}
                            className='text-body-2-mobile text-grey-500 text-left font-normal uppercase hover:opacity-70'
                        >
                            RESET
                        </button>
                    )}
                </div>
            )
        }

        return null
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as='div' className='fixed inset-0 z-[9999999] overflow-hidden' onClose={onClose}>
                <div className='absolute inset-0 overflow-hidden'>
                    <Transition.Child
                        as={Fragment}
                        enter='ease-in-out duration-300'
                        enterFrom='opacity-0'
                        enterTo='opacity-100'
                        leave='ease-in-out duration-300'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                    >
                        <div className='absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity' />
                    </Transition.Child>

                    <div className='fixed inset-0 flex'>
                        <Transition.Child
                            as={Fragment}
                            enter='transform transition ease-in-out duration-300'
                            enterFrom='translate-y-full'
                            enterTo='translate-y-0'
                            leave='transform transition ease-in-out duration-300'
                            leaveFrom='translate-y-0'
                            leaveTo='translate-y-full'
                        >
                            <div className='relative flex h-full w-full flex-col overflow-y-auto bg-white'>
                                {/* Header */}
                                <div className='border-grey-100 sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-4'>
                                    <Dialog.Title className='text-subheading-4-mobile text-grey-black'>
                                        Filter
                                    </Dialog.Title>
                                    <button
                                        type='button'
                                        className='text-grey-400 hover:text-grey-600'
                                        onClick={onClose}
                                    >
                                        <Icons icon='XClose' width={24} height={24} />
                                    </button>
                                </div>

                                {/* Filter Content */}
                                <div className='flex-1 overflow-y-auto px-4'>
                                    {metaData.map((item) => (
                                        <Collapse
                                            key={item.key}
                                            title={item.label}
                                            defaultExpanded={item.key === 'brands'}
                                            showCount={
                                                item.key === 'brands' ||
                                                item.key === 'availability' ||
                                                item.key === 'condition' ||
                                                item.key === 'gender'
                                            }
                                            count={
                                                item.key === 'brands' ||
                                                item.key === 'availability' ||
                                                item.key === 'condition' ||
                                                item.key === 'gender'
                                                    ? tempFilters[item.key].length
                                                    : undefined
                                            }
                                        >
                                            {renderFilterOptions(item)}
                                        </Collapse>
                                    ))}
                                </div>

                                {/* Footer with buttons */}
                                <div className='border-grey-100 sticky bottom-0 border-t bg-white px-4 py-4'>
                                    <Button variant='primary' className='mb-3 w-full' onClick={handleApply}>
                                        Apply Filter
                                    </Button>
                                    <button
                                        type='button'
                                        className='text-button-3-mobile text-grey-black w-full py-2 text-center hover:opacity-70'
                                        onClick={resetAllFilters}
                                    >
                                        Reset All
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default MobileFilterModal
