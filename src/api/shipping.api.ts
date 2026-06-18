import axiosClient from './axiosClient'
import type { ShippingCalculation, PickupStore } from '../types'

export const calculateShipping = async (commune: string, cartTotal: number): Promise<ShippingCalculation> => {
  const { data } = await axiosClient.get<ShippingCalculation>('/shipping/calculate', {
    params: { commune, cartTotal },
  })
  return data
}

export const getCommunes = async (): Promise<string[]> => {
  const { data } = await axiosClient.get<string[]>('/shipping/communes')
  return data
}

export const getStores = async (): Promise<PickupStore[]> => {
  const { data } = await axiosClient.get<PickupStore[]>('/shipping/stores')
  return data
}
