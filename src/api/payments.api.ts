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

export interface WebpayInitResult {
  token: string
  url: string
}

export const initWebpay = async (orderId: string): Promise<WebpayInitResult> => {
  const { data } = await axiosClient.post<{ success: boolean; data: WebpayInitResult }>(
    '/payments/webpay/init',
    { orderId }
  )
  return data.data
}
