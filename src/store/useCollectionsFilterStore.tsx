import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { produce } from 'immer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FilterOptions {
    brands: string[]
    availability: string[]
    condition: string[]
    gender: string[]
    priceRange: {
        min?: string
        max?: string
    }
    sortBy: string
}

interface CollectionsFilterStore {
    filters: FilterOptions
    setFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void
    toggleArrayFilter: (key: 'brands' | 'availability' | 'condition' | 'gender', value: string) => void
    resetFilters: () => void
    getActiveFiltersCount: () => number
}

const defaultFilters: FilterOptions = {
    brands: [],
    availability: [],
    condition: [],
    gender: [],
    priceRange: {},
    sortBy: 'default'
}

const useCollectionsFilterStoreBase = create<CollectionsFilterStore>()(
    persist(
        (set, get) => ({
            filters: defaultFilters,

            setFilter: (key, value) => {
                set(
                    produce<CollectionsFilterStore>((state) => {
                        state.filters[key] = value
                    })
                )
            },

            toggleArrayFilter: (key, value) => {
                set(
                    produce<CollectionsFilterStore>((state) => {
                        const currentArray = state.filters[key] as string[]
                        const index = currentArray.indexOf(value)

                        if (index > -1) {
                            currentArray.splice(index, 1)
                        } else {
                            currentArray.push(value)
                        }
                    })
                )
            },

            resetFilters: () => {
                set(
                    produce<CollectionsFilterStore>((state) => {
                        state.filters = { ...defaultFilters }
                    })
                )
            },

            getActiveFiltersCount: () => {
                const { filters } = get()
                let count = 0

                if (filters.brands.length > 0) count += filters.brands.length
                if (filters.availability.length > 0) count += filters.availability.length
                if (filters.condition.length > 0) count += filters.condition.length
                if (filters.gender.length > 0) count += filters.gender.length
                if (filters.priceRange.min || filters.priceRange.max) count += 1
                if (filters.sortBy !== 'default') count += 1

                return count
            }
        }),
        {
            name: 'collections-filter-storage',
            partialize: (state) => ({ filters: state.filters })
        }
    )
)

const useCollectionsFilterStore = createSelectorHooks(useCollectionsFilterStoreBase)

export default useCollectionsFilterStore
