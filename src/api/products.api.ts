import axiosClient from './axiosClient'
import type { Product, PaginatedResponse } from '../types'

export interface ProductFilters {
  category?: string
  search?: string
  page?: number
  limit?: number
  featured?: boolean
}

export const getProducts = async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
  const { data } = await axiosClient.get<PaginatedResponse<Product>>('/products', { params: filters })
  return data
}

export const getFeaturedProducts = async (): Promise<Product[]> => {
  const { data } = await axiosClient.get<Product[]>('/products/featured')
  return data
}

export const getProductBySlug = async (slug: string): Promise<Product> => {
  const { data } = await axiosClient.get<Product>(`/products/${slug}`)
  return data
}
