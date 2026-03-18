import { Checklist } from '@components/Checkbox'
import Input from '@components/forms/Input'
import Icons from '@components/Icon'
import RadioButton from '@components/RadioButton'
import classNames from '@lib/classnames'
import { GA_EVENTS } from '@lib/constants/analyticsEvents'
import { trackEvent } from '@lib/ga'
import useCollectionsFilterStore from '@store/useCollectionsFilterStore'
import { sanitizeHtml } from '@utils/html'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
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
        <div className='border-grey-100 border-b px-4 py-3'>
            <button
                className='flex w-full items-center justify-between text-left focus:outline-none'
                {...getToggleProps({
                    onClick: () => setIsExpanded(!isExpanded)
                })}
            >
                <h4 className='xl:text-subheading-4-desktop text-subheading-4-mobile text-grey-black dark:text-grey-white uppercase'>
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
    brandLoading?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ products, brandOptions = [], brandLoading = false }) => {
    const filters = useCollectionsFilterStore.useFilters()
    const setFilter = useCollectionsFilterStore.useSetFilter()

    const router = useRouter()

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
        { id: 'instock', name: 'In Stock' },
        { id: 'outofstock', name: 'Out of Stock' }
    ]

    const conditionOptions = [
        { id: 'brand-new', name: 'Brand New' },
        {
            id: 'new-old-stock',
            name: 'New Old Stock'
        },
        { id: 'pre-owned', name: 'Pre-Owned' }
    ]

    const genderOptions = [
        { id: 'men', name: 'Men' },
        { id: 'women', name: 'Women' },
        { id: 'unisex', name: 'Unisex' }
    ]

    const sortByOptions: Array<{
        id: 'default' | 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc'
        name: string
    }> = [
        { id: 'default', name: 'Default' },
        { id: 'price-asc', name: 'Price: Low to High' },
        { id: 'price-desc', name: 'Price: High to Low' },
        { id: 'year-asc', name: 'Year: Oldest first' },
        { id: 'year-desc', name: 'Year: Newest first' }
    ]

    const brands =
        brandOptions.length > 0
            ? brandOptions
            : products
                  ?.map((product: any) => product?.brands?.[0])
                  .filter((brand: any) => brand)
                  .filter(
                      (brand: any, index: number, self: any[]) => self.findIndex((b) => b.id === brand.id) === index
                  )

    const [localMin, setLocalMin] = useState<string>(filters.priceRange.min ?? '')
    const [localMax, setLocalMax] = useState<string>(filters.priceRange.max ?? '')

    useEffect(() => {
        setLocalMin(filters.priceRange.min ?? '')
        setLocalMax(filters.priceRange.max ?? '')
    }, [filters.priceRange.min, filters.priceRange.max])

    // If `product_brand` or `availability` exist in the URL, use them to auto-check filters
    useEffect(() => {
        const qbBrand = router.query?.product_brand
        const qbAvailability = router.query?.availability
        if (!qbBrand && !qbAvailability) return

        const parseValues = (qb: any) =>
            Array.isArray(qb)
                ? qb
                : String(qb)
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)

        if (qbBrand) {
            const values = parseValues(qbBrand)
            const same = values.length === filters.brands.length && values.every((v) => filters.brands.includes(v))
            if (!same) setFilter('brands', values)
        }

        if (qbAvailability) {
            const values = parseValues(qbAvailability)
            const same =
                values.length === filters.availability.length && values.every((v) => filters.availability.includes(v))
            if (!same) setFilter('availability', values)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query?.product_brand, router.query?.availability])

    // Keep filters in the URL so they persist on refresh / share
    useEffect(() => {
        if (!router.isReady) return

        const q: Record<string, any> = { ...router.query }

        // product_brand (brands)
        if (filters.brands && filters.brands.length > 0) q.product_brand = filters.brands.join(',')
        else delete q.product_brand

        // availability, condition, gender (comma separated)
        if (filters.availability && filters.availability.length > 0) q.availability = filters.availability.join(',')
        else delete q.availability

        if (filters.condition && filters.condition.length > 0) q.condition = filters.condition.join(',')
        else delete q.condition

        if (filters.gender && filters.gender.length > 0) q.gender = filters.gender.join(',')
        else delete q.gender

        // price range
        if (filters.priceRange?.min) q.min_price = String(filters.priceRange.min)
        else delete q.min_price
        if (filters.priceRange?.max) q.max_price = String(filters.priceRange.max)
        else delete q.max_price

        // sortBy
        if (filters.sortBy && filters.sortBy !== 'default') q.sortBy = filters.sortBy
        else delete q.sortBy

        // replace without navigation
        router.replace({ pathname: router.pathname, query: q }, undefined, { shallow: true, scroll: false })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, router.isReady])

    const applyPriceRange = useMemo(
        () =>
            debounce((min?: string, max?: string) => {
                if (min !== '' && typeof min !== 'undefined' && max !== '' && typeof max !== 'undefined') {
                    setFilter('priceRange', { min, max })
                    trackEvent(GA_EVENTS.FILTER_SELECTED)
                }
            }, 500),
        [setFilter]
    )

    useEffect(() => {
        return () => {
            applyPriceRange.cancel()
        }
    }, [applyPriceRange])

    const resetIndividualFilter = (key: (typeof metaData)[0]['key']) => {
        if (key === 'brands' || key === 'availability' || key === 'condition' || key === 'gender') {
            setFilter(key, [])
        } else if (key === 'priceRange') {
            setFilter('priceRange', {})
            setLocalMin('')
            setLocalMax('')
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
                                trackEvent(GA_EVENTS.FILTER_SELECTED)
                            }}
                            checked={filters[key].includes(option.id)}
                            textClassName='xl:text-paragraph-8-desktop text-paragraph-8-mobile !leading-none'
                            size='sm'
                        >
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(option.name)
                                }}
                            />
                        </Checklist>
                    ))}
                    {hasActive && (
                        <button
                            onClick={() => resetIndividualFilter(key)}
                            className='xl:text-body-2-desktop text-body-2-mobile text-grey-200 text-left font-semibold uppercase hover:opacity-70 focus:outline-none'
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
                            placeholder='Min'
                            value={localMin}
                            onChange={(e) => {
                                setLocalMin(e)
                                applyPriceRange(e, localMax)
                            }}
                        />

                        <span className='text-grey-400'>-</span>

                        <Input
                            type='number'
                            placeholder='max'
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
                                { id: '10000000000-plus', min: '10000000000', max: undefined, label: 'IDR > 10M' }
                            ]

                            return priceQuickOptions.map((opt) => (
                                <div className='flex items-center gap-2' key={opt.id}>
                                    <RadioButton
                                        onChange={() => {
                                            setFilter('priceRange', {
                                                min: opt.min,
                                                max: opt.max
                                            })
                                            trackEvent(GA_EVENTS.FILTER_SELECTED)
                                        }}
                                        checked={
                                            (filters.priceRange.min ?? undefined) === opt.min &&
                                            (filters.priceRange.max ?? undefined) === opt.max
                                        }
                                        name='price-range'
                                        value={opt.id}
                                        buttonSize='sm'
                                    />
                                    <span
                                        className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black dark:text-grey-white cursor-pointer'
                                        onClick={() => {
                                            setFilter('priceRange', {
                                                min: opt.min,
                                                max: opt.max
                                            })
                                            trackEvent(GA_EVENTS.FILTER_SELECTED)
                                        }}
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
                            className='xl:text-body-2-desktop text-body-2-mobile text-grey-200 text-left font-semibold uppercase hover:opacity-70 focus:outline-none'
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
                                onChange={() => {
                                    setFilter('sortBy', option?.id)
                                    trackEvent(GA_EVENTS.FILTER_SELECTED)
                                }}
                                checked={filters.sortBy === option?.id}
                                name='sort-by'
                                value={option?.id}
                                buttonSize='sm'
                            />
                            <span
                                className='xl:text-paragraph-8-desktop text-paragraph-8-mobile text-grey-black dark:text-grey-white cursor-pointer'
                                onClick={() => {
                                    setFilter('sortBy', option?.id)
                                    trackEvent(GA_EVENTS.FILTER_SELECTED)
                                }}
                            >
                                {option?.name}
                            </span>
                        </div>
                    ))}
                    {hasActive && (
                        <button
                            onClick={() => resetIndividualFilter(key)}
                            className='xl:text-body-2-desktop text-body-2-mobile text-grey-200 text-left font-semibold uppercase hover:opacity-70 focus:outline-none'
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
        <div className='scrollbar-none hidden w-full flex-col gap-5 xl:sticky xl:top-0 xl:flex xl:max-h-[calc(100dvh-130px)] xl:max-w-[270px] xl:gap-6 xl:overflow-y-auto'>
            {metaData.map((item) => (
                <Collapse key={item.key} title={item.label} defaultExpanded={item.key === 'brands'}>
                    {item.key === 'brands' && brandLoading ? (
                        <div className='flex flex-col gap-3 px-2 py-1'>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className='bg-grey-200 h-4 w-full animate-pulse rounded' />
                            ))}
                        </div>
                    ) : (
                        renderFilterOptions(item)
                    )}
                </Collapse>
            ))}
        </div>
    )
}

export default Sidebar
