import { Separator } from '@/components/ui/separator'
import { formatCLP } from '@/utils/formatCLP'
import { useCartStore } from '@/store/cartStore'

interface OrderSummaryProps {
  shippingCost?: number
  commune?: string
}

export function OrderSummary({ shippingCost, commune }: OrderSummaryProps) {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal)
  const total = subtotal + (shippingCost ?? 0)

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <h3 className="font-semibold">Resumen del pedido</h3>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={item._id} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-stone-100">
                <img
                  src={item.product.images?.[0]?.url || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="truncate text-muted-foreground">
                {item.product.name} × {item.quantity}
              </span>
            </div>
            <span className="shrink-0 font-medium">{formatCLP(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCLP(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Envío{commune ? ` a ${commune}` : ''}</span>
          {shippingCost === undefined ? (
            <span className="text-muted-foreground">Por calcular</span>
          ) : shippingCost === 0 ? (
            <span className="text-green-600 font-medium">¡Gratis!</span>
          ) : (
            <span>{formatCLP(shippingCost)}</span>
          )}
        </div>
        <Separator />
        <div className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span>{formatCLP(total)}</span>
        </div>
      </div>
    </div>
  )
}
