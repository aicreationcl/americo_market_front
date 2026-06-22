import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrders } from '@/shop/hooks/useOrders'
import { formatCLP } from '@/utils/formatCLP'
import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending_payment: { label: 'Pendiente de pago', variant: 'secondary' },
  payment_confirmed: { label: 'Pago confirmado', variant: 'default' },
  preparing: { label: 'Preparando', variant: 'default' },
  ready_for_pickup: { label: 'Listo para retiro', variant: 'default' },
  in_transit: { label: 'En camino', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
  refunded: { label: 'Reembolsado', variant: 'secondary' },
}

export default function AccountOrders() {
  const { data: orders, isLoading } = useOrders()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    )
  }

  if (!orders?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background py-16 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="font-semibold">No tienes pedidos todavía</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Explora el catálogo y haz tu primer pedido
        </p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/catalogo">Ver productos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const status = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'secondary' as const }
        const itemCount = order.items.reduce((s, i) => s + i.quantity, 0)

        return (
          <div key={order._id} className="rounded-xl border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('es-CL', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {itemCount} {itemCount === 1 ? 'producto' : 'productos'} ·{' '}
                  {order.fulfillmentData?.type === 'delivery' ? 'Envío a domicilio' : 'Retiro en tienda'}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold">{formatCLP(order.total)}</p>
                <Badge variant={status.variant} className="mt-1 text-xs">
                  {status.label}
                </Badge>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" asChild className="text-xs gap-1.5">
                <Link to={`/pedido/${order.orderNumber}`}>
                  Ver seguimiento
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
