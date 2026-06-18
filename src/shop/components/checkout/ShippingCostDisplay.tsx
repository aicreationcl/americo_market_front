import { PackageCheck } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCLP } from '@/utils/formatCLP'
import { useShipping } from '@/shop/hooks/useShipping'
import { useCartStore } from '@/store/cartStore'

interface ShippingCostDisplayProps {
  commune: string
}

export function ShippingCostDisplay({ commune }: ShippingCostDisplayProps) {
  const subtotal = useCartStore((s) => s.subtotal)
  const { data, isLoading } = useShipping(commune, subtotal)

  if (!commune) return null

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
        <PackageCheck className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-4 w-32" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className={`flex items-center gap-2 rounded-lg p-3 ${data.isFree ? 'bg-green-50 text-green-700' : 'bg-muted'}`}>
      <PackageCheck className={`h-4 w-4 ${data.isFree ? 'text-green-600' : 'text-muted-foreground'}`} />
      <div>
        {data.isFree ? (
          <p className="text-sm font-medium">¡Envío gratis a {commune}!</p>
        ) : (
          <p className="text-sm">Envío a {commune}: <strong>{formatCLP(data.cost)}</strong></p>
        )}
        <p className="text-xs text-muted-foreground">Estimado: {data.estimatedDays} días hábil{data.estimatedDays !== 1 ? 'es' : ''}</p>
      </div>
    </div>
  )
}
