import axiosClient from './axiosClient'
import type { Category } from '../types'

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axiosClient.get<Category[]>('/categories')
  return data
}

export const getCategoryBySlug = async (slug: string): Promise<Category> => {
  const { data } = await axiosClient.get<Category>(`/categories/${slug}`)
  return data
}
