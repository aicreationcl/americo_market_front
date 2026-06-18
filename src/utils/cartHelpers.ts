import type { CartItem } from '../types'

export const calculateSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.subtotal, 0)

export const getItemCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0)
