import { ShoppingBag } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  emptyMessage?: string
}

function ProductSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function ProductGrid({ products, isLoading, emptyMessage = 'No se encontraron productos' }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-base font-medium text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}
