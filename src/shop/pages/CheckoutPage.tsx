import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Banknote, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DeliverySelector } from '@/shop/components/checkout/DeliverySelector'
import { GuestInfoForm } from '@/shop/components/checkout/GuestInfoForm'
import { AddressForm } from '@/shop/components/checkout/AddressForm'
import { ShippingCostDisplay } from '@/shop/components/checkout/ShippingCostDisplay'
import { OrderSummary } from '@/shop/components/checkout/OrderSummary'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatCLP } from '@/utils/formatCLP'
import { useShipping } from '@/shop/hooks/useShipping'
import { useCreateOrder } from '@/shop/hooks/useOrders'
import { initMercadoPago, initWebpay } from '@/api/payments.api'
import type { FulfillmentType, PaymentMethod } from '@/types'
import type { GuestInfoData } from '@/shop/components/checkout/GuestInfoForm'
import type { AddressData } from '@/shop/components/checkout/AddressForm'

const STEPS = ['Revisar pedido', 'Entrega', 'Confirmar']

type CheckoutPaymentMethod = Extract<PaymentMethod, 'cash_on_delivery' | 'cash_on_pickup' | 'mercadopago' | 'webpay'>

interface PaymentOption {
  id: CheckoutPaymentMethod
  label: string
  description: string
  icon: React.ReactNode
  disabled?: boolean
  badge?: string
}

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const createOrder = useCreateOrder()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('delivery')
  const [guestInfo, setGuestInfo] = useState<GuestInfoData | null>(null)
  const [address, setAddress] = useState<AddressData | null>(null)
  const [addressValid, setAddressValid] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<CheckoutPaymentMethod>('cash_on_delivery')
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [pendingMpOrderId, setPendingMpOrderId] = useState<string | null>(null)
  const [pendingWpOrderId, setPendingWpOrderId] = useState<string | null>(null)

  const commune = fulfillment === 'delivery' ? (address?.commune || '') : ''
  const { data: shipping } = useShipping(commune, subtotal)
  const shippingCost = fulfillment === 'pickup' ? 0 : (shipping?.cost ?? undefined)

  if (items.length === 0) return <Navigate to="/catalogo" replace />

  const effectivePaymentMethod: CheckoutPaymentMethod =
    paymentMethod === 'mercadopago' ? 'mercadopago'
    : paymentMethod === 'webpay' ? 'webpay'
    : fulfillment === 'pickup' ? 'cash_on_pickup'
    : 'cash_on_delivery'

  const paymentOptions: PaymentOption[] = [
    {
      id: fulfillment === 'pickup' ? 'cash_on_pickup' : 'cash_on_delivery',
      label: fulfillment === 'pickup' ? 'Efectivo al retirar' : 'Efectivo al recibir',
      description: 'Paga en efectivo cuando recibas tu pedido',
      icon: <Banknote className="h-5 w-5" />,
    },
    {
      id: 'mercadopago',
      label: 'Tarjeta o transferencia',
      description: 'Paga con débito, crédito o transferencia vía MercadoPago',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c4.14 0 7.5 3.36 7.5 7.5S16.14 19.5 12 19.5 4.5 16.14 4.5 12 7.86 4.5 12 4.5zm-1 3.5v8h2V8h-2z" />
        </svg>
      ),
    },
    {
      id: 'webpay',
      label: 'WebPay / Redcompra',
      description: 'Tarjetas de débito, crédito y prepago chilenas',
      icon: <CreditCard className="h-5 w-5" />,
    },
  ]

  const canProceed = () => {
    if (step === 0) return true
    if (step === 1) {
      const contactOk = isAuthenticated || !!guestInfo
      if (fulfillment === 'delivery') return contactOk && addressValid
      return contactOk
    }
    return true
  }

  const handleConfirm = async () => {
    if (isRedirecting) return
    try {
      const customerName = isAuthenticated ? user!.name : guestInfo!.name
      const customerEmail = isAuthenticated ? user!.email : guestInfo!.email
      const customerPhone = isAuthenticated ? user?.phone : guestInfo?.phone

      const payload = {
        customerData: { name: customerName, email: customerEmail, phone: customerPhone },
        fulfillmentData: {
          type: fulfillment,
          shippingCost: fulfillment === 'pickup' ? 0 : (shippingCost ?? 0),
          ...(fulfillment === 'delivery' && address
            ? {
                address: {
                  street: address.street,
                  number: address.number,
                  commune: address.commune,
                  additionalInfo: [address.apartment, address.references].filter(Boolean).join(', ') || undefined,
                },
              }
            : {}),
        },
        paymentMethod: effectivePaymentMethod,
      }

      if (effectivePaymentMethod === 'mercadopago') {
        setIsRedirecting(true)
        const orderId = pendingMpOrderId ?? (await createOrder.mutateAsync(payload)).orderId
        if (!pendingMpOrderId) setPendingMpOrderId(orderId)
        const { init_point } = await initMercadoPago(orderId)
        window.location.href = init_point
        return
      }

      if (effectivePaymentMethod === 'webpay') {
        setIsRedirecting(true)
        const orderId = pendingWpOrderId ?? (await createOrder.mutateAsync(payload)).orderId
        if (!pendingWpOrderId) setPendingWpOrderId(orderId)
        const { token, url } = await initWebpay(orderId)
        // Transbank requiere form POST — no se puede usar window.location.href
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = url
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'token_ws'
        input.value = token
        form.appendChild(input)
        document.body.appendChild(form)
        form.submit()
        return
      }

      // Pago en efectivo — flujo normal
      const result = await createOrder.mutateAsync(payload)
      navigate(`/pedido/confirmacion/${result.orderId}`, {
        state: { orderNumber: result.orderNumber, total: result.total, email: customerEmail },
      })
    } catch {
      setIsRedirecting(false)
      toast.error('No se pudo procesar el pedido. Intenta nuevamente.')
    }
  }

  const confirmButtonLabel = () => {
    if (isRedirecting) return 'Preparando el pago...'
    if (createOrder.isPending) return 'Procesando...'
    if (effectivePaymentMethod === 'mercadopago') return 'Ir a pagar'
    if (effectivePaymentMethod === 'webpay') return 'Ir a pagar con WebPay'
    return 'Confirmar pedido'
  }

  return (
    <>
      <Helmet><title>Checkout — AMERICO</title></Helmet>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center gap-0">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${i === step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {i < STEPS.length - 1 && <Separator orientation="horizontal" className="mx-4 w-12" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {step === 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">Revisión del pedido</h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.product} className="flex items-center gap-3 rounded-xl border border-border p-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                          <img src={item.imageUrl || '/placeholder-product.svg'} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">× {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold">{formatCLP(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6">
                  {!isAuthenticated && (
                    <div>
                      <h2 className="mb-4 text-lg font-semibold">Datos de contacto</h2>
                      <GuestInfoForm onDataChange={setGuestInfo} />
                    </div>
                  )}
                  <div>
                    <h2 className="mb-4 text-lg font-semibold">Método de entrega</h2>
                    <DeliverySelector
                      value={fulfillment}
                      onChange={setFulfillment}
                      addressContent={
                        <div className="space-y-3">
                          <AddressForm onDataChange={(data, valid) => { setAddress(data); setAddressValid(valid) }} />
                          {address?.commune && <ShippingCostDisplay commune={address.commune} />}
                        </div>
                      }
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-semibold">Confirmar pedido</h2>

                  {/* Resumen de entrega */}
                  <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entrega</span>
                      <span className="font-medium">{fulfillment === 'delivery' ? `Envío a ${address?.commune}` : 'Retiro en tienda'}</span>
                    </div>
                    {!isAuthenticated && guestInfo && (
                      <>
                        <div className="flex justify-between"><span className="text-muted-foreground">Nombre</span><span>{guestInfo.name}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{guestInfo.email}</span></div>
                      </>
                    )}
                  </div>

                  {/* Selector de método de pago */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold">Método de pago</h3>
                    <div className="space-y-2">
                      {paymentOptions.map((option) => {
                        const isSelected = effectivePaymentMethod === option.id
                        if (option.disabled) {
                          return (
                            <div
                              key={option.id}
                              className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 opacity-50"
                            >
                              <div className="text-muted-foreground">{option.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-muted-foreground">{option.label}</span>
                                  {option.badge && (
                                    <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">
                                      {option.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
                              </div>
                            </div>
                          )
                        }
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setPaymentMethod(option.id)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                              isSelected
                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                : 'border-border hover:border-primary/50 hover:bg-muted/30'
                            }`}
                          >
                            <div className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                              {option.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{option.label}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
                            </div>
                            <div className={`h-4 w-4 rounded-full border-2 transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <OrderSummary shippingCost={shippingCost} commune={address?.commune} />
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || isRedirecting}>
            ← Anterior
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Continuar →
            </Button>
          ) : (
            <Button
              onClick={handleConfirm}
              disabled={createOrder.isPending || isRedirecting || !canProceed()}
            >
              {confirmButtonLabel()}
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
