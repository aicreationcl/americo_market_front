import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { TrendingUp, Package, Tag, MapPin } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getAdminAnalytics } from '@/api/admin.api'
import { formatCLP } from '@/utils/formatCLP'

function StatCard({ label, value, sub, icon: Icon }: {
  label: string
  value: string
  sub?: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold font-mono tabular-nums tracking-tight">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
    </div>
  )
}

export default function AdminReportes() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: getAdminAnalytics,
    staleTime: 5 * 60 * 1000,
  })

  return (
    <>
      <Helmet><title>Reportes — Admin AMERICO</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Resumen de ventas e ingresos. Actualizado cada 5 minutos.
          </p>
        </div>

        {/* Revenue cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {isLoading ? (
            <>
              <Skeleton className="h-24 rounded-xl" />
              <Skeleton className="h-24 rounded-xl" />
            </>
          ) : (
            <>
              <StatCard
                label="Ingresos hoy"
                value={formatCLP(data?.revenueToday ?? 0)}
                sub="solo órdenes pagadas"
                icon={TrendingUp}
              />
              <StatCard
                label="Ingresos este mes"
                value={formatCLP(data?.revenueThisMonth ?? 0)}
                sub="solo órdenes pagadas"
                icon={TrendingUp}
              />
            </>
          )}
        </div>

        {/* Top products */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Top 5 productos por ingresos</h2>
          </div>
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <div className="overflow-x-auto">
              {isLoading ? (
                <TableSkeleton />
              ) : !data?.topProducts.length ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">Sin datos todavía</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                      <th className="px-5 py-3 w-10">#</th>
                      <th className="px-5 py-3">Producto</th>
                      <th className="px-5 py-3 text-right">Unidades</th>
                      <th className="px-5 py-3 text-right">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topProducts.map((p, i) => (
                      <tr key={p.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                        <td className="px-5 py-3 font-medium">{p.name}</td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums">{p.totalSold}</td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums font-semibold">{formatCLP(p.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Top categories */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Top 5 categorías por ingresos</h2>
          </div>
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <div className="overflow-x-auto">
              {isLoading ? (
                <TableSkeleton />
              ) : !data?.topCategories.length ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">Sin datos todavía</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                      <th className="px-5 py-3 w-10">#</th>
                      <th className="px-5 py-3">Categoría</th>
                      <th className="px-5 py-3 text-right">Líneas de pedido</th>
                      <th className="px-5 py-3 text-right">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topCategories.map((c, i) => (
                      <tr key={c.category} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                        <td className="px-5 py-3 font-medium">{c.category}</td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums">{c.orderCount}</td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums font-semibold">{formatCLP(c.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Top communes */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Top 5 comunas con más despachos</h2>
          </div>
          <div className="rounded-xl border border-border bg-background overflow-hidden">
            <div className="overflow-x-auto">
              {isLoading ? (
                <TableSkeleton />
              ) : !data?.topCommunes.length ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">Sin datos de despachos todavía</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-medium text-muted-foreground">
                      <th className="px-5 py-3 w-10">#</th>
                      <th className="px-5 py-3">Comuna</th>
                      <th className="px-5 py-3 text-right">Pedidos despachados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topCommunes.map((c, i) => (
                      <tr key={c.commune} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{i + 1}</td>
                        <td className="px-5 py-3 font-medium">{c.commune}</td>
                        <td className="px-5 py-3 text-right font-mono tabular-nums">{c.orderCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
