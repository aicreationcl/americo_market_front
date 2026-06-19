import axiosClient from './axiosClient'
import type { Category } from '../types'

export const getCategories = async (): Promise<Category[]> => {
  if (import.meta.env.VITE_USE_MOCKS === 'true') {
    const { MOCK_CATEGORIES } = await import('@/mocks/data/categories.mock')
    return MOCK_CATEGORIES
  }
  const { data } = await axiosClient.get<Category[]>('/categories')
  return data
}

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const { data } = await axiosClient.get<Category>(`/categories/${slug}`)
  return data
}
