import { createSelectorHooks } from 'auto-zustand-selectors-hook'
import { create } from 'zustand'

type ProductStoreType = {
    currentProduct: any
    setCurrentProduct: (product: any) => void
}

const useProductStoreBase = create<ProductStoreType>((set) => ({
    currentProduct: null,
    setCurrentProduct: (product) =>
        set({
            currentProduct: product
        })
}))

const useProductStore = createSelectorHooks(useProductStoreBase)

export default useProductStore
