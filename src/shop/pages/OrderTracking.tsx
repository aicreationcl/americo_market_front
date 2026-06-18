import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Search, CheckCircle, Package, Truck, Home } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useTrackOrder } from '@/shop/hooks/useOrders'
import { formatCLP } from '@/utils/formatCLP'
import type { OrderStatus } from '@/types'

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'pending', label: 'Pedido recibido', icon: CheckCircle },
  { key: 'confirmed', label: 'Confirmado', icon: CheckCircle },
  { key: 'preparing', label: 'En preparación', icon: Package },
  { key: 'on_the_way', label: 'En camino', icon: Truck },
  { key: 'delivered', label: 'Entregado', icon: Home },
]

export default function OrderTracking() {
  const { orderNumber: paramOrderNumber } = useParams<{ orderNumber: string }>()
  const [query, setQuery] = useState(paramOrderNumber || '')
  const [searched, setSearched] = useState(!!paramOrderNumber)

  const { data: order, isLoading, error } = useTrackOrder(searched ? query : '')

  const currentStepIdx = order
    ? STATUS_STEPS.findIndex((s) => s.key === order.status)
    : -1

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) setSearched(true)
  }

  return (
    <>
      <Helmet><title>Seguimiento de pedido</title></Helmet>

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Seguimiento de pedido</h1>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: AME-2024-00001"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            <Search className="h-4 w-4" />
          </Button>
        </form>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
            No se encontró el pedido <strong>{query}</strong>
          </div>
        )}

        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pedido</p>
                  <p className="mt-1 text-xl font-bold">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-bold">{formatCLP(order.total)}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {STATUS_STEPS.map((s, i) => {
                const isDone = i <= currentStepIdx
                const isCurrent = i === currentStepIdx
                const Icon = s.icon
                return (
                  <div key={s.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={false}
                        animate={{ scale: isCurrent ? 1.15 : 1 }}
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isDone ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                      >
                        <Icon className="h-4 w-4" />
                      </motion.div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`mt-0.5 h-8 w-0.5 ${i < currentStepIdx ? 'bg-primary' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="pb-4 pt-1.5">
                      <p className={`text-sm font-medium ${isDone ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {s.label}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Separator />

            <div className="space-y-1.5 text-sm">
              <p className="text-muted-foreground">
                Tipo: <strong>{order.fulfillmentType === 'delivery' ? 'Envío a domicilio' : 'Retiro en tienda'}</strong>
              </p>
              {order.deliveryAddress && (
                <p className="text-muted-foreground">
                  Dirección: <strong>{order.deliveryAddress.street} {order.deliveryAddress.number}, {order.deliveryAddress.commune}</strong>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </>
  )
}
