import { useParams, useLocation, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, ShoppingBag, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCLP } from '@/utils/formatCLP'

interface LocationState {
  orderNumber?: string
  total?: number
  email?: string
}

export default function OrderConfirmation() {
  useParams<{ id: string }>()
  const location = useLocation()
  const state = (location.state as LocationState) || {}

  return (
    <>
      <Helmet><title>Pedido confirmado</title></Helmet>

      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
        >
          <CheckCircle className="h-10 w-10 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-md space-y-4"
        >
          <h1 className="text-3xl font-bold">¡Pedido confirmado!</h1>
          <p className="text-muted-foreground">
            Tu pedido fue recibido exitosamente. Te notificaremos cuando esté listo.
          </p>

          {state.orderNumber && (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Número de pedido</p>
              <p className="mt-1 text-2xl font-bold tracking-wider">{state.orderNumber}</p>
            </div>
          )}

          {state.total !== undefined && (
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <span className="text-sm text-muted-foreground">Total pagado</span>
              <span className="text-lg font-bold">{formatCLP(state.total)}</span>
            </div>
          )}

          {state.email && (
            <p className="text-sm text-muted-foreground">
              Recibirás una confirmación en <strong>{state.email}</strong>
            </p>
          )}

          <Separator />

          <div className="flex flex-col gap-3">
            {state.orderNumber && (
              <Button variant="outline" asChild>
                <Link to={`/pedido/${state.orderNumber}`}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Seguir mi pedido
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link to="/catalogo">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Seguir comprando
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
