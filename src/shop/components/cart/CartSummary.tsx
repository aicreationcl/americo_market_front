import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCLP } from '@/utils/formatCLP'

interface CartSummaryProps {
  subtotal: number
  shippingCost?: number | null
  isLoadingShipping?: boolean
  className?: string
}

export function CartSummary({ subtotal, shippingCost, isLoadingShipping, className }: CartSummaryProps) {
  const total = subtotal + (shippingCost ?? 0)

  return (
    <div className={className}>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resumen del pedido</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCLP(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Envío</span>
          {isLoadingShipping ? (
            <Skeleton className="h-4 w-16" />
          ) : shippingCost === null || shippingCost === undefined ? (
            <span className="text-muted-foreground">Por calcular</span>
          ) : shippingCost === 0 ? (
            <span className="font-medium text-green-600">¡Gratis!</span>
          ) : (
            <span>{formatCLP(shippingCost)}</span>
          )}
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span className="text-lg">{formatCLP(total)}</span>
        </div>
      </div>
    </div>
  )
}
