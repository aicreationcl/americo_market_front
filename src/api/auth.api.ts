import axiosClient from './axiosClient'
import type { User } from '../types'

type AuthResponse = { success: boolean; data: { accessToken: string; user: User } }
type UserResponse = { success: boolean; data: User }

export const login = async (email: string, password: string): Promise<{ accessToken: string; user: User }> => {
  const { data } = await axiosClient.post<AuthResponse>('/auth/login', { email, password })
  return data.data
}

export const register = async (payload: {
  name: string
  email: string
  password: string
}): Promise<{ accessToken: string; user: User }> => {
  const { data } = await axiosClient.post<AuthResponse>('/auth/register', payload)
  return data.data
}

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const { data } = await axiosClient.post<{ success: boolean; data: { accessToken: string } }>('/auth/refresh')
  return data.data
}

export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout')
}

export const getMe = async (): Promise<User> => {
  const { data } = await axiosClient.get<UserResponse>('/auth/me')
  return data.data
}

export const updateMe = async (payload: { name?: string; phone?: string; profileImage?: string }): Promise<User> => {
  const { data } = await axiosClient.patch<UserResponse>('/auth/me', payload)
  return data.data
}
