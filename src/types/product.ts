import type { Category } from './category'

export interface Product {
  _id: string
  name: string
  slug: string
  sku: string
  description?: string
  shortDescription?: string
  category: Category
  images: { url: string; alt: string }[]
  price: number
  compareAtPrice?: number
  unit: string
  stock: number
  isActive: boolean
  isFeatured: boolean
  brand?: string
}
