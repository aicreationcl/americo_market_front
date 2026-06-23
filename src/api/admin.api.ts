import axiosClient from './axiosClient'
import type { Order, OrderStatus, User, Product } from '../types'
import { toFrontendOrder } from './orders.api'

export interface CreateProductPayload {
  name: string
  sku: string
  category: string
  price: number
  originalPrice?: number
  stock: number
  unit: 'un' | 'kg' | 'lt' | 'paq'
  brand?: string
  shortDescription?: string
  isFeatured?: boolean
  isActive?: boolean
  images?: { url: string; alt: string }[]
}

export const createProduct = async (payload: CreateProductPayload): Promise<Product> => {
  const { data } = await axiosClient.post<{ success: boolean; data: Product }>('/products', payload)
  return data.data
}

export const updateProduct = async (id: string, payload: Partial<CreateProductPayload>): Promise<Product> => {
  const { data } = await axiosClient.patch<{ success: boolean; data: Product }>(`/products/${id}`, payload)
  return data.data
}

export interface DashboardStats {
  ordersToday: number
  revenueToday: number
  lowStockCount: number
  recentOrders: Array<{
    _id: string
    orderNumber: string
    status: OrderStatus
    total: number
    createdAt: string
  }>
}

export interface AdminListResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getAdminProducts = async (params: {
  search?: string
  page?: number
  limit?: number
  status?: 'active' | 'inactive' | ''
} = {}): Promise<AdminListResponse<Product>> => {
  const { data } = await axiosClient.get<{
    success: boolean
    data: Product[]
    pagination: AdminListResponse<Product>['pagination']
  }>('/admin/products', { params })
  return { data: data.data, pagination: data.pagination }
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await axiosClient.get<{ success: boolean; data: DashboardStats }>('/admin/dashboard')
  return data.data
}

export const getAdminOrders = async (params: {
  status?: string
  page?: number
  limit?: number
} = {}): Promise<AdminListResponse<Order>> => {
  const { data } = await axiosClient.get<{
    success: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any[]
    pagination: AdminListResponse<Order>['pagination']
  }>('/admin/orders', { params })
  return { data: data.data.map(toFrontendOrder), pagination: data.pagination }
}

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  note?: string
): Promise<Order> => {
  const { data } = await axiosClient.patch<{ success: boolean; data: Order }>(
    `/admin/orders/${id}/status`,
    { status, note }
  )
  return data.data
}

export const getAdminUsers = async (params: {
  search?: string
  role?: string
  page?: number
  limit?: number
} = {}): Promise<AdminListResponse<User>> => {
  const { data } = await axiosClient.get<{
    success: boolean
    data: User[]
    pagination: AdminListResponse<User>['pagination']
  }>('/admin/users', { params })
  return { data: data.data, pagination: data.pagination }
}

export const uploadProductImage = async (file: File): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData()
  formData.append('image', file)
  const { data } = await axiosClient.post<{ success: boolean; data: { url: string; publicId: string } }>(
    '/admin/products/upload-image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data.data
}

export const updateUserRole = async (
  id: string,
  role: 'customer' | 'admin'
): Promise<User> => {
  const { data } = await axiosClient.patch<{ success: boolean; data: User }>(
    `/admin/users/${id}`,
    { role }
  )
  return data.data
}
