import axiosClient from './axiosClient'
import type { Cart } from '../types'

interface BackendCartItem {
  product: string
  name: string
  price: number
  imageUrl: string
  quantity: number
  sku: string
}

interface BackendCart {
  _id: string
  sessionId?: string
  user?: string
  items: BackendCartItem[]
}

type BackendCartResponse = { success: boolean; data: BackendCart }

const toFrontendCart = (raw: BackendCart): Cart => ({
  _id: raw._id,
  sessionId: raw.sessionId,
  userId: raw.user,
  items: raw.items.map((item) => ({
    ...item,
    subtotal: item.price * item.quantity,
  })),
  subtotal: raw.items.reduce((s, i) => s + i.price * i.quantity, 0),
  itemCount: raw.items.reduce((s, i) => s + i.quantity, 0),
})

export const getCart = async (): Promise<Cart> => {
  const { data } = await axiosClient.get<BackendCartResponse>('/cart')
  return toFrontendCart(data.data)
}

export const addItem = async (productId: string, quantity: number): Promise<Cart> => {
  const { data } = await axiosClient.post<BackendCartResponse>('/cart/items', { productId, quantity })
  return toFrontendCart(data.data)
}

export const updateItem = async (productId: string, quantity: number): Promise<Cart> => {
  const { data } = await axiosClient.patch<BackendCartResponse>(`/cart/items/${productId}`, { quantity })
  return toFrontendCart(data.data)
}

export const removeItem = async (productId: string): Promise<Cart> => {
  const { data } = await axiosClient.delete<BackendCartResponse>(`/cart/items/${productId}`)
  return toFrontendCart(data.data)
}

export const clearCart = async (): Promise<void> => {
  await axiosClient.delete('/cart')
}

export const mergeCart = async (token?: string): Promise<Cart> => {
  const { data } = await axiosClient.post<BackendCartResponse>(
    '/cart/merge',
    null,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  )
  return toFrontendCart(data.data)
}
