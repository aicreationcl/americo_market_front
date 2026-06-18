import type { Product } from './product'

export interface CartItem {
  _id: string
  product: Product
  quantity: number
  price: number
  subtotal: number
}

export interface Cart {
  _id: string
  sessionId?: string
  userId?: string
  items: CartItem[]
  subtotal: number
  itemCount: number
}
