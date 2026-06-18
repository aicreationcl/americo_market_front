import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'
import { calculateSubtotal, getItemCount } from '../utils/cartHelpers'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  setCart: (items: CartItem[]) => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      itemCount: 0,
      subtotal: 0,
      setCart: (items) =>
        set({
          items,
          itemCount: getItemCount(items),
          subtotal: calculateSubtotal(items),
        }),
      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),
      toggleDrawer: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: 'americo_cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.itemCount = getItemCount(state.items)
          state.subtotal = calculateSubtotal(state.items)
        }
      },
    }
  )
)
