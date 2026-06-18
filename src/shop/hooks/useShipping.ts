import { useQuery } from '@tanstack/react-query'
import { calculateShipping, getCommunes } from '../../api/shipping.api'

export const useCommunes = () =>
  useQuery({
    queryKey: ['communes'],
    queryFn: getCommunes,
    staleTime: 30 * 60 * 1000,
  })

export const useShipping = (commune: string, cartTotal: number) =>
  useQuery({
    queryKey: ['shipping', commune, cartTotal],
    queryFn: () => calculateShipping(commune, cartTotal),
    enabled: !!commune,
    staleTime: 5 * 60 * 1000,
  })
