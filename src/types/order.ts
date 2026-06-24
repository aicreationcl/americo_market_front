export type FulfillmentType = 'delivery' | 'pickup'

export type OrderStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface OrderItem {
  product: string   // MongoDB ObjectId string (snapshot)
  name: string
  sku: string
  price: number
  quantity: number
  imageUrl: string
  subtotal: number
}

export interface CustomerData {
  name: string
  email: string
  phone?: string
  rut?: string
}

export interface FulfillmentAddress {
  street?: string
  number?: string
  commune?: string
  region?: string
  additionalInfo?: string
}

export interface FulfillmentData {
  type: FulfillmentType
  shippingCost?: number
  address?: FulfillmentAddress
  pickupStore?: {
    name?: string
    address?: string
  }
  estimatedDate?: string
}

export interface StatusHistoryEntry {
  status: string
  changedAt: string
  note?: string
}

export type PaymentMethod = 'cash_on_delivery' | 'cash_on_pickup' | 'webpay' | 'mercadopago'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderPayment {
  method: PaymentMethod
  status: PaymentStatus
  transactionId?: string
  paidAt?: string
}

export interface Order {
  _id: string
  orderNumber: string
  customerData: CustomerData
  fulfillmentData: FulfillmentData
  items: OrderItem[]
  subtotal: number
  total: number
  status: OrderStatus
  payment?: OrderPayment
  statusHistory: StatusHistoryEntry[]
  notes?: string
  createdAt: string
  updatedAt: string
}
