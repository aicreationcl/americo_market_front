import { Helmet } from 'react-helmet-async'
import { Package, Tag, ClipboardList, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { MOCK_PRODUCTS } from '@/mocks/data/products.mock'
import { MOCK_CATEGORIES } from '@/mocks/data/categories.mock'
import { MOCK_ORDERS } from '@/mocks/data/orders.mock'
import { formatCLP } from '@/utils/formatCLP'

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  preparing: { label: 'Preparando', variant: 'default' },
  on_the_way: { label: 'En camino', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
}

export default function AdminDashboard() {
  const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.total, 0)

  const stats = [
    { icon: Package, label: 'Productos', value: MOCK_PRODUCTS.length, sub: 'en catálogo' },
    { icon: Tag, label: 'Categorías', value: MOCK_CATEGORIES.length, sub: 'activas' },
    { icon: ClipboardList, label: 'Órdenes', value: MOCK_ORDERS.length, sub: 'este mes (demo)' },
    { icon: TrendingUp, label: 'Ingresos', value: formatCLP(totalRevenue), sub: 'total (demo)' },
  ]

  return (
    <>
      <Helmet><title>Dashboard</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Panel de administración</h1>
          <p className="mt-1 text-sm text-muted-foreground">Datos de demostración (modo mock)</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold">{value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="rounded-xl border border-border bg-background">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Últimas órdenes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                  <th className="px-5 py-3">Número</th>
                  <th className="px-5 py-3">Cliente</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.slice(0, 4).map((order) => {
                  const status = STATUS_LABELS[order.status] || { label: order.status, variant: 'secondary' as const }
                  return (
                    <tr key={order._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-mono text-xs font-medium">{order.orderNumber}</td>
                      <td className="px-5 py-3">
                        {order.guestName || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={status.variant} className="text-xs">
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right font-medium">{formatCLP(order.total)}</td>
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
