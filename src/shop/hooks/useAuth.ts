import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { login, register, logout, getMe, updateMe } from '../../api/auth.api'
import { mergeCart } from '../../api/cart.api'
import { useAuthStore } from '../../store/authStore'

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: async ({ user, accessToken }) => {
      setAuth(user, accessToken)
      try {
        // Pass token explicitly — avoid race condition where interceptor reads store
        // before the just-set accessToken propagates, which would trigger clearAuth()
        await mergeCart(accessToken)
      } catch {
        // merge failure is non-critical
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { name: string; email: string; password: string }) => register(payload),
    onSuccess: async ({ user, accessToken }) => {
      setAuth(user, accessToken)
      try {
        await mergeCart(accessToken)
      } catch {
        // merge failure is non-critical
      }
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export const useLogout = () => {
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
    },
  })
}

export const useGetMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  })
}

export const useUpdateMe = () => {
  const queryClient = useQueryClient()
  const updateUser = useAuthStore((s) => s.updateUser)

  return useMutation({
    mutationFn: (payload: { name?: string; phone?: string; profileImage?: string }) => updateMe(payload),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['me'], updatedUser)
      updateUser(updatedUser)
    },
  })
}
