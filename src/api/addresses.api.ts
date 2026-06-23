import axiosClient from './axiosClient'
import type { Address } from '../types'

export interface AddressPayload {
  alias?: string
  street: string
  number: string
  commune: string
  region?: string
  additionalInfo?: string
}

export const getAddresses = async (): Promise<Address[]> => {
  const { data } = await axiosClient.get<{ success: boolean; data: Address[] }>('/auth/me/addresses')
  return data.data
}

export const addAddress = async (payload: AddressPayload): Promise<Address[]> => {
  const { data } = await axiosClient.post<{ success: boolean; data: Address[] }>('/auth/me/addresses', payload)
  return data.data
}

export const updateAddress = async (id: string, payload: Partial<AddressPayload>): Promise<Address[]> => {
  const { data } = await axiosClient.patch<{ success: boolean; data: Address[] }>(`/auth/me/addresses/${id}`, payload)
  return data.data
}

export const deleteAddress = async (id: string): Promise<Address[]> => {
  const { data } = await axiosClient.delete<{ success: boolean; data: Address[] }>(`/auth/me/addresses/${id}`)
  return data.data
}

export const setDefaultAddress = async (id: string): Promise<Address[]> => {
  const { data } = await axiosClient.patch<{ success: boolean; data: Address[] }>(`/auth/me/addresses/${id}/default`, {})
  return data.data
}
