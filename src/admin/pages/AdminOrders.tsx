import { Helmet } from 'react-helmet-async'
import { Badge } from '@/components/ui/badge'
import { MOCK_ORDERS } from '@/mocks/data/orders.mock'
import { formatCLP } from '@/utils/formatCLP'

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  preparing: { label: 'Preparando', variant: 'default' },
  on_the_way: { label: 'En camino', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
}

export default function AdminOrders() {
  return (
    <>
      <Helmet><title>Pedidos</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{MOCK_ORDERS.length} órdenes (datos demo)</p>
        </div>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="px-5 py-3">Número</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Entrega</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map((order) => {
                  const status = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'secondary' as const }
                  const customerName = order.guestName ?? '—'
                  return (
                    <tr key={order._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-mono text-xs font-semibold">{order.orderNumber}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium">{customerName}</p>
                        {order.guestEmail && (
                          <p className="text-xs text-muted-foreground">{order.guestEmail}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground capitalize">
                        {order.fulfillmentType === 'delivery' ? 'Envío' : 'Retiro'}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={status.variant} className="text-xs">
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold">{formatCLP(order.total)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
