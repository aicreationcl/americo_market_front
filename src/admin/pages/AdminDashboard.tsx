import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { Package, Tag, ClipboardList, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { getDashboardStats } from '@/api/admin.api'
import { getProducts } from '@/api/products.api'
import { getCategories } from '@/api/categories.api'
import { formatCLP } from '@/utils/formatCLP'
import type { OrderStatus } from '@/types'

const STATUS_LABELS: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending_payment: { label: 'Pendiente pago', variant: 'secondary' },
  payment_confirmed: { label: 'Pago confirmado', variant: 'default' },
  preparing: { label: 'Preparando', variant: 'default' },
  ready_for_pickup: { label: 'Listo retiro', variant: 'default' },
  in_transit: { label: 'En camino', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
  refunded: { label: 'Reembolsado', variant: 'secondary' },
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: getDashboardStats,
    staleTime: 60 * 1000,
  })

  const { data: products } = useQuery({
    queryKey: ['products', { limit: 1 }],
    queryFn: () => getProducts({ limit: 1 }),
    staleTime: 5 * 60 * 1000,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  })

  const statCards = [
    { icon: Package, label: 'Productos', value: products?.total ?? '—', sub: 'en catálogo' },
    { icon: Tag, label: 'Categorías', value: categories?.length ?? '—', sub: 'activas' },
    { icon: ClipboardList, label: 'Órdenes hoy', value: stats?.ordersToday ?? '—', sub: 'pedidos recibidos hoy' },
    { icon: TrendingUp, label: 'Ingresos hoy', value: stats ? formatCLP(stats.revenueToday) : '—', sub: 'ventas de hoy' },
  ]

  return (
    <>
      <Helmet><title>Dashboard — Admin AMERICO</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de administración</h1>
          <p className="mt-1 text-sm text-muted-foreground">Datos en tiempo real desde la base de datos</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              {statsLoading ? (
                <Skeleton className="mt-3 h-8 w-16" />
              ) : (
                <p className="mt-3 text-2xl font-bold">{value}</p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-background">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Últimas órdenes</h2>
          </div>
          <div className="overflow-x-auto">
            {statsLoading ? (
              <div className="space-y-3 p-5">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : !stats?.recentOrders?.length ? (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No hay órdenes todavía
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                    <th className="px-5 py-3">Número</th>
                    <th className="px-5 py-3">Estado</th>
                    <th className="px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => {
                    const status = STATUS_LABELS[order.status] ?? { label: order.status, variant: 'secondary' as const }
                    return (
                      <tr key={order._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 font-mono text-xs font-medium">{order.orderNumber}</td>
                        <td className="px-5 py-3">
                          <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                        </td>
                        <td className="px-5 py-3 text-right font-medium">{formatCLP(order.total)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {stats && stats.lowStockCount > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
            <p className="text-sm font-semibold text-amber-800">
              ⚠️ {stats.lowStockCount} producto{stats.lowStockCount !== 1 ? 's' : ''} con stock bajo
            </p>
            <p className="mt-1 text-xs text-amber-700">Revisa la sección Productos para actualizar el stock.</p>
          </div>
        )}
      </div>
    </>
  )
}
