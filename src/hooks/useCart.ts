import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCart, addItem, updateItem, removeItem, clearCart, mergeCart } from '../api/cart.api'
import { useCartStore } from '../store/cartStore'
import type { Cart } from '../types'

const CART_KEY = ['cart']

export const useCart = () => {
  const setCart = useCartStore((s) => s.setCart)
  const queryClient = useQueryClient()

  const cartQuery = useQuery({
    queryKey: CART_KEY,
    queryFn: async () => {
      const cart = await getCart()
      setCart(cart.items)
      return cart
    },
    staleTime: 30 * 1000,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: CART_KEY })

  const onSuccess = (cart: Cart) => {
    setCart(cart.items)
    queryClient.setQueryData(CART_KEY, cart)
  }

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addItem(productId, quantity),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateItem(productId, quantity),
    onSuccess,
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeItem(productId),
    onSuccess,
  })

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      setCart([])
      queryClient.setQueryData(CART_KEY, null)
    },
  })

  const mergeMutation = useMutation({
    mutationFn: mergeCart,
    onSuccess,
  })

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    invalidate,
    addItem: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    removeItem: removeMutation.mutateAsync,
    clearCart: clearMutation.mutateAsync,
    mergeCart: mergeMutation.mutateAsync,
    isAddingItem: addMutation.isPending,
  }
}
