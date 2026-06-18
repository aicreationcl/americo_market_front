import { useQuery } from '@tanstack/react-query'
import { getProductBySlug } from '../../api/products.api'

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  })
