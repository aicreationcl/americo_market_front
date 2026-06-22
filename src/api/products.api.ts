import axiosClient from './axiosClient'
import type { Product, PaginatedResponse } from '../types'

export interface ProductFilters {
  category?: string
  search?: string
  page?: number
  limit?: number
  featured?: boolean
}

type BackendPaginatedProducts = {
  success: boolean
  data: Product[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const getProducts = async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { MOCK_PRODUCTS } = await import('@/mocks/data/products.mock')
    const items = filters.category
      ? MOCK_PRODUCTS.filter((p) => p.category.slug === filters.category)
      : MOCK_PRODUCTS
    const searched = filters.search
      ? items.filter((p) => p.name.toLowerCase().includes(filters.search!.toLowerCase()))
      : items
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20
    const start = (page - 1) * limit
    return {
      data: searched.slice(start, start + limit),
      total: searched.length,
      page,
      limit,
      totalPages: Math.ceil(searched.length / limit),
    }
  }
  const { data } = await axiosClient.get<BackendPaginatedProducts>('/products', { params: filters })
  return {
    data: data.data,
    total: data.pagination.total,
    page: data.pagination.page,
    limit: data.pagination.limit,
    totalPages: data.pagination.totalPages,
  }
}

export const getFeaturedProducts = async (): Promise<Product[]> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { MOCK_FEATURED_PRODUCTS } = await import('@/mocks/data/products.mock')
    return MOCK_FEATURED_PRODUCTS
  }
  const { data } = await axiosClient.get<{ success: boolean; data: Product[] }>('/products/featured')
  return data.data
}

export const getProductBySlug = async (slug: string): Promise<Product> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { MOCK_PRODUCTS } = await import('@/mocks/data/products.mock')
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug)
    if (!product) throw new Error(`Producto no encontrado: ${slug}`)
    return product
  }
  const { data } = await axiosClient.get<{ success: boolean; data: Product }>(`/products/${slug}`)
  return data.data
}
