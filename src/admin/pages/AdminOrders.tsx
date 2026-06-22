import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAdminOrders, updateOrderStatus } from '@/api/admin.api'
import { formatCLP } from '@/utils/formatCLP'
import { toast } from 'sonner'
import type { OrderStatus } from '@/types'

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending_payment: { label: 'Pendiente pago', variant: 'secondary' },
  payment_confirmed: { label: 'Pago confirmado', variant: 'default' },
  preparing: { label: 'Preparando', variant: 'default' },
  ready_for_pickup: { label: 'Listo retiro', variant: 'default' },
  in_transit: { label: 'En camino', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
  refunded: { label: 'Reembolsado', variant: 'secondary' },
}

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[]

export default function AdminOrders() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => getAdminOrders({ limit: 50 }),
    staleTime: 30 * 1000,
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
      toast.success('Estado actualizado')
    },
    onError: () => toast.error('No se pudo actualizar el estado'),
  })

  const orders = data?.data ?? []

  return (
    <>
      <Helmet><title>Pedidos — Admin AMERICO</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? '...' : `${data?.pagination.total ?? 0} órdenes en total`}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background overflow-hidden">
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="space-y-3 p-5">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                No hay pedidos todavía. Los pedidos de clientes aparecerán aquí.
              </div>
            ) : (
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
                  {orders.map((order) => {
                    const status = STATUS_CONFIG[order.status] ?? { label: order.status, variant: 'secondary' as const }
                    return (
                      <tr key={order._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 font-mono text-xs font-semibold">{order.orderNumber}</td>
                        <td className="px-5 py-3">
                          <p className="font-medium">{order.customerData?.name ?? '—'}</p>
                          <p className="text-xs text-muted-foreground">{order.customerData?.email}</p>
                        </td>
                        <td className="px-5 py-3 text-muted-foreground capitalize">
                          {order.fulfillmentData?.type === 'delivery' ? 'Envío' : 'Retiro'}
                        </td>
                        <td className="px-5 py-3">
                          <Select
                            value={order.status}
                            onValueChange={(val) =>
                              statusMutation.mutate({ id: order._id, status: val as OrderStatus })
                            }
                            disabled={statusMutation.isPending}
                          >
                            <SelectTrigger className="h-8 w-36 text-xs">
                              <SelectValue>
                                <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {ALL_STATUSES.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs">
                                  {STATUS_CONFIG[s].label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-5 py-3 text-right font-semibold">{formatCLP(order.total)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
