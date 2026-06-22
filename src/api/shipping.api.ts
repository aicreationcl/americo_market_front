import axiosClient from './axiosClient'
import type { ShippingCalculation, PickupStore } from '../types'

export const calculateShipping = async (commune: string, cartTotal: number): Promise<ShippingCalculation> => {
  const { data } = await axiosClient.post<{ success: boolean; data: ShippingCalculation }>(
    '/shipping/calculate',
    { commune, cartTotal }
  )
  return data.data
}

export const getCommunes = async (): Promise<string[]> => {
  const { data } = await axiosClient.get<{ success: boolean; data: Array<{ commune: string }> }>('/shipping/communes')
  return data.data.map((z) => z.commune)
}

export const getStores = async (): Promise<PickupStore[]> => {
  const { data } = await axiosClient.get<{ success: boolean; data: PickupStore[] }>('/shipping/stores')
  return data.data
}
