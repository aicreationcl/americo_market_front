import axiosClient from './axiosClient'
import type { User } from '../types'

export const login = async (email: string, password: string): Promise<{ accessToken: string; user: User }> => {
  const { data } = await axiosClient.post('/auth/login', { email, password })
  return data
}

export const register = async (payload: {
  name: string
  email: string
  password: string
}): Promise<{ accessToken: string; user: User }> => {
  const { data } = await axiosClient.post('/auth/register', payload)
  return data
}

export const refreshToken = async (): Promise<{ accessToken: string }> => {
  const { data } = await axiosClient.post('/auth/refresh')
  return data
}

export const logout = async (): Promise<void> => {
  await axiosClient.post('/auth/logout')
}

export const getMe = async (): Promise<User> => {
  const { data } = await axiosClient.get<User>('/auth/me')
  return data
}
