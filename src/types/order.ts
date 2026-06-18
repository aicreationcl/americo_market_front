import type { Product } from './product'

export type FulfillmentType = 'delivery' | 'pickup'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'on_the_way'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  product: Product
  quantity: number
  price: number
  subtotal: number
}

export interface DeliveryAddress {
  street: string
  number: string
  apartment?: string
  commune: string
  references?: string
}

export interface Order {
  _id: string
  orderNumber: string
  status: OrderStatus
  fulfillmentType: FulfillmentType
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  deliveryAddress?: DeliveryAddress
  createdAt: string
  updatedAt: string
}
