import { useQuery } from '@tanstack/react-query'
import { getCategories } from '../../api/categories.api'

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  })
