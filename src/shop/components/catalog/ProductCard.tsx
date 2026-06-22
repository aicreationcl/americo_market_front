import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/shop/hooks/useCart'
import { useUIStore } from '@/store/uiStore'
import { formatCLP } from '@/utils/formatCLP'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isAddingItem } = useCart()
  const openCart = useUIStore((s) => s.openCart)

  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0
  const inStock = product.stock > 0
  const imageUrl = product.images?.[0]?.url || '/placeholder-product.svg'

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!inStock) return
    try {
      await addItem({ productId: product._id, quantity: 1 })
      toast.success(`${product.name} agregado al carrito`)
      openCart()
    } catch {
      toast.error('No se pudo agregar al carrito')
    }
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
        <Link to={`/producto/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-stone-100">
            <img
              src={imageUrl}
              alt={product.images?.[0]?.alt || product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {hasDiscount && (
                <Badge variant="destructive" className="text-[10px]">
                  -{discountPct}%
                </Badge>
              )}
              {!inStock && (
                <Badge variant="secondary" className="text-[10px]">
                  Sin stock
                </Badge>
              )}
            </div>
          </div>
        </Link>
        <CardContent className="p-3">
          <Link to={`/producto/${product.slug}`}>
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="mt-2 flex items-end justify-between gap-2">
            <div>
              <p className="text-base font-bold text-foreground">{formatCLP(product.price)}</p>
              {hasDiscount && (
                <p className="text-xs text-muted-foreground line-through">{formatCLP(product.compareAtPrice!)}</p>
              )}
            </div>
            <Button
              size="sm"
              variant={inStock ? 'default' : 'secondary'}
              disabled={!inStock || isAddingItem}
              onClick={handleAddToCart}
              className="shrink-0"
              title={inStock ? 'Agregar al carrito' : 'Sin stock'}
            >
              {inStock ? <ShoppingCart className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
