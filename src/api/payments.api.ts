import axiosClient from './axiosClient'

export interface MPInitResult {
  preferenceId: string
  init_point: string
}

export const initMercadoPago = async (orderId: string): Promise<MPInitResult> => {
  const { data } = await axiosClient.post<{ success: boolean; data: MPInitResult }>(
    '/payments/mp/init',
    { orderId }
  )
  return data.data
}

// Stub reservado para Sprint 6
export interface WebpayInitResult {
  url: string
  token: string
}

export const initWebpay = async (_orderId: string): Promise<WebpayInitResult> => {
  throw new Error('WebPay Plus se implementa en Sprint 6')
}
