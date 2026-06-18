import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, createOrder, trackOrder } from '../api/orders.api'
import type { CreateOrderPayload } from '../api/orders.api'
import { useAuthStore } from '../store/authStore'

export const useOrders = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })
}

export const useTrackOrder = (orderNumber: string) =>
  useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => trackOrder(orderNumber),
    enabled: !!orderNumber,
    staleTime: 30 * 1000,
  })

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
