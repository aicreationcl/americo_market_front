import { create } from 'zustand'

interface UIState {
  isCartOpen: boolean
  activeModal: string | null
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  openModal: (name: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  isCartOpen: false,
  activeModal: null,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
}))
