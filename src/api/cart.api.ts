import axiosClient from './axiosClient'
import type { Cart } from '../types'

export const getCart = async (): Promise<Cart> => {
  const { data } = await axiosClient.get<Cart>('/cart')
  return data
}

export const addItem = async (productId: string, quantity: number): Promise<Cart> => {
  const { data } = await axiosClient.post<Cart>('/cart/items', { productId, quantity })
  return data
}

export const updateItem = async (productId: string, quantity: number): Promise<Cart> => {
  const { data } = await axiosClient.put<Cart>(`/cart/items/${productId}`, { quantity })
  return data
}

export const removeItem = async (productId: string): Promise<Cart> => {
  const { data } = await axiosClient.delete<Cart>(`/cart/items/${productId}`)
  return data
}

export const clearCart = async (): Promise<void> => {
  await axiosClient.delete('/cart')
}

export const mergeCart = async (): Promise<Cart> => {
  const { data } = await axiosClient.post<Cart>('/cart/merge')
  return data
}
