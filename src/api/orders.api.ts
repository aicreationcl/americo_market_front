import axiosClient from './axiosClient'
import type { Order, OrderStatus, FulfillmentType } from '../types'

export interface CustomerDataPayload {
  name: string
  email: string
  phone?: string
}

export interface FulfillmentDataPayload {
  type: 'delivery' | 'pickup'
  shippingCost?: number
  address?: {
    street?: string
    number?: string
    commune: string
    region?: string
    additionalInfo?: string
  }
}

export interface CreateOrderPayload {
  customerData: CustomerDataPayload
  fulfillmentData: FulfillmentDataPayload
  paymentMethod?: string
  notes?: string
}

export interface CreateOrderResult {
  orderId: string
  orderNumber: string
  total: number
}

interface BackendOrderItem {
  product: string
  name?: string
  sku?: string
  price?: number
  quantity: number
  imageUrl?: string
  subtotal?: number
}

interface BackendOrder {
  _id: string
  orderNumber: string
  customer?: { userId?: string; name: string; email: string; phone?: string; rut?: string }
  items?: BackendOrderItem[]
  subtotal?: number
  shippingCost?: number
  total: number
  fulfillment?: { type: FulfillmentType; address?: object; pickupStore?: object; estimatedDate?: string }
  status: string
  statusHistory?: Array<{ status: string; changedAt: string; note?: string }>
  notes?: string
  createdAt: string
  updatedAt?: string
}

export const toFrontendOrder = (raw: BackendOrder): Order => ({
  _id: raw._id,
  orderNumber: raw.orderNumber,
  customerData: {
    name: raw.customer?.name ?? '',
    email: raw.customer?.email ?? '',
    phone: raw.customer?.phone,
    rut: raw.customer?.rut,
  },
  items: (raw.items ?? []).map((item) => ({
    product: item.product,
    name: item.name ?? '',
    sku: item.sku ?? '',
    price: item.price ?? 0,
    quantity: item.quantity,
    imageUrl: item.imageUrl ?? '',
    subtotal: item.subtotal ?? (item.price ?? 0) * item.quantity,
  })),
  subtotal: raw.subtotal ?? 0,
  total: raw.total ?? 0,
  fulfillmentData: {
    type: raw.fulfillment?.type ?? 'pickup',
    shippingCost: raw.shippingCost ?? 0,
    address: raw.fulfillment?.address as Order['fulfillmentData']['address'],
    pickupStore: raw.fulfillment?.pickupStore as Order['fulfillmentData']['pickupStore'],
    estimatedDate: raw.fulfillment?.estimatedDate,
  },
  status: raw.status as OrderStatus,
  statusHistory: (raw.statusHistory ?? []).map((h) => ({
    status: h.status,
    changedAt: h.changedAt,
    note: h.note,
  })),
  notes: raw.notes,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt ?? raw.createdAt,
})

export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResult> => {
  const { data } = await axiosClient.post<{ success: boolean; data: CreateOrderResult }>('/orders', payload)
  return data.data
}

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await axiosClient.get<{ success: boolean; data: BackendOrder[] }>('/orders/my')
  return data.data.map(toFrontendOrder)
}

export const trackOrder = async (orderNumber: string): Promise<Order> => {
  const { data } = await axiosClient.get<{ success: boolean; data: BackendOrder }>(`/orders/track/${orderNumber}`)
  return toFrontendOrder(data.data)
}
