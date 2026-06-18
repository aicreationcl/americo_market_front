import { useQuery } from '@tanstack/react-query'
import { getProducts, getFeaturedProducts } from '../api/products.api'
import type { ProductFilters } from '../api/products.api'

export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    placeholderData: (prev) => prev,
    staleTime: 2 * 60 * 1000,
  })

export const useFeaturedProducts = () =>
  useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
    staleTime: 5 * 60 * 1000,
  })
