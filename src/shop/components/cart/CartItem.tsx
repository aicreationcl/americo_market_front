import { motion } from 'framer-motion'
import { Trash2, Minus, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart } from '@/shop/hooks/useCart'
import { formatCLP } from '@/utils/formatCLP'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateItem, removeItem } = useCart()

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1) return
    try {
      await updateItem({ productId: item.product, quantity: newQty })
    } catch {
      toast.error('No se pudo actualizar')
    }
  }

  const handleRemove = async () => {
    try {
      await removeItem(item.product)
    } catch {
      toast.error('No se pudo eliminar')
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-3 py-3"
    >
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
        <img
          src={item.imageUrl || '/placeholder-product.svg'}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium leading-snug">{item.name}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg border border-border">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-l-lg rounded-r-none"
              onClick={() => handleUpdate(item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-l-none rounded-r-lg"
              onClick={() => handleUpdate(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm font-bold">{formatCLP(item.subtotal)}</p>
        </div>
      </div>
    </motion.div>
  )
}
