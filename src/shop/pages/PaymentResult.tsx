import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ResultType = 'success' | 'failed' | 'pending' | 'unknown'

interface ResultConfig {
  type: ResultType
  icon: React.ReactNode
  title: string
  message: string
  iconColor: string
  bgColor: string
}

const RESULT_CONFIGS: Record<ResultType, Omit<ResultConfig, 'type'>> = {
  success: {
    icon: <CheckCircle className="h-16 w-16" />,
    title: '¡Pago exitoso!',
    message: 'Tu pago fue procesado correctamente. Pronto recibirás un email de confirmación con los detalles de tu pedido.',
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  failed: {
    icon: <XCircle className="h-16 w-16" />,
    title: 'Pago rechazado',
    message: 'No pudimos procesar tu pago. Puedes intentarlo nuevamente o elegir otro método de pago.',
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive/5',
  },
  pending: {
    icon: <Clock className="h-16 w-16" />,
    title: 'Pago en revisión',
    message: 'Tu pago está siendo procesado. Te notificaremos por email cuando se confirme. Puedes hacer seguimiento de tu pedido mientras tanto.',
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
  },
  unknown: {
    icon: <Clock className="h-16 w-16" />,
    title: 'Verificando pago',
    message: 'Estamos verificando el estado de tu pago. Revisa tu email o el seguimiento de tu pedido en unos minutos.',
    iconColor: 'text-stone-500',
    bgColor: 'bg-stone-50',
  },
}

const resolveResult = (params: URLSearchParams): { resultType: ResultType; orderNumber: string | null } => {
  // MercadoPago redirect params
  const collectionStatus = params.get('collection_status')
  const externalRef = params.get('external_reference')

  if (collectionStatus) {
    const resultType: ResultType =
      collectionStatus === 'approved' ? 'success'
      : collectionStatus === 'rejected' || collectionStatus === 'null' ? 'failed'
      : collectionStatus === 'in_process' || collectionStatus === 'pending' ? 'pending'
      : 'unknown'
    return { resultType, orderNumber: externalRef }
  }

  // WebPay redirect params (Sprint 6) — legible pero sin lógica aún
  const status = params.get('status')
  if (status) {
    const resultType: ResultType = status === 'ok' ? 'success' : status === 'failed' ? 'failed' : 'unknown'
    return { resultType, orderNumber: params.get('orderNumber') }
  }

  return { resultType: 'unknown', orderNumber: null }
}

export default function PaymentResult() {
  const [params] = useSearchParams()
  const { resultType, orderNumber } = resolveResult(params)
  const config = RESULT_CONFIGS[resultType]

  return (
    <>
      <Helmet><title>Resultado del pago — AMERICO</title></Helmet>

      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-border p-8 text-center shadow-sm"
        >
          {/* Ícono */}
          <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${config.bgColor}`}>
            <span className={config.iconColor}>{config.icon}</span>
          </div>

          {/* Título */}
          <h1 className="mb-3 text-2xl font-bold tracking-tight">{config.title}</h1>

          {/* Mensaje */}
          <p className="mb-2 text-sm text-muted-foreground leading-relaxed">{config.message}</p>

          {/* Número de pedido */}
          {orderNumber && (
            <p className="mb-6 text-xs text-muted-foreground">
              Pedido: <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
            </p>
          )}
          {!orderNumber && <div className="mb-6" />}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            {orderNumber && (
              <Button asChild>
                <Link to={`/pedido/${orderNumber}`}>Ver seguimiento del pedido</Link>
              </Button>
            )}

            {resultType === 'failed' && (
              <Button variant="outline" asChild>
                <Link to="/carrito">Volver al carrito</Link>
              </Button>
            )}

            {(resultType === 'pending' || resultType === 'unknown') && !orderNumber && (
              <Button variant="outline" asChild>
                <Link to="/">Ir al inicio</Link>
              </Button>
            )}

            {resultType === 'success' && (
              <Button variant="outline" asChild>
                <Link to="/catalogo">Seguir comprando</Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
