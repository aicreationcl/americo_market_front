import axiosClient from './axiosClient'
import type { Order, FulfillmentType } from '../types'

export interface CreateOrderPayload {
  fulfillmentType: FulfillmentType
  guestName?: string
  guestEmail?: string
  guestPhone?: string
  deliveryAddress?: {
    street: string
    number: string
    apartment?: string
    commune: string
    references?: string
  }
}

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<{ orderId: string; orderNumber: string; total: number }> => {
  const { data } = await axiosClient.post('/orders', payload)
  return data
}

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await axiosClient.get<Order[]>('/orders')
  return data
}

export const trackOrder = async (orderNumber: string): Promise<Order> => {
  const { data } = await axiosClient.get<Order>(`/orders/track/${orderNumber}`)
  return data
}
