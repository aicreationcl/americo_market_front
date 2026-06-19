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
  const { data } = await axiosClient.get<PaginatedResponse<Product>>('/products', { params: filters })
  return data
}

export const getFeaturedProducts = async (): Promise<Product[]> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { MOCK_FEATURED_PRODUCTS } = await import('@/mocks/data/products.mock')
    return MOCK_FEATURED_PRODUCTS
  }
  const { data } = await axiosClient.get<Product[]>('/products/featured')
  return data
}

export const getProductBySlug = async (slug: string): Promise<Product> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { MOCK_PRODUCTS } = await import('@/mocks/data/products.mock')
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug)
    if (!product) throw new Error(`Producto no encontrado: ${slug}`)
    return product
  }
  const { data } = await axiosClient.get<Product>(`/products/${slug}`)
  return data
}
