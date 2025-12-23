import { Checklist } from '@components/Checkbox'
import Icons from '@components/Icon'
import RadioButton from '@components/RadioButton'
import classNames from '@lib/classnames'
import useCollectionsFilterStore from '@store/useCollectionsFilterStore'
import React, { useState } from 'react'
import { useCollapse } from 'react-collapsed'

interface CollapseProps {
    title: string
    defaultExpanded?: boolean
    children: React.ReactNode
}

const Collapse = ({ title, defaultExpanded, children }: CollapseProps) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded || false)
    const { getToggleProps, getCollapseProps } = useCollapse({ isExpanded })

    return (
        <div className='border-grey-100 border-b py-3 xl:px-4'>
            <button
                className='flex w-full items-center justify-between text-left'
                {...getToggleProps({
                    onClick: () => setIsExpanded(!isExpanded)
                })}
            >
                <h4 className='xl:text-subheading-4-desktop text-subheading-4-mobile text-grey-black dark:text-grey-white'>
                    {title}
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

interface SidebarProps {
    products: any
    brandOptions?: Array<{ id: string; name: string }>
}

const Sidebar: React.FC<SidebarProps> = ({ products, brandOptions = [] }) => {
    const filters = useCollectionsFilterStore.useFilters()
    const setFilter = useCollectionsFilterStore.useSetFilter()
    // const resetFilters = useCollectionsFilterStore.useResetFilters()
    // const getActiveFiltersCount = useCollectionsFilterStore.useGetActiveFiltersCount()

    const metaData = [
        {
            key: 'brands' as const,
            label: 'Brand',
            type: 'checkbox' as const
        },
        {
            key: 'availability' as const,
            label: 'Availability',
            type: 'checkbox' as const
        },
        {
            key: 'condition' as const,
            label: 'Condition',
            type: 'checkbox' as const
        },
        {
            key: 'gender' as const,
            label: 'Gender',
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
        { id: 'in-stock', name: 'In Stock' },
        { id: 'pre-order', name: 'Pre-Order' },
        { id: 'out-of-stock', name: 'Out of Stock' }
    ]

    const conditionOptions = [
        { id: 'new', name: 'New' },
        { id: 'pre-owned', name: 'Pre-Owned' }
    ]

    const genderOptions = [
        { id: 'men', name: 'Men' },
        { id: 'women', name: 'Women' },
        { id: 'unisex', name: 'Unisex' }
    ]

    const sortByOptions = [
        { id: 'default', name: 'Default' },
        { id: 'price-asc', name: 'Price: Low to High' },
        { id: 'price-desc', name: 'Price: High to Low' },
        { id: 'name-asc', name: 'Name: A to Z' },
        { id: 'name-desc', name: 'Name: Z to A' }
    ]

    // const getData = async () => {
    //     try {
    //         // Fetch brands or other filter options from API
    //         const response = await WooCommerce.get('products')
    //         // Extract unique brands from products
    //         const brands = response.data
    // .map((product: any) => product.brands?.[0])
    // .filter((brand: any) => brand)
    // .filter((brand: any, index: number, self: any[]) => self.findIndex((b) => b.id === brand.id) === index)
    //         setBrandOptions(brands)
    //     } catch (error) {
    //         console.log('error', error)
    //     }
    // }

    // useEffect(() => {
    //     getData()
    // }, [])

    const brands =
        brandOptions.length > 0
            ? brandOptions
            : products
                  ?.map((product: any) => product?.brands?.[0])
                  .filter((brand: any) => brand)
                  .filter(
                      (brand: any, index: number, self: any[]) => self.findIndex((b) => b.id === brand.id) === index
                  )

    const resetIndividualFilter = (key: (typeof metaData)[0]['key']) => {
        if (key === 'brands' || key === 'availability' || key === 'condition' || key === 'gender') {
            setFilter(key, [])
        } else if (key === 'priceRange') {
            setFilter('priceRange', {})
        } else if (key === 'sortBy') {
            setFilter('sortBy', 'default')
        }
    }

    const hasActiveFilter = (key: (typeof metaData)[0]['key']) => {
        if (key === 'brands' || key === 'availability' || key === 'condition' || key === 'gender') {
            return filters[key].length > 0
        } else if (key === 'priceRange') {
            return !!(filters.priceRange.min || filters.priceRange.max)
        } else if (key === 'sortBy') {
            return filters.sortBy !== 'default'
        }
        return false
    }

    const renderFilterOptions = (item: (typeof metaData)[0]) => {
        const { key, type } = item
        const hasActive = hasActiveFilter(key)

        if (type === 'checkbox') {
            let options: Array<{ id: string; name: string }> = []

            if (key === 'brands') options = brands
            else if (key === 'availability') options = availabilityOptions
            else if (key === 'condition') options = conditionOptions
            else if (key === 'gender') options = genderOptions

            return (
                <div className='flex flex-col gap-4'>
                    {options?.map((option) => (
                        <Checklist
                            key={option.id}
                            onChange={(e) => {
                                const currentValues = filters[key]
                                let newValues: string[]
                                if (e) {
                                    newValues = [...currentValues, option.id]
                                } else {
                                    newValues = currentValues.filter((id: string) => id !== option.id)
                                }
                                setFilter(key, newValues)
                            }}
                            checked={filters[key].includes(option.id)}
                            textClassName='xl:text-paragraph-7-desktop text-paragraph-7-mobile'
                            size='sm'
                        >
                            {option.name}
                        </Checklist>
                    ))}
                    {hasActive && (
                        <button
                            onClick={() => resetIndividualFilter(key)}
                            className='xl:text-body-2-desktop text-body-2-mobile text-grey-black dark:text-grey-white text-left font-semibold uppercase hover:opacity-70'
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
                        <input
                            type='number'
                            placeholder='Min'
                            className='border-grey-200 w-full rounded border px-3 py-2 text-sm'
                            value={filters.priceRange.min || ''}
                            onChange={(e) =>
                                setFilter('priceRange', {
                                    ...filters.priceRange,
                                    min: e.target.value ? Number(e.target.value) : undefined
                                })
                            }
                        />
                        <span className='text-grey-400'>-</span>
                        <input
                            type='number'
                            placeholder='Max'
                            className='border-grey-200 w-full rounded border px-3 py-2 text-sm'
                            value={filters.priceRange.max || ''}
                            onChange={(e) =>
                                setFilter('priceRange', {
                                    ...filters.priceRange,
                                    max: e.target.value ? Number(e.target.value) : undefined
                                })
                            }
                        />
                    </div>
                    {hasActive && (
                        <button
                            onClick={() => resetIndividualFilter(key)}
                            className='xl:text-body-2-desktop text-body-2-mobile text-grey-black dark:text-grey-white text-left font-semibold uppercase hover:opacity-70'
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
                                onChange={() => setFilter('sortBy', option?.id)}
                                checked={filters.sortBy === option?.id}
                                name='sort-by'
                                value={option?.id}
                                buttonSize='sm'
                            />
                            <span
                                className='xl:text-paragraph-7-desktop text-paragraph-7-mobile text-grey-black dark:text-grey-white cursor-pointer'
                                onClick={() => setFilter('sortBy', option?.id)}
                            >
                                {option?.name}
                            </span>
                        </div>
                    ))}
                    {hasActive && (
                        <button
                            onClick={() => resetIndividualFilter(key)}
                            className='xl:text-body-2-desktop text-body-2-mobile text-grey-black dark:text-grey-white text-left font-semibold uppercase hover:opacity-70'
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
        <div className='flex w-full flex-col gap-5 xl:max-w-[270px] xl:gap-6'>
            {metaData.map((item) => (
                <Collapse key={item.key} title={item.label} defaultExpanded={item.key === 'brands'}>
                    {renderFilterOptions(item)}
                </Collapse>
            ))}
        </div>
    )
}

export default Sidebar
